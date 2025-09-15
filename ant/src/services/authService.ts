import { message } from 'antd';
import { post, get } from '../utils/request';

// ApiResponse接口定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// User接口定义
export interface User {
  id: number;
  username: string;
  passwordHash: string;
  email: string;
  mobile: string;
  departmentId: number;
  status: number;
  lastLoginAt: string | null;
  lastLoginIp: string;
  loginAttempts: number;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Role接口定义
export interface Role {
  id: number;
  name: string;
  description: string;
  dataScope: number;
  sort: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

// Api接口定义
export interface Api {
  id: number;
  parentId: number;
  name: string;
  permissionCode: string;
  url: string;
  method: string;
  sort: number;
  status: number;
  isMenu: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// LoginRes接口定义
export interface LoginRes {
  user: User;
  roles: Role[];
  roleIds: number[];
  apis: Api[];
  apiCodes: string[];
  token: string;
  expire: string;
  refresh: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  captchaId: string;
  captchaCode: string;
}

export interface CaptchaResponse {
  id: string;
  base64: string;
}


export const authService = {
  /**
   * 用户登录
   * @param data 登录请求数据
   * @returns 登录响应数据
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginRes>> {
    try {
      const result = await post<ApiResponse<LoginRes>>(
        '/auth/login',
        data,
        {
          operationName: '登录',
          needToken: false // 登录请求不需要token
        }
      );

    
      console.log('登录响应:', result);
      
      // 如果登录成功，存储token
      if (result.code === 0 && result.data && result.data.token) {
        // 缓存用户信息
        localStorage.setItem('user', JSON.stringify(result.data.user));
        // 缓存token
        localStorage.setItem('token', result.data.token);
        // 缓存过期时间
        localStorage.setItem('expireTime', result.data.expire);
        // 缓存刷新时间
        localStorage.setItem('refreshTime', result.data.refresh);
        // 缓存ApiCodes
        localStorage.setItem('apiCodes', JSON.stringify(result.data.apiCodes));
        // 缓存角色信息
        localStorage.setItem('roles', JSON.stringify(result.data.roles));
      }

      
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取验证码
   * @param width 验证码图片宽度
   * @param height 验证码图片高度
   * @returns 验证码图片和ID
   */
  async getCaptcha(width?: number, height?: number): Promise<CaptchaResponse> {
    try {
      const params: Record<string, string> = {};
      if (width) params.width = width.toString();
      if (height) params.height = height.toString();

      const result = await get<ApiResponse<CaptchaResponse>>(
        '/auth/captcha',
        params,
        {
          operationName: '获取验证码',
          needToken: false
        }
      );

      if (result.code === 0) {
        return result.data as CaptchaResponse;
      } else {
        message.error(result.message || '获取验证码失败');
        throw new Error(result.message || '获取验证码失败');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * 用户登出
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    message.success('已成功登出');
  },

  /**
   * 获取当前登录用户信息
   * @returns 用户信息或null
   */
  getCurrentUserInfo(): any | null {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * 检查用户是否已登录
   * @returns 是否已登录
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * 重置密码
   * @param password 新密码
   * @returns 重置密码响应
   */
  async resetPassword(password: string): Promise<ApiResponse> {
    try {
      const result = await post<ApiResponse>(
        '/auth/reset-password',
        { password },
        {
          operationName: '重置密码',
          needToken: true
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取个人中心信息
   * @returns 个人中心信息
   */
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    try {
      const result = await get<ApiResponse<{ user: User }>>(
        '/auth/profile',
        {},
        {
          operationName: '获取个人中心信息',
          needToken: true
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};