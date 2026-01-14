<!-- frontend/src/views/ReviewList.vue -->
<template>
  <div class="review-page">
    <h2 class="page-title">观影评价</h2>

    <!-- 选择电影 -->
    <el-card class="movie-selector">
      <el-form :model="form" label-width="80px">
        <el-form-item label="选择电影">
          <el-select v-model="form.movieId" placeholder="请选择电影" @change="handleMovieChange" style="width: 100%">
            <el-option v-for="movie in movies" :key="movie.id" :label="movie.title" :value="movie.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加新评论 -->
    <el-card class="add-comment" v-if="form.movieId">
      <h3>发表你的评价</h3>
      <el-form :model="newComment" :rules="commentRules" ref="commentFormRef" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="newComment.userName" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="newComment.content" type="textarea" :rows="4" maxlength="500" show-word-limit
            placeholder="说说你的观影感受吧..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitComment" :loading="submitting">
            提交评论
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comment-list">
      <h3>已有 {{ comments.length }} 条评价</h3>
      <el-timeline>
        <el-timeline-item v-for="comment in comments" :key="comment.commentId"
          :timestamp="formatTime(comment.commentTime)" placement="top">
          <el-card>
            <div class="comment-header">
              <span class="user-name">{{ comment.userName }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-empty v-else description="暂无评论，快来抢沙发吧！" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 状态
const movies = ref([]);
const comments = ref([]);
const form = ref({ movieId: null });
const newComment = ref({
  userName: '',
  content: ''
});
const submitting = ref(false);
const commentFormRef = ref();

// 表单校验规则
const commentRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 30, message: '用户名不能超过30个字', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
    { max: 500, message: '评论不能超过500字', trigger: 'blur' }
  ]
};

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 加载评论
const loadComments = async (movieId) => {
  if (!movieId) return;
  try {
    const res = await axios.get('/api/comments/list', {
      params: { movieId }
    });
    // 🔥 关键：根据后端实际返回结构调整！
    // 如果后端返回 { status:1, data: [...] } → 用 res.data.data
    // 如果后端直接返回 [...] → 用 res.data
    comments.value = res.data.data || res.data || [];
    console.log('Loaded comments:', comments.value);
    console.log("第一条评论对象 =", comments.value[0]);

  } catch (err) {
    ElMessage.error('加载评论失败');
    console.error('loadComments error:', err);
  }
};

// 获取电影列表
// const fetchMovies = async () => {
//   try {
//     const res = await axios.get('/movies');
//     // 🔥 同样：根据后端返回结构决定是否取 .data
//     movies.value = res.data.data || res.data || [];
//     console.log('Fetched movies:', movies.value);
//     if (movies.value.length > 0) {
//       form.value.movieId = movies.value[0].id;
//       await loadComments(form.value.movieId);
//     }
//   } catch (err) {
//     ElMessage.error('获取电影列表失败');
//     console.error('fetchMovies error:', err);
//   }
// };

// const fetchMovies = async () => {
//   try {
//     const res = await axios.get('/movies');
//     const rawData = res.data.data || res.data || [];

//     // 过滤：必须有 id 且 id 不为 null/undefined，且有 title
//     movies.value = rawData.filter(m => 
//       m && 
//       m.id !== undefined && 
//       m.id !== null && 
//       m.title
//     ).map(m => ({
//       id: Number(m.id), // 确保 id 是 number（如果后端返回字符串）
//       title: String(m.title),
//       duration: m.duration,
//       director: m.director,
//       actors: m.actors,
//       description: m.description,
//       releaseDate: m.releaseDate,
//       status: m.status
//     }));

//     if (movies.value.length > 0) {
//       form.value.movieId = movies.value[0].id;
//       await loadComments(form.value.movieId);
//     }
//   } catch (err) {
//     ElMessage.error('获取电影列表失败');
//     console.error(err);
//   }
// };

const fetchMovies = async () => {
  try {
    const res = await axios.get('/movies');

    // 🔥 关键：打印原始响应
    console.log('Full response from /movies:', res);
    console.log('res.data =', res.data);
    console.log('typeof res.data =', typeof res.data);
    console.log('Array.isArray(res.data) =', Array.isArray(res.data));
    console.log('res.data.data =', res.data?.data);
    console.log('Array.isArray(res.data.data) =', Array.isArray(res.data?.data));

    // 安全提取数据
    let movieList = [];
    if (Array.isArray(res.data)) {
      movieList = res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      movieList = res.data.data;
    } else {
      ElMessage.error('电影数据格式异常，请检查后端返回');
      console.error('Unexpected response format:', res.data);
      return;
    }

    movies.value = movieList.filter(m =>
      m && m.id != null && m.title
    );

    if (movies.value.length > 0) {
      form.value.movieId = movies.value[0].id;
      await loadComments(form.value.movieId);
    }
  } catch (err) {
    ElMessage.error('获取电影列表失败');
    console.error('fetchMovies error:', err);
  }
};

// 处理电影切换
const handleMovieChange = (movieId) => {
  loadComments(movieId);
};

// 提交评论
const submitComment = async () => {
  if (!form.value.movieId) {
    ElMessage.warning('请先选择一部电影');
    return;
  }

  await commentFormRef.value?.validate(async (valid) => {
    if (!valid) return;

    submitting.value = true;
    try {
      await axios.post('/api/comments/add', null, {
        params: {
          movieId: form.value.movieId,
          userName: newComment.value.userName.trim(),
          content: newComment.value.content.trim()
        }
      });

      ElMessage.success('评论提交成功！');
      newComment.value = { userName: '', content: '' };
      await loadComments(form.value.movieId);
    } catch (err) {
      ElMessage.error('提交失败，请重试');
      console.error('submitComment error:', err);
    } finally {
      submitting.value = false;
    }
  });
};

// 初始化
onMounted(() => {
  console.log('ReviewList mounted, calling fetchMovies...');
  fetchMovies();
});
</script>

<style scoped>
.review-page {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  color: #333;
}

.movie-selector {
  margin-bottom: 24px;
}

.add-comment {
  margin-bottom: 30px;
}

.comment-list h3 {
  margin-bottom: 20px;
  color: #555;
}

.comment-header {
  margin-bottom: 8px;
}

.user-name {
  font-weight: bold;
  color: #409eff;
}

.comment-content {
  line-height: 1.6;
  color: #333;
}
</style>