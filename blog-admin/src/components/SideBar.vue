<template>
  <el-scrollbar style="height:100%;overflow-x: hidden;">
    <el-menu
        router
        :default-active="this.$route.path"
        class="side-nav-bar"
        :collapse="this.$store.state.collapse"
        background-color="#304156"
        text-color="#BFCBD9"
        active-text-color="#409EFF"
    >
      <el-sub-menu index="1">
        <template #title>
          <i class="el-icon-location"></i>
          <span>文章管理</span>
        </template>
        <el-menu-item index="category">
          <i class="el-icon-location"></i>
          分类管理
        </el-menu-item>
        <el-menu-item index="article">
          <i class="el-icon-location"></i>
          发布文章
        </el-menu-item>
        <el-menu-item index="articleList">
          <i class="el-icon-location"></i>
          文章列表
        </el-menu-item>
        <el-menu-item index="tag">
          <i class="el-icon-location"></i>
          标签管理
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="menu">
          <i class="el-icon-location"></i>
          菜单管理
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>


<script>

</script>

<style scoped>
.side-nav-bar:not(.el-menu--collapse) {
  width: 210px;
}

.side-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.side-nav-bar i {
  margin-right: 1rem;
}
</style>
