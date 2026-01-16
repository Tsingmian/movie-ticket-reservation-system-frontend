<template>
  <div class="layout">
    <!-- 顶部栏 -->
    <header class="header">
      <el-button type="primary" @click="goProfile">
        个人中心
      </el-button>
    </header>

    <div class="body">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <el-menu router>
          <el-menu-item index="/movies">电影榜单</el-menu-item>
          <!-- <el-menu-item index="/select">场次座位选择</el-menu-item> -->
          <el-menu-item index="/orders">个人订单</el-menu-item>
          <el-menu-item index="/reviews">观影评价</el-menu-item>
          <el-menu-item v-if="user.role === 'admin' "index="/admin">管理系统</el-menu-item>
        </el-menu>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import { useRouter } from "vue-router";

import { getUser } from "../utils/auth";


const router = useRouter();

// 点击时再读取
// const goProfile = () => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}"); 
//   if (user.role === "admin") {
//     router.push("/admin");
//   } else {
//     router.push("/orders");
//   }
// };

// 响应式获取 user
// const user = computed(() => {
//   return JSON.parse(localStorage.getItem("user") || "{}");
// });
    const user = computed(() => getUser());

const goProfile = () => {
  const u = user.value; // 注意要用 .value
  if (u.role === "admin") {
    router.push("/admin");
  } else {
    router.push("/orders");
  }
};

</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
}

.body {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 220px;
  border-right: 1px solid #e4e7ed;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
