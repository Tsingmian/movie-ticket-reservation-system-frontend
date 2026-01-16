import { createRouter, createWebHistory } from "vue-router";
import OrderTest from "../views/OrderTest.vue";
import Login from "../views/Login.vue";
import MainLayout from "../views/MainLayout.vue";
import MovieList from "../views/MovieList.vue";
import MovieDetail from "../views/MovieDetail.vue";
import SeatSelection from "../views/SeatSelection.vue";
import OrderList from "../views/OrderList.vue";
import OrderDetail from "../views/OrderDetail.vue";
import Admin from "../views/Admin.vue";
import ReviewList from "../views/ReviewList.vue";

import { isLogin } from "../utils/auth";
import { getUser } from "../utils/auth";

// const Empty = { template: "<div>Loading...</div>" };
// const Empty = { template: "<div>Loading...</div>" };

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
    path: "/",
    redirect: () => {
      // const user = JSON.parse(localStorage.getItem("user") || "{}");
      const user = getUser();
      if (user && user.role) {
        // return "/movies"; // 已登录
        return user.role === "admin" ? "/admin" : "/movies";
      } else {
        return "/login"; // 未登录
      }
    },
  },

  {
    path: "/login",
    component: Login,
  },

  {
    path: "/",
    component: MainLayout,
    // redirect: "/movies",
    children: [
      { path: "movies", component: MovieList },
      { path: "movies/:id", component: MovieDetail },
      // { path: "select", component: SeatSelection },
      { path: "select/:screeningId", component: SeatSelection },
      { path: "orders", component: OrderList },
      { path: "orders/:orderId", component: OrderDetail },
      { path: "reviews", component: ReviewList },
      { path: "admin", component: Admin },
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

// router.beforeEach((to, from, next) => {
//   const loggedIn = isLogin();
//   // // 已登录用户，禁止再访问登录页
//   // if (to.path === "/login" && isLogin()) {
//   //   next("/movies");
//   //   return;
//   // }
//   不需要，不好测试

//   // 未登录禁止访问
//   if (to.path !== "/login" && !isLogin()) {
//     next("/login");
//     return;
//   }

//   next();
// });

router.beforeEach((to, from, next) => {
  const loggedIn = isLogin();
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  const user = getUser();

  if (!loggedIn && to.path !== "/login") {
    next("/login");
    return;
  }

  // 禁止用户
  if (to.path.startsWith("/admin") && user.role !== "admin") {
    next("/movies");
    return;
  }

  next();
});
``;

export default router;

// !
// !   !
// !   !    !
// 临时清空缓存，防止之前的数据残留，不进入登录页面

// localStorage.removeItem('user');
// location.reload();

//登录过一次后。如若下次点开为非登录界面，使用上面的代码清空浏览器缓存
