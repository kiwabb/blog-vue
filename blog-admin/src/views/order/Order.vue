<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->

    <!-- 表格展示 -->
    <el-table border :data="userList" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column
          prop="id"
          label="订单号"
          align="center"
          width="140"
      />
      <el-table-column
          prop="nickname"
          label="下单用户"
          align="center"
          width="140"
      />
      <el-table-column
          prop="name"
          label="商品名"
          align="center"
          width="140"
      />
      <el-table-column
          prop="user_address"
          label="收货地址"
          align="center"
          width="300"
      />
      <el-table-column
          prop="state"
          label="订单状态"
          align="center"
          width="80"
      />
      <el-table-column
          prop="createTime"
          label="下单时间"
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
      <el-table-column label="操作" align="center" >
        <template #default="scope">
          <el-button
              type="primary"
              size="mini"
              @click="openEditModel(scope.row)"
          >
            发货
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
          填写快递单号
        </div>
      </template>
      <el-form label-width="60px" size="medium" :model="userForm">
        <el-form-item label="快递单号">
          <el-input v-model="userForm.mailNum" style="width:220px" />
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
import {changeDisable, editUserRole, listUsers} from "@/api/adminUser";
import {listRoles} from "@/api/role";
import {listOrders} from "@/api/order";

export default {
  created() {
    this.listUsers();
  },
  data: function() {
    return {
      loading: true,
      isEdit: false,
      userForm: {
        id: null,
        mailNum: ""
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
      this.userForm = JSON.parse(JSON.stringify(user));
      this.userForm.roleList.forEach(item => {
        this.roleIdList.push(item.id);
      });
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
      }
      listOrders(params).then(res => {
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
