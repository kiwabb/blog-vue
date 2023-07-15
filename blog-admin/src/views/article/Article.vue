<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.name }}</div>
    <div class="article-title-container">
      <el-input
          v-model="article.articleTitle"
          size="medium"
          placeholder="请输入文章标题"
      ></el-input>
      <el-popconfirm
          v-if="article.status === 0"
          title="是否上架文章？"
          style="margin-left:10px"
          confirm-button-text="通过"
          cancel-button-text="不通过"
          @confirm="throughArticle"
          @cancel="refuseArticle"
      >
        <template #reference>
          <el-button
              size="mini"
              type="danger"
          >
            审核
          </el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
          v-if="article.status === 1"
          title="确定下架文章？"
          style="margin-left:10px"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="refuseArticle"
      >
        <template #reference>
          <el-button
              size="mini"
              type="danger"
          >
            下架文章
          </el-button>
        </template>
      </el-popconfirm>
    </div>
<!--    文章内容-->
    <v-md-editor
        v-model="article.articleContent"
        height="calc(100vh - 260px)">
    </v-md-editor>

    <el-dialog v-model="addOrEdit" width="45%" top="10vh">
     <template #title>
       <div class="dialog-title-container">
         上传文章
       </div>
     </template>
<!--      文章数据-->
      <el-form label-width="80px" size="medium" :model="article">
        <el-form-item label="文章分类">
          <el-select v-model="article.categoryId" placeholder="请选择文章分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-select
              v-model="article.tagIdList"
              multiple
              placeholder="请选择标签"
          >
            <el-option
                v-for="item in tagList"
                :key="item.id"
                :label="item.tagName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            :limit="1"
            class="upload-cover"
            drag
            action="/oss/blog/upload"
            multiple
            :on-success="uploadCover"
            :on-error="uploadError"
          >
            <i class="el-icon-upload" v-if="article.articleCover === ''" />
            <div class="el-upload__text" v-if="article.articleCover === ''">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
                v-else
                :src="article.articleCover"
                width="360px"
                height="180px"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
              v-model="article.top"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle">
          发 表
        </el-button>
      </template>
    </el-dialog>
  </el-card>

</template>

<script>
import message from "@/assets/js/message";
import {getArticleInfo, saveArticle} from "@/api/article";
import {listCategories} from "@/api/category";
import {listTags} from "@/api/tag";
import {ElMessage} from "_element-plus@1.1.0-beta.24@element-plus";

export default {
  data: function() {
    return {
      addOrEdit: false,
      autoSave: true,
      categoryList: [],
      tagList: [],
      article: {
        id: null,
        articleTitle: "",
        articleContent: "",
        articleCover: "",
        categoryId: "",
        tagIdList: [],
        top: 0,
        status: 0
      }
    };
  },
  created() {
    let articleId = this.$route.params.id
    if (articleId) {
      getArticleInfo(articleId).then(( data ) => {
        this.article = data.data;
      });
    } else {
      // const article = sessionStorage.getItem("article");
      // if (article) {
      //   this.article = JSON.parse(article);
      // }
    }
  },
  destroyed() {
    //文章自动保存功能
    this.autoSaveArticle();
  },
  methods: {

    throughArticle() {
      this.article.status = 1;
      this.updateArticleStatus();

    },
    refuseArticle() {
      this.article.status = 2;
      this.updateArticleStatus();
    },
    updateArticleStatus() {
      saveArticle(this.article).then(res => {
        if (!res.code) {
          this.$router.go(-1)
          ElMessage.success("成功！")
        }
      })
    },
    saveArticleDraft() {
      if (this.article.articleTitle.trim() === "") {
        message.error("文章标题不能为空");
        return false;
      }
      if (this.article.articleContent.trim() === "") {
        message.error("文章内容不能为空");
        return false;
      }
      this.article.draft = 1;
      saveArticle(this.article).then(( data ) => {
        if (!data.code) {
          message.success("保存草稿成功"
          );
        } else {
          message.error( "保存草稿失败"
          );
        }
      });
      //关闭自动保存功能
      this.autoSave = false;
    },
    autoSaveArticle() {
      // 自动上传文章
      if (
          this.autoSave &&
          this.article.articleTitle.trim() !== "" &&
          this.article.articleContent.trim() !== "" &&
          this.article.id != null
      ) {
        saveArticle(this.article).then(( data ) => {
          if (!data.code) {
            message.success("自动保存成功"
            );
          } else {
            message.error("自动保存失败"
            );
          }
        });

      }
      // 保存本地文章记录
      if (this.autoSave && this.article.id == null) {
        sessionStorage.setItem("article", JSON.stringify(this.article));
      }
    },
    initCategoryTagList() {
      listCategories().then((data) => {
        this.categoryList = data.data;
      })
      listTags().then((data) => {
        this.tagList = data.data;
      })
    },
    uploadCover(response) {
      this.article.articleCover = response.data;
    },
    uploadError() {
      message.error("文件上传错误！")
    },
    //打开添加文章弹窗
    openDialog() {
      if (this.article.articleTitle.trim() === "") {
        message.error("文章标题不能为空");
        return false;
      }
      if (this.article.articleContent.trim() === "") {
        message.error("文章内容不能为空");
        return false;
      }
      this.addOrEdit = true;
      this.initCategoryTagList();
    },
    //保存或修改文章
    saveOrUpdateArticle() {
      if (this.article.articleTitle.trim() === "") {
        message.error("文章标题不能为空");
        return false;
      }
      if (this.article.articleContent.trim() === "") {
        message.error("文章内容不能为空");
        return false;
      }
      if (this.article.categoryName === null) {
        message.error("文章分类不能为空");
        return false;
      }
      if (this.article.tagIdList.length === 0) {
        message.error("文章标签不能为空");
        return false;
      }
      saveArticle(this.article).then(( data ) => {
        if (!data.code) {
          message.success({
            title: "成功",
            message: data.message
          });
          this.$router.push({ path: "/articleList/"});
        } else {
          message.error({
            title: "失败",
            message: data.message
          });
        }
        this.addOrEdit = false;
      });
    }
  }
}
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
</style>
