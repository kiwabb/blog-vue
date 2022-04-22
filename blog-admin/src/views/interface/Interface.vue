<template>
  <el-card class="main-card">
    <!-- 标题 -->
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openModel(null)"
      >
        新增模块
      </el-button>
      <!-- 数据筛选 -->
      <div style="margin-left:auto">
        <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入资源名"
            style="width:200px"
            @keyup.enter.native="listResources"
        />
        <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left:1rem"
            @click="listResources"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 权限列表 -->
    <el-table
        v-loading="loading"
        :data="resourceList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="interfaceName" label="资源名" width="220" />
      <el-table-column prop="url" label="资源路径" width="300" />
      <el-table-column prop="requetMethod" label="请求方式">
        <template #default="scope">
          <el-tag :type="tagType(scope.row.requestMethod)" v-if="scope.row.requestMethod">
            {{ scope.row.requestMethod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAnonymous" label="匿名访问" align="center">
        <template #default="scope">
          <el-switch
              v-if="scope.row.url"
              v-model="scope.row.isAnonymous"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
              @change="changeResource(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template #default="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{
            this.$filters.dateFormat(scope.row.createTime)
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
              type="text"
              size="mini"
              @click="openAddResourceModel(scope.row)"
              v-if="scope.row.children"
          >
            <i class="el-icon-plus" /> 新增
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="openEditResourceModel(scope.row)"
          >
            <i class="el-icon-edit" /> 修改
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:10px"
              @confirm="deleteResource(scope.row.id)"
          >
            <template #reference>
              <el-button size="mini" type="text">
                <i class="el-icon-delete" /> 删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增模态框 -->
    <el-dialog v-model="addModule" width="30%">
      <template #title >
        <div class="dialog-title-container" slot="title"> {{moduleTitle}} </div>
      </template>
      <el-form label-width="80px" size="medium" :model="resourceForm">
        <el-form-item label="模块名">
          <el-input v-model="resourceForm.interfaceName" style="width:220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addModule = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditResource">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增模态框 -->
    <el-dialog v-model="addResource" width="30%">
      <template #title>
        <div class="dialog-title-container" > {{ resourceTitle }} </div>
      </template>
      <el-form label-width="80px" size="medium" :model="resourceForm">
        <el-form-item label="接口名">
          <el-input v-model="resourceForm.interfaceName" style="width:220px" />
        </el-form-item>
        <el-form-item label="接口路径">
          <el-input v-model="resourceForm.url" style="width:220px" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-radio-group v-model="resourceForm.requestMethod">
            <el-radio :label="'GET'">GET</el-radio>
            <el-radio :label="'POST'">POST</el-radio>
            <el-radio :label="'PUT'">PUT</el-radio>
            <el-radio :label="'DELETE'">DELETE</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addResource = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditResource">
            确 定
          </el-button>
        </span>
      </template>

    </el-dialog>
  </el-card>
</template>

<script>
import {ElMessage} from "element-plus";
import {addOrEditResource, changeResource, deleteResource, listResources} from "@/api/interface";

export default {
  created() {
    this.listResources();
  },
  data() {
    return {
      moduleTitle: "",
      resourceTitle: "",
      loading: false,
      keywords: "",
      resourceList: [],
      addModule: false,
      addResource: false,
      resourceForm: {
        parentId: "0",
        isAnonymous: 0
      }
    };
  },
  methods: {
    listResources() {
      const params = {
        keywords: this.keywords
      }
      listResources(params).then(res => {
        this.resourceList = res.data;
        this.loading = false;
      })
    },
    openModel(resource) {
      this.resourceForm.parentId = "0";
      if (resource != null) {
        this.resourceForm = JSON.parse(JSON.stringify(resource));
        this.moduleTitle = "修改模块"
      } else {
        this.resourceForm = {};
        this.moduleTitle = "添加模块";
      }
      this.addModule = true;
    },
    openEditResourceModel(resource) {
      if (resource.url == null) {
        this.openModel(resource);
        return false;
      }
      this.resourceForm = JSON.parse(JSON.stringify(resource));
      this.resourceTitle = "修改资源";
      this.addResource = true;
    },
    openAddResourceModel(resource) {
      this.resourceForm = {};
      this.resourceForm.parentId = resource.id;
      this.resourceTitle = "添加资源";
      this.addResource = true;
    },
    deleteResource(id) {
      deleteResource(id).then(() => {
        this.listResources();
      })
    },
    addOrEditResource() {
      if (this.resourceForm.resourceName === "") {
        ElMessage.error("资源名不能为空");
        return false;
      }
      if (this.resourceForm.parentId === null || this.resourceForm.parentId === undefined) {
        this.resourceForm.parentId = 0;
      }
      this.resourceForm.isAnonymous = 0
      addOrEditResource(this.resourceForm).then(() => {
        this.listResources();
        this.addModule = false;
        this.addResource = false;
      })
    }
  },
  computed: {
    tagType() {
      return function(type) {
        switch (type) {
          case "GET":
            return "";
          case "POST":
            return "success";
          case "PUT":
            return "warning";
          case "DELETE":
            return "danger";
        }
      };
    }
  }
};
</script>
