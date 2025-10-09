import { createGet, createPost } from "@/utils/request";
import type { LoginParams, CaptchaResponse } from "./index.d";

/**
 * 用户登录
 */
export const loginApi = createPost<LoginParams, any>("/api/auth/login");

/**
 * 获取验证码
 */
export const getCaptchaApi = createGet<any, CaptchaResponse>("/api/auth/captcha");

/**
 * 用户登出
 * @returns Promise<any>
 */
export const logoutApi = createGet<any, CaptchaResponse>("/api/auth/logout");

/**
 * 获取用户信息
 * @returns Promise<any>
 */
export const getUserInfoApi = createGet<any, any>("/api/auth/userInfo");
