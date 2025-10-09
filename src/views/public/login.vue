<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-decoration"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <img src="/vite.svg" alt="Logo" />
        </div>
        <h1 class="title">欢迎登录</h1>
        <p class="subtitle">Nova Admin 管理系统</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" :prefix-icon="User" clearable />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin" />
        </el-form-item>

        <el-form-item prop="captcha" v-if="showCaptcha">
          <div class="captcha-container">
            <el-input v-model="loginForm.captcha" placeholder="请输入验证码" size="large" :prefix-icon="Picture" clearable @keyup.enter="handleLogin" />
            <div class="captcha-image" @click="refreshCaptcha">
              <img :src="captchaImage" alt="验证码" />
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="login-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" :loading="loading" @click="handleLogin">
            {{ loading ? "登录中..." : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>还没有账号？<el-link type="primary" :underline="false">立即注册</el-link></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { User, Lock, Picture } from "@element-plus/icons-vue";

import { loginApi, getCaptchaApi } from "@/api/auth/login";
import { type LoginParams } from "@/api/auth/login/index.d";

defineOptions({
  name: "LoginView"
});

const router = useRouter();
const loginFormRef = ref<FormInstance>();

const loading = ref(false);
const rememberMe = ref(false);
const showCaptcha = ref(false);
const captchaImage = ref("");
const captchaId = ref("");

// 登录表单数据
const loginForm = reactive({
  username: "",
  password: "",
  captcha: ""
});

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在 3 到 20 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" }
  ],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};

// 组件挂载时初始化
onMounted(() => {
  // 检查是否记住用户名
  const remembered = localStorage.getItem("rememberMe");
  if (remembered === "true") {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      loginForm.username = savedUsername;
      rememberMe.value = true;
    }
  }

  // 初始化验证码
  refreshCaptcha();
});

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    const valid = await loginFormRef.value!.validate();
    if (!valid) return;

    loading.value = true;

    // 准备登录参数
    const loginParams: LoginParams = {
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: rememberMe.value
    };

    // 如果需要验证码，添加验证码参数
    if (showCaptcha.value && captchaId.value) {
      loginParams.captcha = loginForm.captcha;
      (loginParams as any).captchaId = captchaId.value;
    }

    // 调用登录API
    const response = await loginApi(loginParams);

    if (response.code === 200) {
      ElMessage.success("登录成功！");

      // 保存token到localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo));

      // 保存登录状态
      if (rememberMe.value) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", loginForm.username);
      }

      // 跳转到首页
      router.push("/");
    } else {
      ElMessage.error(response.message || "登录失败");
      showCaptcha.value = true;
      refreshCaptcha();
    }
  } catch (error: any) {
    console.error("登录失败:", error);

    // 处理API错误响应
    const errorMessage = error.response?.data?.message || error.message || "登录失败，请检查用户名和密码";
    ElMessage.error(errorMessage);

    // 登录失败后显示验证码
    showCaptcha.value = true;
    refreshCaptcha();
  } finally {
    loading.value = false;
  }
};

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    const response = await getCaptchaApi();
    if (response.code === 200) {
      captchaId.value = response.data.captchaId;
      captchaImage.value = response.data.captchaImage;
    } else {
      // 如果API调用失败，使用本地生成的验证码
      captchaId.value = Math.random().toString(36).substr(2, 9);
      captchaImage.value = `data:image/svg+xml;base64,${btoa(`
        <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="40" fill="#f0f0f0"/>
          <text x="60" y="25" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">${Math.random().toString(36).substr(2, 4).toUpperCase()}</text>
        </svg>
      `)}`;
    }
  } catch (error) {
    console.error("获取验证码失败:", error);
    // 使用本地生成的验证码作为备用
    captchaId.value = Math.random().toString(36).substr(2, 9);
    captchaImage.value = `data:image/svg+xml;base64,${btoa(`
      <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" fill="#f0f0f0"/>
        <text x="60" y="25" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">${Math.random().toString(36).substr(2, 4).toUpperCase()}</text>
      </svg>
    `)}`;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    .bg-decoration {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 2px, transparent 2px);
      background-size: 60px 60px;
      animation: float 15s ease-in-out infinite;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, -50px) rotate(90deg);
  }
  50% {
    transform: translate(-30px, 30px) rotate(180deg);
  }
  75% {
    transform: translate(40px, 20px) rotate(270deg);
  }
}

.login-card {
  position: relative;
  z-index: 2;
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .login-header {
    text-align: center;
    margin-bottom: 30px;

    .logo {
      margin-bottom: 20px;

      img {
        width: 60px;
        height: 60px;
      }
    }

    .title {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }

  .login-form {
    .el-form-item {
      margin-bottom: 20px;

      :deep(.el-input__wrapper) {
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        &.is-focus {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
      }
    }
  }

  .captcha-container {
    display: flex;
    gap: 10px;
    align-items: center;

    .el-input {
      flex: 1;
    }

    .captcha-image {
      width: 120px;
      height: 40px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #e0e0e0;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        transform: scale(1.02);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .login-btn {
    width: 100%;
    height: 48px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 20px;

    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 30px 20px;
    margin: 20px;
  }

  .login-header .title {
    font-size: 24px;
  }

  .captcha-container {
    flex-direction: column;

    .captcha-image {
      width: 100%;
      height: 50px;
    }
  }
}
</style>
