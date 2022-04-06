<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openEditModel(null)"
      >
        新增
      </el-button>
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
          prop="username"
          label="昵称"
          align="center"
          width="140"
      />
      <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="140"
      />
      <el-table-column prop="roleList" label="用户角色" align="center">
        <template #default="scope">
          <el-tag
              v-for="(item, index) of scope.row.roleList"
              :key="index"
              style="margin-right:4px;margin-top:4px"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="禁用" align="center" width="100">
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
      <el-table-column
          prop="createTime"
          label="创建时间"
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
      <el-table-column
          prop="updateTime"
          label="修改时间"
          width="130"
          align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{
            this.$filters.dateFormat(scope.row.updateTime)
          }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="100">
        <template #default="scope">
          <el-button
              type="primary"
              size="mini"
              @click="openEditModel(scope.row)"
          >
            编辑
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
    <!-- 修改对话框 -->
    <el-dialog v-model="isEdit" width="30%">
      <template #title>
        <div class="dialog-title-container">
          修改用户
        </div>
      </template>
      <el-form label-width="60px" size="medium" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.username" style="width:220px" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" style="width:220px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIdList">
            <el-checkbox
                v-for="item of userRoleList"
                :key="item.id"
                :label="item.id"
            >
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="isEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUserRole">
            确 定
          </el-button>
        </div>
      </template>

    </el-dialog>
  </el-card>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  created() {
    this.listUsers();
    //this.listRoles();
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
      this.axios.put("/api/user/users/disable", {
        id: user.userInfoId,
        isDisable: user.isDisable
      });
    },
    openEditModel(user) {
      this.roleIdList = [];
      this.userForm = JSON.parse(JSON.stringify(user));
      this.userForm.roleList.forEach(item => {
        this.roleIdList.push(item.id);
      });
      this.isEdit = true;
    },
    editUserRole() {
      this.userForm.roleIdList = this.roleIdList;
      this.$axios
          .put("/api/admin/users/role", this.userForm)
          .then(({ data }) => {
            if (data.code === 0) {
              ElMessage.success(data.msg);
              this.listUsers();
            } else {
              ElMessage.error(data.msg);
            }
            this.isEdit = false;
          });
    },
    listUsers() {
      this.$axios
          .get("/api/user/admin-user", {
            params: {
              current: this.current,
              size: this.size,
              keywords: this.keywords,
            }
          })
          .then(({ data }) => {
            this.userList = data.data.recordList;
            this.count = data.data.count;
            this.loading = false;
          });
    },
    listRoles() {
      this.$axios.get("/api/user/role").then(({ data }) => {
        this.userRoleList = data.data;
      });
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
