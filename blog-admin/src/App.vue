<template>
  <el-container>
    <el-aside width="auto">
      <SideBar />
    </el-aside>
    <el-container>
      <!-- 导航栏 -->
      <el-header height="84px" style="padding:0" >
        <NavBar :key="$route.fullPath" />
      </el-header>
      <!-- 内容 -->
      <el-main style="background:#F7F9FB">
        <div class="fade-transform-box">
          <router-view v-slot="{ Component }">
            <transition>
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import NavBar from "@/layout/components/NavBar";
  import SideBar from "@/layout/components/SideBar";
  export default {
    components: {
      NavBar,
      SideBar
    },
    created() {
    },
  }
</script>

<style>
.fade-transform-box {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}
.main-container {
  transition: margin-left 0.45s;
  margin-left: 210px;
  min-height: 100vh;
}
.hideSideBar {
  margin-left: 64px;
}
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s ease 0s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.fade-transform-box {
  position: relative;
  top: 0px;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
}
</style>

