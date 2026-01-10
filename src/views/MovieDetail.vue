<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <p>{{ movie.duration }}分钟 | {{ movie.director }}</p>
    <p>{{ movie.actors }}</p>
    <p>{{ movie.description }}</p>
    <p>{{ movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : '' }}</p>
  </div>
  <div v-else>
    加载中...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const movie = ref(null)

const fetchMovie = async (id) => {
  const res = await axios.get(`http://localhost:8080/movies/${id}`)
  if (res.data.status === 1) movie.value = res.data.data
}

onMounted(() => fetchMovie(route.params.id))
</script>
