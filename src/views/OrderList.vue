<template>
  <div>
    <h2>我的订单</h2>

    <!-- 筛选 -->
    <el-radio-group v-model="filterStatus" @change="fetchOrders" style="margin-bottom: 15px;">
      <el-radio :value="null">全部</el-radio>
      <el-radio :value="0">未支付</el-radio>
      <el-radio :value="1">已支付</el-radio>
      <el-radio :value="2">已取消</el-radio>
    </el-radio-group>

    <!-- 订单表 -->
    <el-table
      :data="orders"
      border
      style="width: 100%"
      :header-cell-style="centerStyle"
      :cell-style="centerStyle"
    >
      <el-table-column prop="id" label="订单ID" min-width="120" />
      <el-table-column prop="screeningId" label="场次ID" width="120" />
      <el-table-column prop="seatCount" label="座位数" width="80" />
      <el-table-column prop="price" label="总价" width="90">
        <template #default="scope">
          ¥{{ parseFloat(scope.row.price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="scope">
          {{
            scope.row.status === 0
              ? '未支付'
              : scope.row.status === 1
              ? '已支付'
              : '已取消'
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="viewDetail(scope.row.id)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; text-align: right"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page="page"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const orders = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(5)
const filterStatus = ref(null)

// ✅ 安全获取 userId
const getStoredUserId = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    // 未登录跳转
    router.push('/login')
    return null
  }
  try {
    const user = JSON.parse(userStr)
    return user.id
  } catch (e) {
    console.error('解析 user 失败', e)
    router.push('/login')
    return null
  }
}

const userId = getStoredUserId()
if (!userId) {
  // 如果没拿到 userId，函数已跳转，这里可提前 return
}

const centerStyle = { textAlign: 'center', verticalAlign: 'middle' }

const fetchOrders = async () => {
  if (!userId) return // 防御性编程

  try {
    const res = await axios.get(`http://localhost:8080/orders/user/${userId}`, {
      params: {
        status: filterStatus.value,
        page: page.value,
        size: size.value
      }
    })
    orders.value = res.data.orders || []
    total.value = res.data.total || 0
  } catch (err) {
    console.error('获取订单失败:', err)
    alert('获取订单失败，请重新登录')
    router.push('/login')
  }
}

const handlePageChange = (newPage) => {
  page.value = newPage
  fetchOrders()
}

const viewDetail = (orderId) => {
  router.push(`/orders/${orderId}`)
}

onMounted(() => {
  if (userId) fetchOrders()
})
</script>

<style scoped>
:deep(.el-table .cell) {
  white-space: normal !important;
  word-break: break-all;
  line-height: 1.4;
}

:deep(.el-button--small) {
  padding: 5px 8px;
  font-size: 12px;
}
</style>