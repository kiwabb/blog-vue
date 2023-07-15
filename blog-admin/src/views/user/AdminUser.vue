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
      <el-table-column prop="roleList" label="用户角色" align="center" width="200">
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
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
              type="text"
              size="mini"
              @click="openEditModel(scope.row)"
          >
            <i class="el-icon-edit" />编辑
          </el-button>
          <el-popconfirm
              title="确定重制吗？"
              style="margin-left:10px"
              @confirm="resetPassword(scope.row.id)"
          >
            <template #reference>
              <el-button
                  size="mini"
                  type="text"
              >
                <i class="el-icon-chicken"/>
                重制密码
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
        <el-form-item label="密码" v-if="userForm.id === null">
          <el-input v-model="userForm.password" show-password style="width:220px" />
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
import {changeDisable, editUserRole, listAdminUsers} from "@/api/adminUser";
import {listRoles} from "@/api/role";

export default {
  created() {
    this.listUsers();
    this.listRoles();
  },
  data: function() {
    return {
      loading: true,
      isEdit: false,
      userForm: {
        id:null,
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
        id: user.userInfoId,
        isDisable: user.isDisable
      }
      changeDisable(query)
    },
    openEditModel(user) {
      this.roleIdList = [];
      this.userForm.isDisable = 0;
      if (user) {
        this.userForm = JSON.parse(JSON.stringify(user));
        this.userForm.roleList.forEach(item => {
          this.roleIdList.push(item.id);
        });
        this.userForm.password = null;
      }
      this.isEdit = true;
    },
    editUserRole() {
      this.userForm.roleIdList = this.roleIdList;
      console.log(this.userForm)
      this.userForm.createTime = null
      editUserRole(this.userForm).then(res => {
        this.listUsers();
        this.isEdit = false;
      })
    },
    listUsers() {
      const params = {
        current: this.current,
        size: this.size,
        keywords: this.keywords,
      }
      listAdminUsers(params).then(res => {
        this.userList = res.data.recordList;
        this.count = res.data.count;
        this.loading = false;
      })
    },
    listRoles() {
      listRoles().then(res => {
        this.userRoleList = res.data.recordList;
      })
    },
    resetPassword(id) {
      let param = {
        id: id,
        password: "123456"
      }
      editUserRole(param)
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
