<template>
  <div class="order-detail">
    <h2>订单详情 - ID: {{ orderId }}</h2>

    <div v-if="order && order.id">
      <p>用户ID：{{ order.userId }}</p>
      <p>场次ID：{{ order.screeningId }}</p>
      <p>座位：{{ seatText }}</p>
      <p>总价：¥{{ parseFloat(order.price).toFixed(2) }}</p>
      <p>下单时间：{{ formatDate(order.createTime) }}</p>
      <p>状态：
        <span v-if="order.status === 0">未支付</span>
        <span v-else-if="order.status === 1">已支付</span>
        <span v-else>已取消</span>
      </p>
      <p v-if="order.status === 1">支付时间：{{ formatDate(order.payTime) }}</p>
    </div>

    <div v-else-if="loading">
      <p>正在加载订单详情...</p>
    </div>

    <div v-else>
      <p>订单不存在或加载失败。</p>
      <el-button @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const order = ref(null)
const seats = ref([])
const loading = ref(true)

const orderId = computed(() => route.params.orderId)

const seatText = computed(() =>
  seats.value.length
    ? seats.value.map(s => s.rowNum && s.colNum ? `${s.rowNum}-${s.colNum}` : s.seatId).join(', ')
    : '无座位'
)

function formatDate(datetime) {
  if (!datetime) return '-'
  const d = new Date(datetime)
  return d.toLocaleString('zh-CN', { hour12: false })
}

async function fetchOrderDetail(id) {
  if (!id) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const [orderRes, seatRes] = await Promise.all([
      axios.get(`http://localhost:8080/orders/${id}`),
      axios.get(`http://localhost:8080/orders/${id}/seats`)
    ])
    order.value = orderRes.data || null
    seats.value = seatRes.data || []
  } catch (err) {
    console.error('获取订单详情失败:', err)
    order.value = null
    seats.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetail(orderId.value)
})

watch(orderId, (newId) => {
  if (newId) fetchOrderDetail(newId)
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.order-detail h2 {
  margin-bottom: 15px;
}

.order-detail p {
  margin: 5px 0;
  font-size: 14px;
}

.order-detail p span {
  font-weight: bold;
}
</style>