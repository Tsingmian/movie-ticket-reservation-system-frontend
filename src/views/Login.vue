<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">用户登录</h2>

      <el-form :model="form" ref="loginForm" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="login" :loading="loading" style="display: block; margin: 0 auto;">
            登录
          </el-button>
        </el-form-item>

        <el-alert
          v-if="error"
          title="登录失败"
          type="error"
          :closable="false"
          class="login-error"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import 'element-plus/dist/index.css'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: ''
})

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    })

    if (!res.ok) throw new Error()

    const user = await res.json()
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/movies')
  } catch (e) {
    error.value = '用户名或密码错误'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

html,body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
  overflow-y: hidden;
}

/* 会有8px的白边，浏览器加载的，可以改动，比较麻烦，弃之     why:   body样式没有真正覆盖（为什么没覆盖暂时还不知道） */

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100%;
  /* background: #f5f7fa; */
  background-image: url('../assets/背景.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* 滚动不动  没起作用，不知道为什么*/
}

.login-card {
  width: 360px;
  padding: 30px;
  border-radius: 12px;
  border: none;
  background-color: rgba(175, 151, 246, 0.6);
   /* 浅色半透明   rgba(189, 173, 239, 0.6) */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}

.login-error {
  margin-top: 10px;
}
</style>
