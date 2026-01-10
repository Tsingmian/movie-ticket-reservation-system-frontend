import { createRouter, createWebHistory } from "vue-router";
import OrderTest from "../views/OrderTest.vue";
import Login from "../views/Login.vue";
import MovieList from "../views/MovieList.vue";
import MovieDetail from "../views/MovieDetail.vue";
import SeatSelection from "../views/SeatSelection.vue";

import { isLogin } from "../utils/auth";

// 占位组件
// const Empty = { template: "<div>Loading...</div>" };

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/movies", component: MovieList },
  { path: "/movies/:id", component: MovieDetail },
  { Path: "/select", component: SeatSelection },
  { path: "/ordertest", component: OrderTest }, // 如果还想保留
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && !isLogin()) {
    next("/login");
  } else {
    next();
  }
});

export default router;
