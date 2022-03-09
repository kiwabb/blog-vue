<template>
  <div id="app">
<!--    <index/>-->
  <router-view/>
  </div>
</template>

<script>
  import index from "@/components/index"
  export default {
    created() {
    },
    components: {
      index
    }
  }
</script>

