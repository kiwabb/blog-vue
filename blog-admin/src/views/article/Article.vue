<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.name }}</div>
    <div class="article-title-container">
      <el-input
          v-model="article.articleTitle"
          size="medium"
          placeholder="请输入文章标题"
      ></el-input>
      <el-button
          type="danger"
          size="medium"
          class="save-btn"
          v-if="article.isDraft !== 0"
      >
        保存草稿
      </el-button>
      <el-button
        type="danger"
        size="medium"
        @click="addOrEdit = true"
        style="margin-left:10px">
        发布文章
      </el-button>
    </div>
<!--    文章内容-->
    <v-md-editor
        v-model="article.articleContent"
        height="calc(100vh - 260px)">
    </v-md-editor>
    <el-dialog v-model="addOrEdit" width="40%" top="10vh">
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
              class="upload-cover"
              drag
              action="/oss/blog/upload"
              multiple
              :on-success="uploadCover"
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
              v-model="article.isTop"
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
        categoryId: null,
        tagIdList: [],
        isTop: 0,
        isDraft: null
      }
    };
  },
  created() {
    this.initCategoryTagList();
  },
  methods: {
    initCategoryTagList() {
      this.$axios.get("/api/admin/category/allCategory").then(({data}) => {
        this.categoryList = data.data;
      })
      this.$axios.get("/api/admin/tag/allTag").then(({data}) => {
        this.tagList = data.data;
      })
    },
    uploadCover(response) {
      this.article.articleCover = response.data;
    },
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
