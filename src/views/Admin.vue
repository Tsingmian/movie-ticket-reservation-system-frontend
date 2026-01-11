<template>
  <div>
    <el-card>
      <el-tabs v-model="activeTab">
        <!-- 电影管理 -->
        <!-- 电影管理 -->
        <el-tab-pane label="电影管理" name="movies">
          <el-button type="primary" @click="openMovieDialog()">添加电影</el-button>
          <el-table :data="movies" style="margin-top:10px;">
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="title" label="名称"/>
            <el-table-column prop="duration" label="时长(分钟)" width="120"/>
            <el-table-column prop="director" label="导演" width="150"/>
            <el-table-column prop="releaseDate" label="上映日期" width="140"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                {{ scope.row.status === 1 ? '上映中' : '已下架' }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作" width="220">
              <template #default="scope">
                <!-- <el-button size="small" @click="editMovie(scope.row)">编辑</el-button> -->
                <!-- 替换原来的 editMovie -->
                <el-button size="small" @click="openMovieDialog(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteMovie(scope.row.id)">删除</el-button>
                <el-button size="small" type="primary" @click="selectMovie(scope.row)">管理场次</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 场次管理 -->
        <el-tab-pane label="场次管理" name="screenings" v-if="selectedMovie">
          <h3>电影: {{ selectedMovie.title }}</h3>
          <el-button type="primary" @click="openScreeningDialog()">添加场次</el-button>
          <el-table :data="screenings" style="margin-top:10px;">
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="startTime" label="开始时间"/>
            <el-table-column prop="price" label="票价"/>
            <el-table-column prop="hallName" label="放映厅"/>
            <el-table-column label="操作" width="220">
              <template #default="scope">
                <el-button size="small" @click="editScreening(scope.row)">编辑</el-button>
                <!-- <el-button size="small" type="danger" @click="deleteScreening(scope.row.id)">删除</el-button> -->
                <el-button size="small" type="primary" @click="selectScreening(scope.row)">管理座位</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 座位管理 -->
        <el-tab-pane label="座位管理" name="seats" v-if="selectedScreening">
          <h3>场次: {{ selectedScreening.id }} - {{ selectedScreening.startTime }}</h3>
          <div class="seat-map">
            <div v-for="row in seatRows" :key="row" class="seat-row">
              <el-button
                v-for="col in seatCols"
                :key="col"
                :type="seatType(seatMatrix[row]?.[col] || 0)"
                @click="toggleSeat(row, col)"
                :disabled="!seatMatrix[row]"
              >
                {{ row }}-{{ col }}
              </el-button>
            </div>
          </div>
          <el-button type="success" style="margin-top:10px;" @click="saveSeats()">保存座位状态</el-button>
          <el-button style="margin-left:10px;" @click="activeTab = 'screenings'">返回场次</el-button>
        </el-tab-pane>

        <!-- 订单管理 -->
        <el-tab-pane label="订单管理" name="orders">
          <el-table :data="orders" style="margin-top:10px;">
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="userId" label="用户ID" width="100"/>
            <el-table-column prop="screeningId" label="场次ID" width="100"/>
            <el-table-column prop="seatCount" label="座位数" width="100"/>
            <el-table-column prop="price" label="总价" width="100"/>
            <el-table-column prop="status" label="状态" width="100"/>
            <el-table-column label="操作" width="260">
              <template #default="scope">
                <!-- <el-button size="small" type="danger" @click="deleteOrder(scope.row.id)">删除</el-button> -->
                <el-button size="small" type="warning" @click="cancelOrder(scope.row)">取消订单</el-button>
                <el-button size="small" type="primary" @click="editOrderSeats(scope.row)">修改座位</el-button>
                <el-button
                  size="small"
                  type="success"
                  :disabled="scope.row.status === 'PAID'"
                  @click="payOrder(scope.row)"
                >
                  {{ scope.row.status === 'PAID' ? '已支付' : '支付' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 电影弹窗 -->
    <!-- 电影弹窗 -->
    <el-dialog title="添加/编辑电影" v-model="movieDialogVisible" width="500px">
      <el-form :model="movieForm" label-width="100px" :rules="movieRules" ref="movieFormRef">
        <el-form-item label="电影名称" prop="title">
          <el-input v-model="movieForm.title" placeholder="请输入电影名称" />
        </el-form-item>
    
        <el-form-item label="时长(分钟)" prop="duration">
          <el-input-number v-model="movieForm.duration" :min="1" :max="600" controls-position="right" />
        </el-form-item>
    
        <el-form-item label="导演" prop="director">
          <el-input v-model="movieForm.director" placeholder="请输入导演姓名" />
        </el-form-item>
    
        <el-form-item label="主演">
          <el-input v-model="movieForm.actors" placeholder="多个演员用逗号分隔" />
        </el-form-item>
    
        <el-form-item label="上映日期" prop="releaseDate">
          <el-input v-model="movieForm.releaseDate" placeholder="格式: 2026-01-12" />
        </el-form-item>
    
        <el-form-item label="状态" prop="status">
          <el-select v-model="movieForm.status" placeholder="请选择">
            <el-option :value="1" label="上映中" />
            <el-option :value="0" label="已下架" />
          </el-select>
        </el-form-item>
    
        <el-form-item label="描述">
          <el-input type="textarea" v-model="movieForm.description" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="movieDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMovie()">保存</el-button>
      </template>
    </el-dialog>

    <!-- 场次弹窗 -->
    <el-dialog title="添加/编辑场次" v-model="screeningDialogVisible" width="500px">
      <el-form :model="screeningForm" label-width="80px">
        <el-form-item label="开始时间">
          <el-input v-model="screeningForm.startTime" placeholder="格式: 2026-01-12 19:30" />
        </el-form-item>
        <el-form-item label="票价">
          <el-input-number v-model="screeningForm.price" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="放映厅">
          <el-input v-model="screeningForm.hallName" placeholder="如: 1号厅" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="screeningDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveScreening()">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { ElMessage } from "element-plus";
  import axios from "axios";
  
  // Tabs
  const activeTab = ref("movies");
  
  // 电影（保持 reactive，已正常）
  const movies = ref([]);
  const movieDialogVisible = ref(false);
  const movieFormRef = ref();
  
  const movieForm = reactive({
    id: null,
    title: "",
    duration: 90,
    director: "",
    actors: "",
    description: "",
    releaseDate: "",
    status: 1
  });
  
  const selectedMovie = ref(null);
  
  const movieRules = {
    title: [{ required: true, message: '请输入电影名称', trigger: 'blur' }],
    duration: [{ required: true, message: '请输入时长', trigger: 'blur' }],
    director: [{ required: true, message: '请输入导演', trigger: 'blur' }],
    releaseDate: [{ required: true, message: '请输入上映日期（格式：2026-01-12）', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  };
  
  // ================== 场次（改为 ref）==================
  const screenings = ref([]);
  const screeningDialogVisible = ref(false);
  // ✅ 改为 ref
  const screeningForm = ref({
    id: null,
    startTime: "",
    price: 0,
    hallName: ""
  });
  const selectedScreening = ref(null);
  
  // 座位
  const seatRows = ref([]);
  const seatCols = ref([]);
  const seatMatrix = ref([]);
  
  // 订单
  const orders = ref([]);
  
  // ================== 电影逻辑（不变）==================
  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/movies");
      movies.value = res.data.data || [];
    } catch (e) {
      ElMessage.error("获取电影列表失败");
      console.error(e);
    }
  };
  
  const resetMovieForm = () => {
    Object.assign(movieForm, {
      id: null,
      title: "",
      duration: 90,
      director: "",
      actors: "",
      description: "",
      releaseDate: "",
      status: 1
    });
  };
  
  const openMovieDialog = (movie = null) => {
    resetMovieForm();
    if (movie) {
      Object.assign(movieForm, {
        id: movie.id,
        title: movie.title || '',
        duration: movie.duration || 90,
        director: movie.director || '',
        actors: movie.actors || '',
        description: movie.description || '',
        releaseDate: movie.releaseDate || '',
        status: movie.status ?? 1
      });
    }
    movieDialogVisible.value = true;
  };
  
  const saveMovie = async () => {
    try {
      await movieFormRef.value?.validate();
      const url = movieForm.id
        ? `http://localhost:8080/admin/movies/${movieForm.id}`
        : "http://localhost:8080/admin/movies";
      const method = movieForm.id ? axios.put : axios.post;
  
      await method(url, movieForm);
      movieDialogVisible.value = false;
      ElMessage.success(movieForm.id ? "电影更新成功" : "电影添加成功");
      await fetchMovies();
    } catch (err) {
      if (err?.response?.status === 400) {
        ElMessage.error("请检查输入格式（如日期应为 YYYY-MM-DD）");
      } else {
        ElMessage.error("保存失败，请重试");
      }
      console.error(err);
    }
  };
  
  const deleteMovie = async (id) => {
    if (!confirm("确定删除该电影？")) return;
    try {
      await axios.delete(`http://localhost:8080/admin/movies/${id}`);
      ElMessage.success("电影已删除");
      await fetchMovies();
      if (selectedMovie.value?.id === id) {
        selectedMovie.value = null;
        activeTab.value = "movies";
      }
    } catch (e) {
      ElMessage.error("删除失败");
      console.error(e);
    }
  };
  
  const selectMovie = (movie) => {
    selectedMovie.value = movie;
    activeTab.value = "screenings";
    fetchScreenings(movie.id);
  };
  
  // ================== 场次逻辑（关键修改）==================
  const fetchScreenings = async (movieId) => {
    try {
      const res = await axios.get(`http://localhost:8080/admin/screenings`, {
        params: { movieId },
      });
      screenings.value = res.data.data || [];
    } catch (e) {
      ElMessage.error("获取场次失败");
      console.error(e);
    }
  };
  
  // ✅ 重置：直接替换整个对象
  const resetScreeningForm = () => {
    screeningForm.value = {
      id: null,
      startTime: "",
      price: 0,
      hallName: ""
    };
  };
  
  // ✅ 打开弹窗：支持新建/编辑
  const openScreeningDialog = (screening = null) => {
    resetScreeningForm();
    if (screening) {
      screeningForm.value = { ...screening }; // ✅ 安全赋值
    }
    screeningDialogVisible.value = true;
  };
  
  // ✅ 保存场次
  const saveScreening = async () => {
    try {
      // 检查是否选择了电影
      if (!selectedMovie.value) {
        ElMessage.warning("请先选择一部电影");
        return;
      }
  
      const payload = {
        ...screeningForm.value,
        movieId: selectedMovie.value.id // ✅ 关键：绑定到当前电影
      };
  
      // 简单校验
      if (!payload.startTime || !payload.hallName || payload.price <= 0) {
        ElMessage.error("请填写完整的场次信息");
        return;
      }
  
      const url = payload.id
        ? `http://localhost:8080/admin/screenings/${payload.id}`
        : "http://localhost:8080/admin/screenings";
      const method = payload.id ? axios.put : axios.post;
  
      await method(url, payload);
      screeningDialogVisible.value = false;
      ElMessage.success(payload.id ? "场次更新成功" : "场次添加成功");
      await fetchScreenings(selectedMovie.value.id);
    } catch (err) {
      console.error("保存场次失败:", err);
      if (err.response?.status === 400) {
        ElMessage.error("时间格式错误，请使用 YYYY-MM-DD HH:mm");
      } else {
        ElMessage.error("保存失败，请检查网络或后端");
      }
    }
  };
  
  const deleteScreening = async (id) => {
    if (!confirm("确定删除该场次？")) return;
    try {
      await axios.delete(`http://localhost:8080/admin/screenings/${id}`);
      ElMessage.success("场次已删除");
      await fetchScreenings(selectedMovie.value.id);
      if (selectedScreening.value?.id === id) {
        selectedScreening.value = null;
        activeTab.value = "screenings";
      }
    } catch (e) {
      ElMessage.error("删除失败");
      console.error(e);
    }
  };
  
  const editScreening = (screening) => {
    openScreeningDialog(screening); // ✅ 复用打开逻辑
  };
  
  const selectScreening = (screening) => {
    selectedScreening.value = screening;
    activeTab.value = "seats";
    fetchSeats(screening.id);
  };
  
  // ================== 座位 & 订单（不变）==================
  const fetchSeats = async (screeningId) => {
    try {
      const res = await axios.get(`http://localhost:8080/admin/screenings/${screeningId}/seats`);
      const seats = res.data.data || [];
  
      if (seats.length === 0) {
        const rows = 5, cols = 5;
        seatRows.value = Array.from({ length: rows }, (_, i) => i);
        seatCols.value = Array.from({ length: cols }, (_, i) => i);
        seatMatrix.value = Array.from({ length: rows }, () => Array(cols).fill(0));
        return;
      }
  
      const maxRow = Math.max(...seats.map(s => s.rowNum));
      const maxCol = Math.max(...seats.map(s => s.colNum));
      seatRows.value = Array.from({ length: maxRow + 1 }, (_, i) => i);
      seatCols.value = Array.from({ length: maxCol + 1 }, (_, i) => i);
      seatMatrix.value = Array.from({ length: maxRow + 1 }, () => Array(maxCol + 1).fill(0));
  
      seats.forEach(s => {
        if (s.rowNum <= maxRow && s.colNum <= maxCol) {
          seatMatrix.value[s.rowNum][s.colNum] = s.status;
        }
      });
    } catch (e) {
      ElMessage.error("获取座位信息失败");
      console.error(e);
    }
  };
  
  const seatType = (status) => {
    if (status === 0) return "success";
    if (status === 1) return "warning";
    return "danger";
  };
  
  const toggleSeat = (r, c) => {
    const current = seatMatrix.value[r]?.[c] || 0;
    seatMatrix.value[r][c] = (current + 1) % 3;
  };
  
  const saveSeats = async () => {
    try {
      const seatUpdates = [];
      const maxR = seatRows.value.at(-1);
      const maxC = seatCols.value.at(-1);
      for (let r = 0; r <= maxR; r++) {
        for (let c = 0; c <= maxC; c++) {
          seatUpdates.push({
            rowNum: r,
            colNum: c,
            status: seatMatrix.value[r]?.[c] || 0
          });
        }
      }
  
      await axios.put(`http://localhost:8080/admin/screenings/${selectedScreening.value.id}/seats`, seatUpdates);
      ElMessage.success("座位状态保存成功");
    } catch (e) {
      ElMessage.error("保存座位失败");
      console.error(e);
    }
  };
  
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/orders");
      orders.value = res.data.orders || [];
    } catch (e) {
      ElMessage.error("获取订单失败");
      console.error(e);
    }
  };
  
  // const deleteOrder = async (id) => {
  //   if (!confirm("确定删除该订单？")) return;
  //   try {
  //     await axios.delete(`http://localhost:8080/admin/orders/${id}`);
  //     ElMessage.success("订单已删除");
  //     await fetchOrders();
  //   } catch (e) {
  //     ElMessage.error("删除失败");
  //     console.error(e);
  //   }
  // };
  
  const editOrderSeats = (order) => {
    ElMessage.info("座位修改功能需后端支持，当前仅演示");
  };
  
  const payOrder = async (order) => {
    try {
      await axios.post(`http://localhost:8080/admin/orders/${order.id}/pay`);
      ElMessage.success("支付成功");
      await fetchOrders();
    } catch (e) {
      ElMessage.error("支付失败");
      console.error(e);
    }
  };

  const cancelOrder = async (order) => {
  if (!confirm("确定取消该订单？")) return;
  try {
    await axios.post(`http://localhost:8080/admin/orders/${order.id}/cancel`);
    ElMessage.success("订单已取消");
    await fetchOrders();
  } catch (e) {
    ElMessage.error("取消失败");
    console.error(e);
  }
};
  
  // 初始化
  onMounted(() => {
    fetchMovies();
    fetchOrders();
  });

  
  </script>

<style scoped>
.seat-row {
  display: flex;
  margin-bottom: 5px;
}
.seat-row .el-button {
  margin-right: 3px;
  min-width: 60px;
}
.layout {
  padding: 20px;
}
</style>