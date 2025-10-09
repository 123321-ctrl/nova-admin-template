import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { fileURLToPath, URL } from "node:url";
import path from "path";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 获取当前工作目录
  const root = process.cwd();
  // 获取环境变量
  const env = loadEnv(mode, root);
  console.log(env);

  return {
    // 项目根目录
    root,
    // 项目部署的基础路径
    base: "./",
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
        // 指定symbolId格式
        symbolId: "i-[dir]-[name]"
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      // 指定服务器应该监听哪个IP地址，如果将此设置为0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址
      host: "0.0.0.0",
      // 开发环境预览服务器端口
      port: 8080
      // proxy: {
      //    以/image开头的请求都会被转发到target中
      //   "/image": {
      //     target: "https://xxxx.com/api", // 接口的域名
      //     secure: false, // 如果是https接口，需要配置这个参数
      //     changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //     rewrite: (path) => path.replace(/^\/image/, ""), //重定向
      //   },
      // },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
        "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
        "@utils": fileURLToPath(new URL("./src/utils", import.meta.url))
      }
    }
  };
});
