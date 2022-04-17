<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">管理员登录</div>
      <!-- 登录表单 -->
      <el-form
          status-icon
          :model="loginForm"
          :rules="rules"
          ref="loginRef"
          class="login-form"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user-solid"
              placeholder="用户名"
          />
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              prefix-icon="iconfont icon-mima"
              show-password
              placeholder="密码"
              @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-form>
      <!-- 登录按钮 -->
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </div>
  </div>
</template>

<script setup>

import {getCurrentInstance, ref} from "vue";
import Cookies from "js-cookie";
import store from "@/store";
import router from "@/router";
const { proxy } = getCurrentInstance();
const redirect = ref(undefined);

const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
}

const loading = ref(false);

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 调用action的登录方法
      store.dispatch("Login", loginForm.value).then(() => {
        router.push({ path: redirect.value || "/" });
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}

</script>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url(../../assets/img/login.png) center center /
    cover no-repeat;
}
.login-card {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  padding: 170px 60px 180px;
  width: 350px;
}
.login-title {
  color: #303133;
  font-weight: bold;
  font-size: 1rem;
}
.login-form {
  margin-top: 1.2rem;
}
.login-card button {
  margin-top: 1rem;
  width: 100%;
}
</style>