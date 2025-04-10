import { createApp } from "vue";

import { setupStore } from "@/store";
import "virtual:svg-icons-register";
import App from "./App.vue";
import router from "./router";
import "element-plus/dist/index.css";

import "./assets/styles/global.scss";
import "./assets/styles/root.scss";

const app = createApp(App);

setupStore(app);

app.use(router);
app.mount("#app");
