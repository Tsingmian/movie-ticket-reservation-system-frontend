import { createApp } from "vue";
// import './style.css'
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { Search } from "@element-plus/icons-vue";

createApp(App)
  .use(router)
  .use(ElementPlus)
  .component("Search", Search)
  .mount("#app");
