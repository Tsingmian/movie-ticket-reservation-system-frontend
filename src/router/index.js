import { createRouter, createWebHistory } from "vue-router";
import OrderTest from "../views/OrderTest.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: OrderTest,
    },
  ],
});

export default router;
