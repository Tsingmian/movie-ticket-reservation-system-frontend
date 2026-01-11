<template>
  <div v-if="movie" class="movie-detail">
    <!-- 电影信息 -->
    <h1>{{ movie.title }}</h1>
    <p>{{ movie.duration }} 分钟 | 导演：{{ movie.director }}</p>
    <p>主演：{{ movie.actors }}</p>
    <p>{{ movie.description }}</p>
    <p>
      上映日期：
      {{ movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : '' }}
    </p>

    <!-- 场次选择 -->
    <h2 style="margin-top: 30px;">选择场次</h2>

    <el-table
      v-if="screenings.length"
      :data="screenings"
      style="width: 100%; margin-top: 10px;"
      border
    >
      <el-table-column prop="hallName" label="影厅" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="price" label="票价（元）" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" @click="goSelect(row.id)">
            选座
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-else style="margin-top: 10px;">
      暂无场次
    </div>
  </div>

  <div v-else>
    加载中...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const movie = ref(null)
const screenings = ref([])

const movieId = route.params.id

// 获取电影详情
const fetchMovie = async () => {
  const res = await axios.get(`http://localhost:8080/movies/${movieId}`)
  if (res.data.status === 1) {
    movie.value = res.data.data
  }
}

// 获取该电影的场次
const fetchScreenings = async () => {
  const res = await axios.get('http://localhost:8080/screenings', {
    params: { movieId }
  })
  screenings.value = res.data
}

// 跳转选座
const goSelect = (screeningId) => {
  router.push(`/select/${screeningId}`)
}

onMounted(() => {
  fetchMovie()
  fetchScreenings()
})
</script>

<style scoped>
.movie-detail {
  padding: 20px;
}
</style>
