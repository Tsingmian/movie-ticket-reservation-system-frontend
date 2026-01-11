<template>
  <div class="seat-selection">
    <h2>选座系统 - {{ screeningName }}</h2>

    <!-- 座位表格 -->
    <el-table :data="seatGrid" border style="width: 100%">
      <el-table-column
        v-for="col in cols"
        :key="col"
        :label="'列 ' + col"
      >
        <template #default="{ row }">
          <el-button
            :type="getSeatType(row[col])"
            :disabled="row[col]?.status === 2"
            @click="toggleSeat(row[col])"
            size="small"
          >
            {{ row[col]?.rowNum }}-{{ row[col]?.colNum }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="actions" style="margin-top: 20px;">
      <p>已选座位：{{ selectedSeatsText }}</p>
      <p>总价：￥{{ totalPrice }}</p>
      <el-button
        type="primary"
        @click="placeOrder"
        :disabled="selectedSeats.length === 0"
      >
        下单支付
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 路由参数
const route = useRoute()
const screeningId = Number(route.params.screeningId)
if (!screeningId) {
  ElMessage.error('非法场次')
}

// 当前登录用户
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userId = user.id

// 场次信息
const screeningName = ref('')

// 座位数据
const seatList = ref([])
const selectedSeats = ref([])

// 表格布局
const rows = 5
const cols = [1, 2, 3, 4, 5]

const seatGrid = computed(() => {
  const grid = []
  for (let r = 1; r <= rows; r++) {
    const rowObj = {}
    cols.forEach(c => {
      rowObj[c] = seatList.value.find(s => s.rowNum === r && s.colNum === c)
    })
    grid.push(rowObj)
  }
  return grid
})

// 计算属性
const totalPrice = computed(() =>
  selectedSeats.value.reduce((sum, s) => sum + s.price, 0)
)

const selectedSeatsText = computed(() =>
  selectedSeats.value.map(s => `${s.rowNum}-${s.colNum}`).join(', ')
)

// 座位状态
function getSeatType(seat) {
  if (!seat) return 'info'
  if (seat.status === 0) return 'success'
  if (seat.status === 1) return 'warning'
  return 'danger'
}

// 点击座位
function toggleSeat(seat) {
  if (!seat || seat.status === 2) return
  const index = selectedSeats.value.findIndex(s => s.id === seat.id)
  index >= 0
    ? selectedSeats.value.splice(index, 1)
    : selectedSeats.value.push(seat)
}

// 下单
async function placeOrder() {
  try {
    if (selectedSeats.value.length === 0) return

    // 收集所有选中座位的 id
    const seatIds = selectedSeats.value.map(s => s.id)

    // 一次性发送 JSON 请求，并保存返回值
    const res = await axios.post(
      'http://localhost:8080/orders/place',
      {
        userId,
        screeningId,
        seatIds
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

    ElMessage.success('下单成功')

    // 假设后端返回订单ID
    const orderId = res.data.order.id

    // 清空已选座
    selectedSeats.value = []

    // 跳转到订单详情页
    router.push(`/orders/${orderId}`)

    // 刷新座位
    fetchSeats()  

  } catch (err) {
    console.error(err)
    ElMessage.error(err.response?.data?.message || '下单失败')
    fetchSeats()
  }
}


// 获取座位
async function fetchSeats() {
  selectedSeats.value = []
  try {
    const res = await axios.get(`http://localhost:8080/screenings/${screeningId}/seats`)
    // 默认票价50(默认出错)
    seatList.value = res.data.map(s => ({ ...s, price: 50 }))
  } catch (err) {
    console.error(err)
    ElMessage.error('获取座位失败')
  }
}

// 获取场次信息
async function fetchScreening() {
  try {
    const res = await axios.get(`http://localhost:8080/screenings/${screeningId}`)
    const s = res.data
    screeningName.value = `影厅：${s.hallName} ｜ ${s.startTime}`
  } catch (err) {
    console.error(err)
    ElMessage.error('获取场次信息失败')
  }
}

onMounted(() => {
  fetchScreening()
  fetchSeats()
})
</script>

<style scoped>
.seat-selection {
  padding: 20px;
}
.el-button {
  width: 60px;
}
</style>
