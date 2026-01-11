<!-- frontend/src/views/MovieList.vue -->
<template>
  <div class="movie-list-container">
    <h2 class="page-title">电影榜单</h2>

    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      @keyup.enter="search"
      placeholder="请输入电影名称搜索..."
      clearable
      style="width: 320px; margin-bottom: 24px;"
    >
      <template #suffix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <!-- 电影列表 -->
    <div class="movies-grid" v-if="movies.length > 0">
      <el-card
        v-for="movie in movies"
        :key="movie.id"
        shadow="hover"
        class="movie-card"
        @click="goDetail(movie.id)"
      >
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <p class="movie-meta">
            <span>时长：{{ movie.duration }} 分钟</span>
            <span>导演：{{ movie.director || '未知' }}</span>
          </p>
          <p class="movie-actors">主演：{{ movie.actors || '暂无' }}</p>
          <p class="movie-date">上映日期：{{ formatDate(movie.releaseDate) }}</p>
        </div>
      </el-card>
    </div>

    <!-- 无数据提示 -->
    <el-empty
      v-else
      description="暂无电影信息"
      style="margin-top: 60px;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Search } from '@element-plus/icons-vue'

const movies = ref([])
const keyword = ref('')
const router = useRouter()

// 格式化日期：2026-01-01 → 2026年1月1日
const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

const fetchMovies = async () => {
  try {
    const res = await axios.get('http://localhost:8080/movies', {
      params: { keyword: keyword.value }
    })
    // 假设后端返回结构为 { data: [...], status: 1 }
    if (res.data?.status === 1) {
      movies.value = res.data.data || []
    } else {
      movies.value = []
    }
  } catch (err) {
    console.error('获取电影列表失败:', err)
    movies.value = []
  }
}

const search = () => fetchMovies()
const goDetail = (id) => router.push(`/movies/${id}`)

onMounted(() => fetchMovies())
</script>

<style scoped>
.movie-list-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  color: #1f2d3d;
  font-size: 24px;
  font-weight: 600;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.movie-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-info {
  padding: 12px 0;
}

.movie-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-meta {
  font-size: 13px;
  color: #606266;
  margin: 0 0 8px 0;
}
.movie-meta span {
  margin-right: 12px;
}

.movie-actors,
.movie-date {
  font-size: 13px;
  color: #909399;
  margin: 4px 0;
  line-height: 1.5;
}

/* 响应式：小屏一列 */
@media (max-width: 600px) {
  .movies-grid {
    grid-template-columns: 1fr;
  }
}
</style>