<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入昵称"
            style="width:200px"
            @keyup.enter.native="searchUsers"
        />
        <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left:1rem"
            @click="searchUsers"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table border :data="userList" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column
          prop="linkAvatar"
          label="头像"
          align="center"
          width="100"
      >
        <template #default="scope">
          <img :src="scope.row.avatar" width="40" height="40" />
        </template>
      </el-table-column>
      <el-table-column
          prop="nickname"
          label="昵称"
          align="center"
          width="140"
      />
      <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="180"
      />
      <el-table-column
          prop="phone"
          label="电话号码"
          align="center"
          width="140"
      />
      <el-table-column
          prop="intro"
          label="简介"
          align="center"
          width="300"
      />
      <el-table-column
          prop="points"
          label="积分"
          align="center"
          width="80"
      />
      <el-table-column
          prop="createTime"
          label="注册时间"
          width="130"
          align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{
            this.$filters.dateFormat(scope.row.createTime)
          }}
        </template>
      </el-table-column>

      <!-- 列操作 -->
      <el-table-column prop="isDisable" label="禁用" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isDisable"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
              @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
              type="text"
              size="mini"
              @click="resetPassword(scope.row.id)"
          >
            <i class="el-icon-edit" />重制密码
          </el-button>
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
  </el-card>
</template>

<script>
import {ElMessage} from "element-plus";
import {listRoles} from "@/api/role";
import {changeDisable, listUsers} from "@/api/user";

export default {
  created() {
    this.listUsers();
  },
  data: function() {
    return {
      loading: true,
      isEdit: false,
      userForm: {
        userInfoId: null,
        nickname: ""
      },
      loginType: null,
      userRoleList: [],
      roleIdList: [],
      userList: [],
      keywords: null,
      current: 1,
      size: 10,
      count: 0
    };
  },
  methods: {
    searchUsers() {
      this.current = 1;
      this.listUsers();
    },
    sizeChange(size) {
      this.size = size;
      this.listUsers();
    },
    currentChange(current) {
      this.current = current;
      this.listUsers();
    },
    changeDisable(user) {
      const query = {
        id: user.id,
        isDisable: user.isDisable
      }
      changeDisable(query)
    },
    resetPassword(id) {
      const query = {
        id: id,
        password:'{noop}123456'
      }
      changeDisable(query)
    },
    listUsers() {
      const params = {
        current: this.current,
        size: this.size,
        keywords: this.keywords,
      }
      listUsers(params).then(res => {
        this.userList = res.data.recordList;
        this.count = res.data.count;
        this.loading = false;
      })
    },
    listRoles() {
      listRoles().then(res => {
        this.userRoleList = res.data.recordList;
      })
    }
  },
  watch: {
    loginType() {
      this.current = 1;
      this.listUsers();
    }
  }
};
</script>
