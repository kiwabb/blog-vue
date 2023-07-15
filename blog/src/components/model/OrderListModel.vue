<template>
  <!-- 搜索框 -->
  <v-dialog v-model="orderFlag" max-width="1000" :fullscreen="isMobile">
    <v-card class="search-wrapper" style="border-radius:4px">
      <div class="mb-3">
        <span class="search-title">订单列表</span>
        <!-- 关闭按钮 -->
        <v-icon class="float-right" @click="orderFlag = false">
          mdi-close
        </v-icon>
      </div>
      <v-data-table
          :headers="headers"
          :items="orderList"
          :items-per-page="5"
          class="elevation-1"
      >
        <template v-slot:item.state="{ item }">
          {{ showState(item) }}
        </template>
        <template v-slot:item.option="{ item }">
          <v-icon small @click="editOrder(item.id)" large>编辑</v-icon>
        </template>
      </v-data-table>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  created() {
    this.getOrderList();
  },
  data () {
    return {
      headers: [
        {
          text: '订单号',
          value: 'id',
        },
        { text: '商品名', value: 'shopName' },
        { text: '订单价格', value: 'price' },
        { text: '快递单号', value: 'mailNum' },
        { text: '订单状态', value: 'state' },
        { text: "操作", value: "option", sortable: false }
      ],
      orderList: [
      ],
    }
  },
  methods: {
    getOrderList() {
      this.axios.get("/shop/order/orderList").then(res => {
        this.orderList = res.data.data;
      })
    },
    editOrder(id) {
      this.orderFlag = false;
      this.$router.push("/order/" + id);
    }
  },
  computed: {
    showState(){
      return function(item){
        switch (item.state){
          case 0:
            return '未付款';
          case 1:
            return '待发货';
          case 2:
            return '已发货';
          case 3:
            return '已收货';
          case 4:
            return '已完成';
          case 5:
            return '已取消'
        }
      }},
    orderFlag: {
      set(value) {
        this.$store.state.orderFlag = value;
      },
      get() {
        return this.$store.state.orderFlag;
      }
    },
    isMobile() {
      const clientWidth = document.documentElement.clientWidth;
      if (clientWidth > 960) {
        return false;
      }
      return true;
    }
  },
  watch: {
    keywords(value) {
      this.flag = value.trim() != "" ? true : false;
      this.axios
          .get("/api/articles/search", {
            params: { current: 1, keywords: value }
          })
          .then(({ data }) => {
            this.articleList = data.data;
          });
    }
  }
};
</script>

<style scoped>
.search-wrapper {
  padding: 1.25rem;
  height: 100%;
  background: #fff !important;
}
.search-title {
  color: #49b1f5;
  font-size: 1.25rem;
  line-height: 1;
}
.search-input-wrapper {
  display: flex;
  padding: 5px;
  height: 35px;
  width: 100%;
  border: 2px solid #8e8cd8;
  border-radius: 2rem;
}
.search-input-wrapper input {
  width: 100%;
  margin-left: 5px;
  outline: none;
}
@media (min-width: 960px) {
  .search-result-wrapper {
    padding-right: 5px;
    height: 450px;
    overflow: auto;
  }
}
@media (max-width: 959px) {
  .search-result-wrapper {
    height: calc(100vh - 110px);
    overflow: auto;
  }
}
.search-reslut a {
  color: #555;
  font-weight: bold;
  border-bottom: 1px solid #999;
  text-decoration: none;
}
.search-reslut-content {
  color: #555;
  cursor: pointer;
  border-bottom: 1px dashed #ccc;
  padding: 5px 0;
  line-height: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.divider {
  margin: 20px 0;
  border: 2px dashed #d2ebfd;
}
</style>
