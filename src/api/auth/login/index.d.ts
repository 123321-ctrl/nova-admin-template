// 登录相关API类型定义

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userInfo: {
      id: number;
      username: string;
      nickname: string;
      avatar: string;
      roles: string[];
    };
  };
}

export interface CaptchaResponse {
  code: number;
  message: string;
  data: {
    captchaId: string;
    captchaImage: string;
  };
}

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  roles: string[];
  permissions: string[];
}
