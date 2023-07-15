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
            placeholder="请输入商品名"
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
    <el-table border :data="shopList" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column
          prop="linkAvatar"
          label="图片"
          align="center"
          width="150"
      >
        <template #default="scope">
          <img :src="scope.row.pictrue" width="100" height="100" />
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="商品名"
          align="center"
          width="240"
      />
      <el-table-column
          prop="price"
          label="价格"
          align="center"
          width="80"
      />
      <el-table-column
          prop="num"
          label="数量"
          align="center"
          width="80"
      />

      <el-table-column
          prop="beginDate"
          label="开始兑换时间"
          width="200"
          align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{
            this.$filters.timeDateFormat(scope.row.beginDate)
          }}
        </template>
      </el-table-column>

      <el-table-column
          prop="endDate"
          label="结束兑换时间"
          width="200"
          align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{
            this.$filters.timeDateFormat(scope.row.endDate)
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
              title="确定删除吗?"
              style="margin-left:1rem"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteShop(scope.row.id)"
          >
            <template #reference>
              <el-button size="mini" type="text" slot="reference">
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
    <!-- 修改对话框 -->
    <el-dialog v-model="isEdit" width="30%">
      <template #title>
        <div class="dialog-title-container">
          修改用户
        </div>
      </template>
      <el-form label-width="60px" size="medium" :model="shopForm">
        <el-form-item label="上传商品图片">
          <el-upload
              :limit="1"
              class="upload-cover"
              drag
              action="/oss/blog/upload"
              multiple
              :on-success="uploadCover"
              :on-error="uploadError"
          >
            <i class="el-icon-upload" v-if="shopForm.pictrue === ''" />
            <div class="el-upload__text" v-if="shopForm.pictrue === ''">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
                v-else
                :src="shopForm.picture"
                width="360px"
                height="180px"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model="shopForm.name" style="width:220px" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number
              v-model="shopForm.price"
              :min="1"
              controls-position="right"
              size="large"
          />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number
              v-model="shopForm.num"
              :min="1"
              controls-position="right"
              size="large"
          />
        </el-form-item>
        <el-form-item label="开始兑换时间">
          <el-date-picker
              v-model="shopForm.beginDate"
              type="datetime"
              placeholder="请选择开始兑换时间"
          />
        </el-form-item>
        <el-form-item label="结束兑换时间">
          <el-date-picker
              v-model="shopForm.endDate"
              type="datetime"
              placeholder="请选择结束兑换时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="isEdit = false">取 消</el-button>
          <el-button type="primary" @click="createShop">
            确 定
          </el-button>
        </div>
      </template>

    </el-dialog>
  </el-card>
</template>

<script>
import {changeDisable, editUserRole} from "@/api/adminUser";
import {listRoles} from "@/api/role";
import {listShops, createShop, deleteShop} from "@/api/shop";
import message from "@/assets/js/message";

export default {
  created() {
    this.listShops();
  },
  data: function() {
    return {
      loading: true,
      isEdit: false,
      shopForm: {
        id:null,
        pictrue:"",
        name: "",
        price:0,
        num: 0,
        beginDate:null,
        endDate:null
      },
      loginType: null,
      userRoleList: [],
      roleIdList: [],
      shopList: [],
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
    deleteShop(id) {
      deleteShop(id);
      this.listShops();
    },
    changeDisable(user) {
      const query = {
        id: user.userInfoId,
        isDisable: user.isDisable
      }
      changeDisable(query)
    },
    openEditModel(shop) {
      this.roleIdList = [];
      if (shop) {
        this.shopForm = JSON.parse(JSON.stringify(shop));
        this.shopForm.beginDate = new Date(shop.beginDate)
        this.shopForm.endDate = new Date(shop.endDate)
      }
      this.isEdit = true;
    },
    createShop() {
      createShop(this.shopForm).then(res => {
        this.listShops();
        this.isEdit = false;
      })
    },
    listShops() {
      const params = {
        current: this.current,
        size: this.size,
        keywords: this.keywords,
      }
      listShops(params).then(res => {
        this.shopList = res.data.recordList;
        this.count = res.data.count;
        this.loading = false;
      })
    },
    listRoles() {
      listRoles().then(res => {
        this.userRoleList = res.data.recordList;
      })
    },
    uploadCover(response) {
      this.shopForm.pictrue = response.data;
    },
    uploadError() {
      message.error("文件上传错误！")
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
