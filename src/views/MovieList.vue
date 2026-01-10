<!-- frontend/src/views/MovieList.vue -->

<template>
  <div>
    电影列表页面
 </div>
  <div>
    <input v-model="keyword" @keyup.enter="search" placeholder="搜索电影" />
    <div v-for="movie in movies" :key="movie.id" @click="goDetail(movie.id)">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.duration }}分钟 | {{ movie.director }}</p>
      <p>{{ movie.actors }}</p>
      <p>{{ movie.releaseDate }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const movies = ref([])
const keyword = ref('')
const router = useRouter()

const fetchMovies = async () => {
  const res = await axios.get('http://localhost:8080/movies', { params: { keyword: keyword.value } })
  if (res.data.status === 1) movies.value = res.data.data
}

const search = () => fetchMovies()
const goDetail = (id) => router.push(`/movies/${id}`)

onMounted(() => fetchMovies())
</script>
