<template>
  <div>
    <div class="banner" :style="cover">
      <h1 class="banner-title">创作中心</h1>
    </div>
    <v-card class="blog-containers">
      <div>
        <v-text-field
            v-model="articleInfo.articleTitle"
            label="文章标题"
            placeholder="请输入您的文章标题"
            style="display: inline-block; width: 1000px; margin-right: 20px"

        />
        <v-btn
            outlined
            color="error"
            @click.stop="openDialog"
        >
          发布文章
        </v-btn>
        <!-- 文章内容 -->
        <mavon-editor
            @imgAdd="uploadImg"
            v-model="articleInfo.articleContent"
            ref="md"
            style="height:calc(100vh - 260px); z-index: 0"
        />

      </div>
    </v-card>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
        style="z-index: 999"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">发布文章</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select
                v-model="articleInfo.categoryId"
                :items=categoryList
                item-text="categoryName"
                item-value="id"
                label="分类"
                required
            ></v-select>
            <v-autocomplete
                v-model="articleInfo.tagIdList"
                :items=tagList
                item-text="tagName"
                item-value="id"
                label="标签"
                multiple
                required
            ></v-autocomplete>
            <v-file-input
                ref="md"
                v-model="file"
                accept="image/*"
                label="文章封面"
                @change="uploadFile"
            ></v-file-input>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="saveOrAddArticle"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      file: null,
      dialog: false,
      addOrEdit: false,
      category: {
        id:"1",
        categoryName:"null"
      },
      categoryList:[
        {id:2,
          categoryName:"null"}
      ],
      tagList:[],
      articleInfo: {
        id: null,
        articleTitle: "",
        articleContent: "",
        articleCover: "",
        categoryId: null,
        tagIdList: [],
        status: 0,
        isTop: 0,
        isDelete: 0
      },
      userInfo: {
        nickname: this.$store.state.nickname,
        intro: this.$store.state.intro,
        regin: this.$store.state.regin,
        loginType: this.$store.state.loginType
      }

    };
  },
  created() {
    if(this.$route.params.id) {
      this.getArticle();
    }
  },
  methods: {
    getArticle() {
      let articleId = this.$route.params.id
      this.axios.get('/app/article/admin/' + articleId).then(( data ) => {
        this.articleInfo = data.data.data;
        console.log(this.articleInfo)
        this.articleInfo.status = 0;
      });
    },
    uploadImg(pos, file) {
      var formdata = new FormData();
        formdata.append("file", file);
        this.axios
            .post("/oss/blog/upload", formdata)
            .then(({ data }) => {
              this.$refs.md.$img2Url(pos, data.data);
            });
    },
    uploadFile() {
      const formData = new FormData();
        formData.append("file", this.file);
        this.axios
            .post("/oss/blog/upload", formData)
            .then(( res ) => {
              this.$toast({
                type: "success",
                message: "上传图片成功"
              });
              this.articleInfo.articleCover = res.data.data;
            });
      },
    saveOrAddArticle() {
      if (this.articleInfo.articleTitle.trim() === "") {
        this.$toast({
          type: "error",
          message: "文章标题不能为空"
        });
        return false;
      }
      if (this.articleInfo.articleContent.trim() === "") {
        this.$toast({
          type: "error",
          message: "文章内容不能为空"
        });
        return false;
      }
      if (this.articleInfo.categoryId === null) {
        this.$toast({
          type: "error",
          message: "文章分类不能为空"
        });
        return false;
      }
      if (this.articleInfo.tagIdList.length === 0) {
        this.$toast({
          type: "error",
          message: "文章标签不能为空"
        });
        return false;
      }
      console.log(this.articleInfo)
      this.axios.post("/app/article/admin", this.articleInfo).then(( data ) => {
        console.log(data)
        if (!data.data.code) {
          this.$toast({
            type: "success",
            message: data.data.msg
          });
          this.$router.push({ path: "/"});
        } else {
          this.$toast({
            type: "success",
            message: data.data.msg
          });
        }
        this.addOrEdit = false;
      });
    },
    openDialog() {
      if (this.articleInfo.articleTitle.trim() === "") {
        this.$toast({
          type: "error",
          message: "文章标题不能为空"
        });
        return false;
      }
      if (this.articleInfo.articleContent.trim() === "") {
        this.$toast({
          type: "error",
          message: "文章类容不能为空"
        });
        return false;
      }
      this.dialog = true;
      this.initCategoryTagList();
    },
    updataUserInfo() {
      this.axios.put("/api/users/info", this.userInfo).then(( data ) => {
        if (data.flag) {
          this.$store.commit("updateUserInfo", this.userInfo);
          this.$toast({ type: "success", message: "修改成功" });
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      });
    },
    initCategoryTagList() {
      this.listCategoryList();
      this.listTagList();
    },
    listCategoryList() {
      this.axios.get("/app/article/admin/category/allCategory").then((res) => {
        this.categoryList = res.data.data
      })
    },
    listTagList() {
      this.axios.get("/app/article/tag/admin/allTag").then((res) => {
        this.tagList = res.data.data;
      })
    },
    uploadAvatar(data) {
      if (data.flag) {
        this.$store.commit("updateAvatar", data.data);
        this.$toast({ type: "success", message: "上传成功" });
      } else {
        this.$toast({ type: "error", message: data.message });
      }
    },
    openEmailModel() {
      this.$store.state.emailFlag = true;
    }
  },
  computed: {
    email() {
      return this.$store.state.email;
    },
    loginType() {
      return this.$store.state.loginType;
    },
    cover() {
      var cover = "https://picsum.photos/200/300";
      this.$store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel === "user") {
          cover = item.pageCover;
        }
      });
      console.log(cover)
      return "background: url(" + cover + ") center center / cover no-repeat";
    }
  }
};
</script>

<style scoped>
.banner {
  position: absolute;
  background-color: #49b1f5 !important;
  top: -60px;
  left: 0;
  right: 0;
  height: 200px;
  animation: header-effect 1s;
}
.banner-title {
  animation: title-scale 1s;
  position: absolute;
  top: 100px;
  padding: 0 0.5rem;
  width: 100%;
  font-size: 2.5rem;
  text-align: center;
  color: #eee;
}
.theme--light.v-card.blog-containers{
  background: #fff !important;
}
.blog-containers {
  animation: main 1s;
  max-width: 1200px;
  padding: 50px 40px;
  margin: 180px auto 40px auto;
}

.info-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.info-wrapper {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
#pick-avatar {
  outline: none;
}
.binding {
  display: flex;
  align-items: center;
}
</style>
