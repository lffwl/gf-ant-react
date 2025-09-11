import { message } from 'antd';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 全局请求后置拦截器
 * 用于处理所有API请求的响应，可在此处添加统一的响应处理逻辑
 * @param result API响应结果
 * @param responseType 响应类型（用于区分不同类型的请求）
 */
export const postInterceptor = (result: ApiResponse<any>, responseType: string = 'default'): void => {
  console.log(`[后置拦截器] 处理${responseType}类型请求响应:`, result);
  
  // 这里可以添加各种全局的响应处理逻辑
  // 例如：
  // 1. 统一处理特定的错误码
  // 2. 记录请求日志
  // 3. 收集统计信息
  
  // 1. 处理Token过期情况（示例）
  if (result.code === 401) {
    // Token已过期，清除本地存储并重定向到登录页
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('expireTime');
    
    // 提示用户登录已过期
    message.error(result.message || '登录已过期，请重新登录');
    
    // 重定向到登录页
    // 注意：由于这个函数可能在非React组件环境中调用，这里使用try-catch来安全处理
    try {
      // 在React组件中使用时，可以通过参数传入navigate实例
      // 这里为了通用性，使用window.location.href进行跳转
      window.location.href = '/login';
    } catch (error) {
      console.error('重定向到登录页失败:', error);
    }
  }
  
  // 2. 处理服务器维护通知（示例）
  if (result.code === 503) {
    message.warning(result.message || '系统维护中，请稍后再试');
  }
  
  // 3. 处理业务逻辑错误（可以根据需要添加更多错误码的处理）
  if (result.code >= 1000 && result.code < 2000) {
    console.warn('[业务逻辑错误]', result.code, result.message);
    // 这里可以添加特定的业务逻辑错误处理
  }
};

/**
 * 处理API请求中的网络错误
 * @param error 错误对象
 * @param operationN    return result.data;turns 抛出包含详细错误信息的Error对象
 */
export const handleNetworkError = (error: any, operationName: string): never => {
  console.error(`${operationName}时发生网络错误:`, error);

  // 根据不同的错误类型提供更具体的错误信息
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    message.error('网络连接失败，请检查网络连接或后端服务是否启动');
  } else if (error.name === 'AbortError') {
    message.error('请求已被取消');
  } else if (error.code === 'ECONNREFUSED') {
    message.error('无法连接到服务器，请检查后端服务是否启动');
  } else if (error.code === 'ETIMEDOUT') {
    message.error('请求超时，请稍后重试');
  } else {
    message.error(`网络错误，请检查后端服务是否启动`);
  }

  throw new Error(`${operationName}失败: ${error.message || '未知错误'}`);
};

/**
 * 处理API响应中的业务错误
 * @param result API响应结果
 * @param responseType 响应类型（用于区分不同类型的请求）
 * @returns 如果成功，返回API响应结果；如果失败，抛出错误
 */
export const handleApiResponse = <T>(result: ApiResponse<T>): T => {
  console.log('API响应:', result);

  
  if (result.code === 0) {
    const successMessage = result.message || '请求成功';
    message.success(successMessage);
  } else {
    const errorMessage = result.message || '未知错误';
    message.error(errorMessage);
    
    // 对于非成功的响应，可以选择抛出错误
    // 这样调用方可以在catch块中处理这些错误
    // throw new Error(errorMessage);
  }

  return result as T;
};