<template>
  <div>
    <!-- 标签或分类名 -->
    <div class="banner" :style="cover">
      <h1 class="banner-title animated fadeInDown">积分商城</h1>
    </div>
    <div class="article-list-wrapper">
      <v-row>
        <v-col md="4" cols="12" v-for="item of articleList" :key="item.id">
          <!-- 文章 -->
          <v-card class="animated zoomIn article-item-card">
            <div class="article-item-cover">
              <v-img
                class="on-hover"
                width="100%"
                height="100%"
                :src="item.pictrue"
              />
            </div>
            <div class="article-item-info">
              <!-- 文章标题 -->
              <div>
                {{ item.name }}
              </div>
              <div style="margin-top:0.375rem">
                <!-- 发表时间 -->
                结束时间：
                {{ item.endDate | time }}
                <!-- 文章分类 -->
                <div class="float-right">
                  {{ item.price }}积分
                </div>
              </div>
            </div>
            <!-- 分割线 -->
            <!-- 文章标签 -->
            <v-btn block
                   class="tag-wrapper"
                   outlined
                   color="blue"
                   @click="secKill(item)"
            >
              兑换
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
      <!-- 无限加载 -->
      <infinite-loading @infinite="listShop">
        <div slot="no-results" />
        <div slot="no-more" />
      </infinite-loading>
    </div>
  </div>
</template>

<script>
export default {

  data: function() {
    return {
      current: 1,
      size: 10,
      articleList: [],
      name: "",
      title: ""
    };
  },
  created() {
    this.listShop()
  },
  methods: {
    listShop($state) {
      this.axios.get("/shop/shop/client").then(({ data }) => {
        this.articleList = data.data;
        $state.complete()
      });

    },
    secKill(shop) {
     console.log(shop.id)
      this.axios.post("/shop/order/" + shop.id).then(res => {
        this.$router.push("/order/" + res.data.data)
      })
    }
  },
  computed: {
    cover() {
      var cover = "";
      this.$store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel === "articleList") {
          cover = item.pageCover;
        }
      });
      console.log(cover)
      return "background: url(" + "https://static.talkxj.com/config/924d65cc8312e6cdad2160eb8fce6831.jpg" + ") center center / cover no-repeat";
    }
  }
};
</script>

<style scoped>
@media (min-width: 760px) {
  .article-list-wrapper {
    max-width: 1106px;
    margin: 370px auto 1rem auto;
  }
  .article-item-card:hover {
    transition: all 0.3s;
    box-shadow: 0 4px 12px 12px rgba(7, 17, 27, 0.15);
  }
  .article-item-card:not(:hover) {
    transition: all 0.3s;
  }
  .article-item-card:hover .on-hover {
    transition: all 0.6s;
    transform: scale(1.1);
  }
  .article-item-card:not(:hover) .on-hover {
    transition: all 0.6s;
  }
  .article-item-info {
    line-height: 1.7;
    padding: 15px 15px 12px 18px;
    font-size: 15px;
  }
}
@media (max-width: 759px) {
  .article-list-wrapper {
    margin-top: 230px;
    padding: 0 12px;
  }
  .article-item-info {
    line-height: 1.7;
    padding: 15px 15px 12px 18px;
  }
}
.article-item-card {
  border-radius: 8px !important;
  box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.06);
}
.article-item-card a {
  transition: all 0.3s;
}
.article-item-cover {
  height: 220px;
  overflow: hidden;
}
.article-item-card a:hover {
  color: #8e8cd8;
}
.tag-wrapper {
  padding: 10px 15px 10px 18px;
}
.tag-wrapper a {
  color: #fff !important;
}
.tag-btn {
  display: inline-block;
  font-size: 0.725rem;
  line-height: 22px;
  height: 22px;
  border-radius: 10px;
  padding: 0 12px !important;
  background: linear-gradient(to right, #bf4643 0%, #6c9d8f 100%);
  opacity: 0.6;
  margin-right: 0.5rem;
}
</style>
