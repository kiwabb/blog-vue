<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.name }}</div>
    <div class="article-status-menu">
      <span>状态</span>
      <span @click="changeStatus('all')" :class="{'active-status' : activeStatus === 'all'}">全部</span>
      <span @click="changeStatus('draft')" :class="{'active-status' : activeStatus === 'draft'}">
        草稿箱
    </span>
      <span @click="changeStatus('delete')" :class="{'active-status' : activeStatus === 'delete'}">
        回收站
      </span>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
          v-if="isDelete === 0"
          type="danger"
          size="small"
          icon="el-icon-delete"
          :disabled="articleIdList.length === 0"
          @click="updateIsDelete = true"
      >
        批量删除
      </el-button>
      <el-button
          v-else
          type="danger"
          size="small"
          icon="el-icon-delete"
          :disabled="articleIdList.length === 0"
          @click="remove = true"
      >
        批量删除
      </el-button>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 分类 -->
        <el-select
            clearable
            size="small"
            v-model="categoryId"
            filterable
            placeholder="请选择分类"
            style="margin-right:1rem"
        >
          <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
          />
        </el-select>
        <!-- 标签 -->
        <el-select
            clearable
            size="small"
            v-model="tagId"
            filterable
            placeholder="请选择标签"
            style="margin-right:1rem"
        >
          <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.tagName"
              :value="item.id"
          />
        </el-select>
        <!-- 文章名 -->
        <el-input
            clearable
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入文章名"
            style="width:200px"
            @keyup.enter.native="searchArticles"
        />
        <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left:1rem"
            @click="searchArticles"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
        border
        :data="articleList"
        @selection-change="selectionChange"
        v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 文章修改时间 -->
      <el-table-column
          prop="articleCover"
          label="文章封面"
          width="180"
          align="center"
      >
        <template #default="scope">
          <el-image
              style="width: 50px; height: 50px"
              class="article-cover"
              :src="
              scope.row.articleCover
                ? scope.row.articleCover
                : 'https://www.static.talkxj.com/articles/c5cc2b2561bd0e3060a500198a4ad37d.png'
            "
          />
        </template>
      </el-table-column>
      <!-- 文章标题 -->
      <el-table-column prop="articleTitle" label="标题" align="center" />
      <!-- 文章分类 -->
      <el-table-column
          prop="categoryName"
          label="分类"
          width="110"
          align="center"
      />
      <!-- 文章标签 -->
      <el-table-column
          prop="tagDTOList"
          label="标签"
          width="170"
          align="center"
      >
        <template #default="scope">
          <el-tag
              v-for="item of scope.row.tagDTOList"
              :key="item.tagId"
              style="margin-right:0.2rem;margin-top:0.2rem"
          >
            {{ item.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章浏览量 -->
      <el-table-column
          prop="viewsCount"
          label="浏览量"
          width="70"
          align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.viewsCount">
            {{ scope.row.viewsCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="likeCount"
          label="点赞量"
          width="70"
          align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.likeCount">
            {{ scope.row.likeCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章发表时间 -->
      <el-table-column
          prop="createTime"
          label="发表时间"
          width="130"
          align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{
            this.$filters.dateFormat(scope.row.createTime)
          }}
        </template>
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间"
          width="130"
          align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{
            this.$filters.dateFormat(scope.row.updateTime)
          }}
        </template>
      </el-table-column>
      <el-table-column prop="isTop" label="置顶" width="80" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.top"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :disabled="scope.row.delete === 1"
              :active-value="1"
              :inactive-value="0"
              @change="changeTop(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
              type="primary"
              size="mini"
              @click="editArticle(scope.row.id)"
          >
            编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:10px"
              @confirm="logicDeleteArticle(scope.row.id)"
          >
            <template #reference>
              <el-button
                  size="mini"
                  type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        class="pagination-container"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="current"
        :page-size="size"
        :total="count"
        :page-sizes="[10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 批量逻辑删除对话框 -->
    <el-dialog v-model="updateIsDelete" width="30%">
      <template #title>
        <div class="dialog-title-container">
          <i class="el-icon-warning" style="color:#ff9900" />提示
        </div>
      </template>
      <div style="font-size:1rem">是否删除选中项？</div>
      <template #footer >
        <el-button @click="updateIsDelete = false">取 消</el-button>
        <el-button type="primary" @click="logicDeleteArticle(null)">
          确 定
        </el-button>
      </template>
    </el-dialog>
    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="remove" width="30%">
      <template #title>
        <div class="dialog-title-container" slot="title">
          <i class="el-icon-warning" style="color:#ff9900" />提示
        </div>
      </template>
      <div style="font-size:1rem">是否彻底删除选中项？</div>
      <template #footer>
        <el-button @click="remove = false">取 消</el-button>
        <el-button type="primary" @click="deleteArticles(null)">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>

</template>

<script>
import message from "@/assets/js/message";

export default {
  data: function() {
    return {
      updateIsDelete: false,
      isDelete: 0,
      status: null,
      activeStatus: "all",
      articleIdList: [],
      remove: false,
      categoryId: null,
      categoryList: [],
      articleList: [],
      tagList: [],
      tagId: null,
      keywords: null,
      current: 1,
      size: 10,
      count: 0,
      loading: true,
    }
  },
  created() {
    this.listArticles();
    this.listCategories();
    this.listTags();
  },
  computed: {
  },
  methods: {
    editArticle(id) {
      this.$router.push({ path: "/articles/" + id });
    },
    changeTop(article) {
      this.$axios
          .put("/api/admin/articles/top", {
            id: article.id,
            top: article.top
          })
          .then(({ data }) => {
            if (!data.code) {
              message.success("修改成功"
              );
            } else {
              message.error(data.message
              );
            }
            this.remove = false;
          });
    },
    logicDeleteArticle(id) {
      let param = {};
      if (id != null) {
        param = {data: [id]};
      } else {
        param = {data: this.articleIdList};
      }
      this.$axios.delete("/api/admin/articles/logicDelete", param).then(({ data }) => {
        if (!data.code) {
          message.success("删除成功！");
          this.listArticles();
        } else {
          message.error(
            data.message
          );
        }
        this.updateIsDelete = false;
      });
    },
    deleteArticles(id) {
      let param = {};
      if (id == null) {
        param = { data: this.articleIdList };
      } else {
        param = { data: [id] };
      }
      this.axios.delete("/api/admin/articles", param).then(({ data }) => {
        if (!data.code) {
          message.success(data.message);
          this.listArticles();
        } else {
          message.error( data.message);
        }
        this.remove = false;
      });
    },
    searchArticles() {
      this.current = 1;
      this.listArticles();
    },
    selectionChange(articleList) {
      this.articleIdList = [];
      articleList.forEach(item => {
        this.articleIdList.push(item.id);
      });
    },
    currentChange(current) {
      this.current = current;
      this.listArticles();
    },
    sizeChange(size) {
      this.size = size;
      this.listArticles();
    },
    listCategories() {
      this.$axios.get("/api/admin/category/allCategory").then(({ data }) => {
        this.categoryList = data.data;
      });
    },
    listTags() {
      this.$axios.get("/api/admin/tag/allTag").then(({ data }) => {
        this.tagList = data.data;
      });
    },
    listArticles() {
      this.$axios
          .get("/api/admin/articles", {
            params: {
              current: this.current,
              size: this.size,
              keywords: this.keywords,
              categoryId: this.categoryId,
              tagId: this.tagId,
              delete: this.isDelete
            }
          })
          .then(({data} ) => {
            this.articleList = data.data.recordList;
            this.count = data.data.count;
            this.loading = false;
          });
    },
    changeStatus(status) {
      switch (status) {
        case "all":
          this.isDelete = 0;
          this.status = null;
          break;
        case "draft":
          this.isDelete = 0;
          this.status = 3;
          break;
        case "delete":
          this.isDelete = 1;
          this.status = null;
          break;
      }
      this.activeStatus = status;
    },
  }
}
</script>

<style scoped>
.article-status-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
}
.article-status-menu span {
  cursor: pointer;
  margin-right: 24px;
}
.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
</style>
