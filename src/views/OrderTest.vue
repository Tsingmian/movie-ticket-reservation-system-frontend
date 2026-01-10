<template>
  <div style="padding: 40px">
    <h2>下单测试页</h2>

    <div>
      <label>userId：</label>
      <input v-model="userId" />
    </div>

    <div>
      <label>screeningId：</label>
      <input v-model="screeningId" />
    </div>

    <div>
      <label>seatId：</label>
      <input v-model="seatId" />
    </div>

    <button @click="placeOrder">下单</button>

    <p>{{ result }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userId = ref(1)
const screeningId = ref(1)
const seatId = ref(10)
const result = ref('')

const placeOrder = async () => {
  try {
    const res = await fetch(
      `http://localhost:8080/orders/place?userId=${userId.value}&screeningId=${screeningId.value}&seatId=${seatId.value}`,
      { method: 'POST' }
    )

    if (!res.ok) {
      throw new Error('请求失败')
    }

    result.value = await res.text()
  } catch (e) {
    result.value = '下单失败'
    console.error(e)
  }
}
</script>
