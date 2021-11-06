<template>
  <div id="app">
    <index/>

  </div>
</template>

<script>
  import index from "@/components/index"
  export default {
    created() {
      console.log(111111);
    },
    components: {
      index
    }
  }
</script>

