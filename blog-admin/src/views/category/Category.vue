<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openModel(null)"
      >
        新增
      </el-button>
      <el-button
          type="danger"
          size="small"
          icon="el-icon-deleteItem"
          :disabled="this.categoryIdList.length === 0"
          @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left:auto">
        <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入分类名"
            style="width:200px"
            @input="listCategories"
        />
        <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left:1rem"
            @click="listCategories"
        >
          搜索
        </el-button>
      </div>

    </div>
    <!-- 表格展示 -->
    <el-table
        border
        :data="categoryList"
        @selection-change="selectionChange"
        v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55"/>
      <!-- 分类名 -->
      <el-table-column prop="categoryName" label="分类名" align="center"/>
      <!--排序-->
      <el-table-column prop="sort" label="排序" sortable align="center"/>
      <!-- 分类创建时间 -->
      <el-table-column prop="createTime" label="创建时间" sortable align="center">
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px"/>
          {{
            this.$filters.dateFormat(scope.row.createTime)
          }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button
              type="primary"
              size="mini"
              @click="openModel(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗?"
              style="margin-left:1rem"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteCategory(scope.row.id)"
          >
            <template #reference>
              <el-button size="mini" type="danger" slot="reference">
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
        :current-page="page"
        :page-size="size"
        :total="count"
        :page-sizes="[10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 批量删除对话框 -->
    <el-dialog v-model="isDelete" width="30%">
      <template #title>
        <div class="dialog-title-container" slot="title">
          <i class="el-icon-warning" style="color:#ff9900"/>提示
        </div>
      </template>
      <div style="font-size:1rem">是否删除选中项？</div>
      <template #footer>
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategory(null)">
          确 定
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addOrEdit" width="30%">
      <template #title>
        <div class="dialog-title-container" slot="title">{{ categoryTitle }}</div>
      </template>
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.categoryName" style="width:220px"/>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="categoryForm.sort" style="width:220px"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>

import message from "@/assets/js/message";
import {addOrEditCategory, deleteCategory, listCategories} from "@/api/category";


export default {
  name: "Category",
  data: function () {
    return {
      isDelete: false,
      loading: true,
      addOrEdit: false,
      keywords: '',
      categoryIdList: [],
      categoryList: [],
      categoryForm: {
        id: null,
        categoryName: "",
        sort: null
      },
      page: 1,
      size: 10,
      count: 0,
      categoryTitle: null
    };
  },
  created() {
    this.listCategories();
  },
  methods: {
    selectionChange(categoryList) {
      this.categoryIdList = [];
      categoryList.forEach(item => {
        this.categoryIdList.push(item.id);
      });
    },
    openModel(category) {
      if (category != null) {
        this.categoryForm = JSON.parse(JSON.stringify(category));
        this.categoryTitle = "修改分类";
      } else {
        this.categoryForm.id = null;
        this.categoryForm.categoryName = null;
        this.categoryForm.sort = null;
        this.categoryTitle = "添加分类";

      }
      this.addOrEdit = true;
    },
    addOrEditCategory() {
      console.log(this.categoryForm.categoryName)
      if (this.categoryForm.categoryName === null || this.categoryForm.categoryName.trim() === "") {
        message.error('分类名不能为空');
        return false;
      }
      addOrEditCategory(this.categoryForm)
        .then((data) => {
          if (!data.code) {
            message.success(data.msg);
            this.listCategories();
          } else {
            message.error(data.msg);
          }
          this.addOrEdit = false;
        });
    },
    listCategories() {
      let query = {
        page: this.page,
        size: this.size,
        keywords: this.keywords
      }
      listCategories(query)
        .then((data) => {
          console.log(data.data.recordList);
          this.categoryList = data.data.recordList;
          this.count = data.data.count;
          this.loading = false;
        });
    },
    deleteCategory(id) {
      let param = {};
      if (id == null) {
        param = this.categoryIdList;
      } else {
        param = [id];
      }
      deleteCategory(param).then(( data ) => {
        if (!data.code) {
          message.success(data.msg);
          this.listCategories();
        } else {
          message.error(data.msg);
        }
        this.isDelete = false;
      });
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    sizeChange(size) {
      this.size = size;
      this.listTags();
    },
    currentChange(current) {
      this.current = current;
      this.listTags();
    },
  }
}
</script>

<style scoped>

</style>
