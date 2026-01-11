import { createRouter, createWebHistory } from "vue-router";
import OrderTest from "../views/OrderTest.vue";
import Login from "../views/Login.vue";
import MainLayout from "../views/MainLayout.vue";
import MovieList from "../views/MovieList.vue";
import MovieDetail from "../views/MovieDetail.vue";
import SeatSelection from "../views/SeatSelection.vue";
import OrderList from "../views/OrderList.vue";
import OrderDetail from "../views/OrderDetail.vue";

import { isLogin } from "../utils/auth";

// 占位组件
// const Empty = { template: "<div>Loading...</div>" };
const Empty = { template: "<div>Loading...</div>" };

// const routes = [
//   { path: "/", redirect: "/login" },
//   { path: "/login", component: Login },
//   { path: "/movies", component: MovieList },
//   { path: "/movies/:id", component: MovieDetail },
//   { path: "/select", component: SeatSelection },
//   { path: "/ordertest", component: OrderTest }, // 如果还想保留
// ];

const routes = [
  {
    path: "/login",
    component: Login,
  },

  {
    path: "/",
    component: MainLayout,
    redirect: "/movies",
    children: [
      { path: "movies", component: MovieList },
      { path: "movies/:id", component: MovieDetail },
      // { path: "select", component: SeatSelection },
      { path: "select/:screeningId", component: SeatSelection },
      { path: "orders", component: OrderList },
      { path: "orders/:orderId", component: OrderDetail },
      { path: "reviews", component: Empty },
      { path: "admin", component: Empty }, // 先占位
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.path !== "/login" && !isLogin()) {
//     next("/login");
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const loggedIn = isLogin();
  // // 已登录用户，禁止再访问登录页
  // if (to.path === "/login" && isLogin()) {
  //   next("/movies");
  //   return;
  // }

  // 未登录用户，禁止访问其他页面
  if (to.path !== "/login" && !isLogin()) {
    next("/login");
    return;
  }

  next();
});

export default router;
