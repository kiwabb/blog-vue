<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <div class="review-menu">
      <span>状态</span>
      <span
        @click="changeReview(null)"
        :class="isReview === null ? 'active-review' : 'review'"
      >
        全部
      </span>
      <span
        @click="changeReview(1)"
        :class="isReview === 1 ? 'active-review' : 'review'"
      >
        正常
      </span>
      <span
        @click="changeReview(0)"
        :class="isReview === 0 ? 'active-review' : 'review'"
      >
        审核中
      </span>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="commentIdList.length === 0"
        @click="remove = true"
      >
        批量删除
      </el-button>
      <el-button
        type="success"
        size="small"
        icon="el-icon-success"
        :disabled="commentIdList.length === 0"
        @click="updateCommentReview(null)"
      >
        批量通过
      </el-button>
      <!-- 数据筛选 -->
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入用户昵称"
          style="width:200px"
          @keyup.enter.native="searchComments"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchComments"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="commentList"
      @selection-change="selectionChange"
      v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="avatar" label="头像" align="center" width="120">
        <template #default="scope">
          <img :src="scope.row.avatar" width="40" height="40" />
        </template>
      </el-table-column>
      <!-- 评论人昵称 -->
      <el-table-column
        prop="nickname"
        label="评论人"
        align="center"
        width="120"
      />
      <!-- 回复人昵称 -->
      <el-table-column
        prop="replyNickname"
        label="回复人"
        align="center"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.replyNickname">
            {{ scope.row.replyNickname }}
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <!-- 评论文章标题 -->
      <el-table-column prop="articleTitle" label="文章标题" align="center">
        <template #default="scope">
          <span v-if="scope.row.articleTitle">
            {{ scope.row.articleTitle }}
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <!-- 评论内容 -->
      <el-table-column prop="commentContent" label="评论内容" align="center">
        <template #default="scope">
          <span v-html="scope.row.commentContent" class="comment-content" />
        </template>
      </el-table-column>
      <!-- 评论时间 -->
      <el-table-column
        prop="createTime"
        label="评论时间"
        width="200"
        align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{
            this.$filters.timeDateFormat(scope.row.createTime)
          }}
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="isReview" label="状态" width="80" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.isReview === 0" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.isReview === 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <!-- 来源 -->
      <el-table-column label="来源" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 1">文章</el-tag>
          <el-tag v-if="scope.row.type === 2" type="warning">友链</el-tag>
          <el-tag v-if="scope.row.type === 3" type="danger">说说</el-tag>
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.isReview === 0"
            size="mini"
            type="success"
            slot="reference"
            @click="updateCommentReview(scope.row.id)"
          >
            通过
          </el-button>
          <el-popconfirm
            style="margin-left:10px"
            title="确定删除吗？"
            @confirm="deleteComments(scope.row.id)"
          >
            <template #reference>
              <el-button size="mini" type="danger">
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
    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="remove" width="30%">
      <template #title>
        <div class="dialog-title-container">
          <i class="el-icon-warning" style="color:#ff9900" />提示
        </div>
      </template>

      <div style="font-size:1rem">是否彻底删除选中项？</div>
      <template #footer>
        <div>
          <el-button @click="remove = false">取 消</el-button>
          <el-button type="primary" @click="deleteComments(null)">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import {deleteComments, listComments, updateCommentReview} from "@/api/comment";
import Message from "@/assets/js/message";

export default {
  created() {
    this.listComments();
  },
  data: function() {
    return {
      loading: false,
      remove: false,
      options: [
        {
          value: 1,
          label: "文章"
        },
        {
          value: 2,
          label: "友链"
        },
        {
          value: 3,
          label: "说说"
        }
      ],
      commentList: [],
      commentIdList: [],
      type: null,
      keywords: null,
      isReview: null,
      current: 1,
      size: 10,
      count: 0
    };
  },
  methods: {
    selectionChange(commentList) {
      this.commentIdList = [];
      commentList.forEach(item => {
        this.commentIdList.push(item.id);
      });
    },
    searchComments() {
      this.current = 1;
      this.listComments();
    },
    sizeChange(size) {
      this.size = size;
      this.listComments();
    },
    currentChange(current) {
      this.current = current;
      this.listComments();
    },
    changeReview(review) {
      this.current = 1;
      this.isReview = review;
    },
    updateCommentReview(id) {
      let param = {};
      if (id != null) {
        param.idList = [id];
      } else {
        param.idList = this.commentIdList;
      }
      param.isReview = 1;
      updateCommentReview(param).then(( data ) => {
        if (data.flag) {
          Message.success( data.message);
          this.listComments();
        } else {
          Message.error(data.message);
        }
      });
    },
    deleteComments(id) {
      var param = {};
      if (id == null) {
        param = this.commentIdList;
      } else {
        param = [id];
      }
      deleteComments(param).then(( data ) => {
        if (data.code === 0) {
          Message.success(data.message);
          this.listComments();
        } else {
          Message.error(data.message);
        }
        this.remove = false;
      });
    },
    listComments() {
      let params = {
        current: this.current,
        size: this.size,
        keywords: this.keywords,
        type: this.type,
        isReview: this.isReview
      }
      listComments(params).then(( data ) => {
        console.log(data.data)
        this.commentList = data.data.recordList;
        this.count = data.data.count;
        this.loading = false;
      });
    }
  },
  watch: {
    isReview() {
      this.current = 1;
      this.listComments();
    },
    type() {
      this.current = 1;
      this.listComments();
    }
  }
};
</script>

<style scoped>
.comment-content {
  display: inline-block;
}
.operation-container {
  margin-top: 1.5rem;
}
.review-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
}
.review-menu span {
  margin-right: 24px;
}
.review {
  cursor: pointer;
}
.active-review {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
</style>
