import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { writeFileSync } from 'fs';

import { fileURLToPath, URL } from 'node:url';
import path from 'path';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import moment from 'moment';
import { execSync } from 'child_process';
import { shouldEnableSentryBuild } from './src/monitor/config';

// https://vite.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // 生成基于日期+时间+git hash的版本号（固定使用北京时间 UTC+8）
  const now = moment().utcOffset(8); // 固定使用 UTC+8 时区
  // 获取当前工作目录
  const root = process.cwd();
  // 获取环境变量
  const env = loadEnv(mode, root, '');

  // 获取当前 git commit 的短 hash（7位）
  let gitHash = '';
  try {
    // 获取当前 commit 的短 hash
    gitHash = execSync('git rev-parse --short=7 HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn('无法获取 git hash，使用随机字符串:', error);
  }

  // 版本格式: YYYYMMDD.HHmmss.git_hash (例如: 20250809.120525.a1b2c3d)
  const currentVersion = `${now.format('YYYYMMDD')}.${now.format('HHmmss')}.${gitHash}`;
  const buildTime = now.format(); // 北京时间格式: 2025-08-09T12:05:25+08:00
  const sentryRelease = `nova-admin-template@${currentVersion}`;
  const sentryEnabled =
    env.VITE_SENTRY_ENABLED === 'true' && env.VITE_SENTRY_ENVIRONMENT === 'test';
  const sentryBuildEnabled = shouldEnableSentryBuild(command, sentryEnabled);

  if (sentryBuildEnabled) {
    const requiredSentryEnv = [
      'VITE_SENTRY_DSN',
      'SENTRY_ORG',
      'SENTRY_PROJECT',
      'SENTRY_AUTH_TOKEN',
    ].filter((key) => !env[key]);

    if (requiredSentryEnv.length > 0) {
      throw new Error(`Sentry build configuration is missing: ${requiredSentryEnv.join(', ')}`);
    }
  }

  // 创建生成 version.json 文件的插件
  const generateVersionPlugin = () => {
    return {
      name: 'generate-version',
      generateBundle() {
        try {
          // 生成版本信息（只保留 version 和 buildTime）
          const versionInfo = {
            version: currentVersion,
            buildTime: buildTime,
          };

          // 写入 version.json 文件到 dist 目录
          const distVersionPath = path.resolve(process.cwd(), 'dist', 'version.json');
          writeFileSync(distVersionPath, JSON.stringify(versionInfo, null, 2));

          console.log(`✅ 已生成版本文件: ${distVersionPath}`);
          console.log(`📦 新版本号: ${currentVersion}`);
          console.log(`🕒 构建时间: ${buildTime}`);
        } catch (error) {
          console.warn('⚠️ 生成版本文件失败:', error);
        }
      },
    };
  };

  return {
    // 项目根目录
    root,
    // 项目部署的基础路径
    base: env.VITE_BASE_PATH || '/',
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'i-[dir]-[name]',
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      generateVersionPlugin(),
      ...(sentryBuildEnabled
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
              telemetry: false,
              release: {
                name: sentryRelease,
              },
              sourcemaps: {
                assets: './dist/**',
                filesToDeleteAfterUpload: './dist/**/*.map',
              },
            }),
          ]
        : []),
    ],
    build: {
      sourcemap: sentryBuildEnabled ? 'hidden' : false,
    },
    server: {
      // 指定服务器应该监听哪个IP地址，如果将此设置为0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址
      host: '0.0.0.0',
      // 开发环境预览服务器端口
      port: 8080,
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
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },
    define: {
      // 注入版本信息
      __APP_VERSION__: JSON.stringify(currentVersion),
      __BUILD_TIME__: JSON.stringify(buildTime),
    },
  };
});
