import { message } from 'antd';
// 获取API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 统一的请求配置接口
 */
export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  /** 请求路径 */
  url: string;
  /** 请求数据 */
  data?: any;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求超时时间（毫秒），默认30秒 */
  timeout?: number;
  /** 操作名称，用于错误提示 */
  operationName?: string;
  /** 是否需要携带token，默认true */
  needToken?: boolean;
  /** 是否处理响应，默认true */
  processResponse?: boolean;
}

/**
 * 获取token
 * @returns token字符串或null
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * 统一的API请求工具函数
 * 自动添加token、处理超时、统一错误处理
 */
export const request = async <T = any>(options: RequestOptions): Promise<T> => {
  const {
    url,
    method = 'GET',
    data,
    headers = {},
    timeout = 30000,
    operationName = '请求',
    needToken = true,
    processResponse = true,
    ...rest
  } = options;

  // 构建完整的请求URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  // 准备请求头
  const requestHeaders: Record<string, string> = {
    // 对于FormData类型，不设置默认Content-Type，让浏览器自动处理boundary
    ...(data instanceof FormData ? {} : {'Content-Type': 'application/json'}),
    ...headers
  };

  // 如果需要token，从localStorage获取并添加到请求头
  if (needToken) {
    const token = getToken();
    if (token) {
      requestHeaders['X-Token'] = token;
    }
  }

  // 创建请求控制器，用于处理超时
  const controller = new AbortController();
  const { signal } = controller;

  // 设置超时处理
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    // 发送请求 - 根据数据类型决定是否需要JSON序列化
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
      signal,
      ...rest
    });

    // 清除超时定时器
    clearTimeout(timeoutId);

    // 处理响应
    const result = await response.json();

    if (processResponse) {
      if (result.code === 0 ) {
        if (options.method?.toLowerCase() !== "get"){
          const successMessage = operationName + '成功';
          message.success(successMessage);
        }
      } else {
        const errorMessage = result.message || '请求失败';
        message.error(errorMessage);
      }
    }


    return result as T;
  } catch (error) {
    // 清除超时定时器
    clearTimeout(timeoutId);

    // 处理网络错误
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`${operationName}超时，请稍后重试`);
    }

    throw error;
  }
};

/**
 * GET请求封装
 */
export const get = <T = any>(url: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<T> => {
  // 构建查询参数
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return request<T>({
    url: fullUrl,
    method: 'GET',
    ...options
  });
};

/**
 * POST请求封装
 */
export const post = <T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT请求封装
 */
export const put = <T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<T> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE请求封装
 */
export const del = <T = any>(url: string, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<T> => {
  return request<T>({
    url,
    method: 'DELETE',
    ...options
  });
};

/**
 * PATCH请求封装
 */
export const patch = <T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<T> => {
  return request<T>({
    url,
    method: 'PATCH',
    data,
    ...options
  });
};

export default request;