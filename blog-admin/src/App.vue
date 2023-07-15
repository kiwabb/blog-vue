<template>
  <index/>
</template>

<script>
  import Index from "@/layout";
  export default {
    components: {
      Index,
    },
    created() {
    },
    computed: {
      isHide() {
        return this.$store.state.collapse ? "hideSideBar" : "";
      }
    }
  }
</script>

<style>
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

