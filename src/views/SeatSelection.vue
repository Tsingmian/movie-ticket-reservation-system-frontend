<template>
  <div class="seat-selection">
    <h2>选座系统 - {{ screeningName }}</h2>

    <!-- 座位表格 -->
    <el-table :data="seatGrid" border style="width: 100%">
      <el-table-column
        v-for="col in cols"
        :key="col"
        :label="'Col ' + col"
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
      <p>已选座位: {{ selectedSeatsText }}</p>
      <p>总价: ￥{{ totalPrice }}</p>
      <el-button type="primary" @click="placeOrder" :disabled="selectedSeats.length === 0">
        下单支付
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 模拟登录用户
const userId = 1
const screeningId = 1
const screeningName = ref('测试电影 18:00')

const seatList = ref([]) // 后端返回的座位列表
const selectedSeats = ref([]) // 已选座位数组

// 表格布局计算
const rows = 5
const cols = [1,2,3,4,5]
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

// 总价
const totalPrice = computed(() => selectedSeats.value.reduce((sum, s) => sum + s.price, 0))

// 已选座位文字
const selectedSeatsText = computed(() => selectedSeats.value.map(s => `${s.rowNum}-${s.colNum}`).join(', '))

// 获取座位状态类型
function getSeatType(seat) {
  if (!seat) return 'default'
  if (seat.status === 0) return 'success'
  if (seat.status === 1) return 'warning'
  if (seat.status === 2) return 'danger'
}

// 点击切换座位
function toggleSeat(seat) {
  if (!seat || seat.status === 2) return

  const index = selectedSeats.value.findIndex(s => s.id === seat.id)
  if (index >= 0) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat)
  }
}

// 下单
async function placeOrder() {
  try {
    const seatIds = selectedSeats.value.map(s => s.id)
    await axios.post('http://localhost:8080/orders/place', {
       userId, screeningId, seatIds : selectedSeats.value.map(s => s.id)
    })
    ElMessage.success('下单成功！')
    fetchSeats() // 刷新座位状态
    selectedSeats.value = []
  } catch (err) {
    ElMessage.error(err.response?.data?.message || err.message)
    fetchSeats()
  }
}

// 获取座位
async function fetchSeats() {
  try {
    const res = await axios.get(`http://localhost:8080/screenings/${screeningId}/seats`)
    seatList.value = res.data.map(s => ({ ...s, price: 50 })) // 假设票价 50 元
  } catch (err) {
    ElMessage.error('获取座位失败')
  }
}

onMounted(() => {
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
