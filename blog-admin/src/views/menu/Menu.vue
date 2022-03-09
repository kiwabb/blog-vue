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
        新增菜单
      </el-button>
      <!-- 数据筛选 -->
      <div style="margin-left:auto">
        <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入菜单名"
            style="width:200px"
            @keyup.enter.native="listMenus"
        />
        <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left:1rem"
            @click="listMenus"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 权限列表 -->
    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- 菜单名称 -->
      <el-table-column prop="name" label="菜单名称" width="140" />
      <!-- 菜单icon -->
      <el-table-column prop="icon" align="center" label="图标" width="100">
        <template #default="scope">
          <i :class="'iconfont ' + scope.row.icon" />
        </template>
      </el-table-column>
      <!-- 菜单排序 -->
      <el-table-column
          prop="orderNum"
          align="center"
          label="排序"
          width="100"
      />
      <!-- 访问路径 -->
      <el-table-column prop="path" label="访问路径" />
      <!-- 组件路径 -->
      <el-table-column prop="component" label="组件路径" />
      <!-- 是否隐藏 -->
      <el-table-column prop="isHidden" label="隐藏" align="center" width="80">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isHidden"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
              @change="changeHidden(scope.row)"
          />
        </template>
      </el-table-column>
<!--      是否禁用-->
      <el-table-column prop="isDisable" label="禁用" align="center" width="80">
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
      <!-- 创建时间 -->
      <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="150"
      >
        <template #default="scope">
            <i class="el-icon-time" style="margin-right:5px"/>
            {{
              this.$filters.dateFormat(scope.row.createTime)
            }}
        </template>
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="修改时间"
          align="center"
          width="150"
      >
        <template #default="scope">
            <i class="el-icon-time" style="margin-right:5px"/>
            {{
              this.$filters.dateFormat(scope.row.updateTime)
            }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
              type="text"
              size="mini"
              @click="openModel(scope.row, 1)"
              v-if="scope.row.children"
          >
            <i class="el-icon-plus" /> 新增
          </el-button>
          <el-button type="text" size="mini" @click="openModel(scope.row, 2)">
            <i class="el-icon-edit" /> 修改
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:10px"
              @confirm="deleteMenu(scope.row.id)"
          >
            <el-button size="mini" type="text" slot="reference">
              <i class="el-icon-delete" /> 删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增模态框 -->
    <el-dialog v-model="addMenu" width="30%" top="12vh">
      <template class="dialog-title-container" #title>
        <div class="dialog-title-container" slot="title">
          {{ menuTitle }}
        </div>
      </template>
      <el-form label-width="80px" size="medium" :model="menuForm" ref="menuForm" :rules="rules">
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" v-if="show">
          <el-radio-group v-model="isCatalog">
            <el-radio :label="true">目录</el-radio>
            <el-radio :label="false">一级菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" style="width:220px" />
        </el-form-item>
        <!-- 菜单图标 -->
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-popover placement="bottom-start" width="300px" trigger="click">
            <el-row :gutter="20">
              <el-col
                  v-for="(item, index) of iconList"
                  :key="index"
                  :span="10"
              >
                <div class="icon-item" @click="checkIcon(item)">
                  <i :class="'iconfont ' + item" /> {{ item }}
                </div>
              </el-col>
            </el-row>
            <template #reference>
              <el-input
                  :prefix-icon="'iconfont ' + menuForm.menuIcon"
                  slot="reference"
                  v-model="menuForm.icon"
                  style="width:220px"
              />
            </template>
          </el-popover>
        </el-form-item>
        <!-- 组件路径 -->
        <el-form-item label="组件路径" v-show="!isCatalog" prop="menuComponent">
          <el-input v-model="menuForm.menuComponent" style="width:220px" />
        </el-form-item>
        <!-- 路由地址 -->
        <el-form-item label="访问路径" prop="menuPath">
          <el-input v-model="menuForm.menuPath" style="width:220px" />
        </el-form-item>
        <!-- 显示排序 -->
        <el-form-item label="显示排序">
          <el-input-number
              v-model="menuForm.orderNum"
              controls-position="right"
              :min="1"
              :max="10"
          />
        </el-form-item>
        <!-- 显示状态 -->
        <el-form-item label="显示状态">
          <el-radio-group v-model="menuForm.isHidden">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMenu = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateMenu('menuForm')">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "Menu",
  data() {
    return {
      menuTitle: "",
      keywords: "",
      loading: true,
      addMenu: false,
      isCatalog: true,
      show: true,
      menuList: [],
      menuForm: {
        id: null,
        menuName: "",
        menuIcon: "",
        menuComponent: "",
        menuPath: "",
        orderNum: 1,
        parentId: null,
        isHidden: 0
      },
      iconList: [
        "icon-shouye",
        "icon-fabiaowenzhang",
        "icon-yonghuliebiao",
        "icon-xiaoxitongzhi",
        "icon-liuyan",
        "icon-shouye",
        "icon-fabiaowenzhang",
        "icon-yonghuliebiao",
        "icon-xiaoxitongzhi",
        "icon-liuyan"
      ],
      rules : {
        menuName: [{ required: true, message: '菜单名不能为空！', trigger: blur }],
        menuComponent: [{ required: true, message: '菜单名不能为空！', trigger: blur }],
        menuIcon: [{ required: true, message: '菜单名不能为空！', trigger: blur }],
        menuPath: [{ required: true, message: '菜单名不能为空！', trigger: blur }],
      }
    };
  },
  methods: {
    openModel(menu, type) {
      if (menu) {
        this.show = false;
        this.isCatalog = false;
        switch (type) {
          case 1:
            this.menuForm = {
              id: null,
              name: "",
              icon: "",
              component: "",
              path: "",
              orderNum: 1,
              parentId: null,
              isHidden: 0
            };
            this.menuTitle = "新增菜单";
            this.menuForm.parentId = JSON.parse(JSON.stringify(menu.id));
            break;
          case 2:
            this.menuTitle = "修改菜单";
            this.menuForm = JSON.parse(JSON.stringify(menu));
            break;
        }
      } else {
        this.menuTitle = "新增菜单";
        this.show = true;
        this.menuForm = {
          id: null,
          name: "",
          icon: "",
          component: "Layout",
          path: "",
          orderNum: 1,
          parentId: null,
          isHidden: 0
        };
      }
      this.addMenu = true;
    },
    listMenus() {
      this.$axios
          .get("/api/auth/menu", {
            params: {
              keywords: this.keywords
            }
          })
          .then(({ data }) => {
            this.menuList = data.data;
            this.loading = false;
          });
    },
    checkIcon(icon) {
      this.menuForm.icon = icon;
    },
    changeHidden(row) {
      this.$axios.post("/api/auth/hidden", {
        params: {
          id: row.id,
          isHidden: row.isHidden
        }
      }).then( res => {
        if (res.data.code === 0) {
          ElMessage.success("修改成功！");
        } else {
          ElMessage.error(res.data.message)
        }
      })
    },
    changeDisable(row) {
      this.$axios.post("/api/auth/disable", {
        params: {
          id: row.id,
          isDisable: row.isDisable
        }
      }).then( res => {
        if (res.data.code === 0) {
          ElMessage.success("修改成功！");
        } else {
          ElMessage.error(res.data.message)
        }
      })
    },
    deleteMenu(id) {
      this.$axios.delete("/api/auth", {
        params: {
          id: id,
        }
      }).then( res => {
        if (res.data.code === 0) {
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error(res.data.message)
        }
      })
    },
    saveOrUpdateMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post("/api/auth/menu", this.menuForm).then(({ data }) => {
            if (data.flag) {
              ElMessage.success("操作成功！");
              this.listMenus();
            } else {
              ElMessage.error("操作失败!");
            }
            this.addMenu = false;
          });
        } else {
          return false;
        }
      })
    },
  }
}
</script>

<style scoped>
  .icon-item {
    cursor: pointer;
    padding: 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>