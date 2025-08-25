import axios from "axios";
import type { Response } from "@api/index.d";
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ElMessage } from "element-plus";

interface BaseResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * @description: 配置项
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "/",
  withCredentials: false, // 设置跨域cookie上传
  timeout: 180000, // 请求超时
});

/**
 * @description: request 拦截器 ==> 对请求参数做处理
 * @return {*}
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.error(error); // for debug
    return Promise.reject(error);
  }
);

/**
 * @description: response 拦截器 ==> 对响应做处理
 * @return {*}
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 当请求不为200时，报错
    if (res.code !== 200) {
      ElMessage.closeAll();
      ElMessage({ message: res.msg, type: "warning" });
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

/**
 * @description: Get请求
 * @param {string} url
 * @return {*}
 */
export function createGet<P extends Record<string, any>, R>(url: string) {
  return function (
    params?: P,
    config: AxiosRequestConfig = {}
  ): Promise<Response<R>> {
    return service.request({
      method: "get",
      url,
      params,
      ...config,
    });
  };
}

/**
 * @description: Post请求
 * @param {string} url
 * @return {*}
 */
export function createPost<P extends Record<string, any>, R>(url: string) {
  return function (
    data?: P,
    config: AxiosRequestConfig = {},
    params?: any
  ): Promise<Response<R>> {
    return service.request({
      method: "post",
      url,
      data,
      params,
      ...config,
    });
  };
}

/**
 * @description: 创建回执
 * @return {*}
 */
export function createResponse<T>(type?: "" | "paging") {
  if (type === "paging") {
    return (data?: T) => {
      console.log("✨  Mock => ", data);
      return {
        code: 200,
        msg: "success",
        data: {
          limit: 30,
          page: 1,
          ...data,
        },
      };
    };
  }
  return (data?: T) => {
    console.log("✨  Mock => ", data);
    return {
      code: 200,
      msg: "success",
      data,
    };
  };
}

export default service;
