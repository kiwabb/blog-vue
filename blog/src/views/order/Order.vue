<template>
 <div>
   <v-card class="blog-container">
     <div>
       <span class="info-title">订单信息</span>
     </div>

       <v-divider/>

     <v-text-field
         style="margin-top: 10px"
         label="收货地址"
         placeholder="请输入您的收货地址"
         v-model="order.userAddress"
     />
     <div style="margin-top:1rem">
       <!-- 发表时间 -->
       订单号:
       {{ order.id }}
     </div>
     <v-divider/>
       <div style="margin-top:1rem">
         <!-- 发表时间 -->
         商品名：
         {{ order.shopName }}
         <!-- 文章分类 -->
         <div class="float-right">
           需要积分：{{ order.price }}积分
         </div>
       </div>
     <v-divider/>
     <div style="margin-top:1rem">
       <!-- 发表时间 -->
       快递单号:
       {{ order.mailNum }}
     </div>
     <v-divider/>
     <div style="margin-top:1rem">
       <!-- 发表时间 -->
       下单时间:
       {{ order.createDate | time }}
     </div>
     <v-divider/>
     <div style="margin-top:.5rem" v-if="order.state === 0">
       您拥有的积分：{{$store.state.points}}
     </div>
     <div class="float-right" style="margin-top: 10px">
       <v-btn v-if="order.state === 1 || order.state === 0"
           color="red"
           outlined
           style="margin-right: 5px"
          @click="cencelOrder"
       >
         取消订单
       </v-btn>
       <v-btn v-if="order.state === 0"
           color="blue"
           outlined
           style="margin-right: 5px"
           @click="paymentOrder"
       >
         确认兑换
       </v-btn>
     </div>

   </v-card>
 </div>
</template>

<script>
export default {
  name: "Order",
  data: function () {
    return {
      order: {
        shopName: ""
      }
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder() {
      this.axios.get("/shop/order/" + this.$route.params.id).then(res => {
        this.order = res.data.data;
        this.order.userAddress = this.$store.state.regin
      })
    },
    paymentOrder() {
      this.$store.commit("paymentOrder", this.order.price)
      this.order.state = 1;
      this.updateOrder()
    },
    cencelOrder() {
      this.order.state = 5;
      this.updateOrder()
    },
    updateOrder() {
      this.axios.post("/shop/order", this.order).then(res => {
        console.log(res)
        this.$router.push("/");
      })
    }

  }
}
</script>

<style scoped>
  .info-title {
    font-size: 1.25rem;
    font-weight: bold;
  }
  .blog-container {
    animation: main 1s;
    max-width: 970px;
    padding: 50px 40px;
    margin: 120px auto 40px auto;
  }
</style>