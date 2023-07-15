<template>
  <el-container v-if="this.$route.name !== 'login'">
    <el-aside width="auto">
      <SideBar />
    </el-aside>
    <el-container :class="'main-container ' + isHide">
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
  <router-view v-else></router-view>
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
    console.log(this.$route.fullPath)
  },
  computed: {
    isHide() {
      return this.$store.state.collapse ? "hideSideBar" : "";
    }
  }
};
</script>

<style scoped>
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
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}
</style>
