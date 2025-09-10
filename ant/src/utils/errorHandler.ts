import { message } from 'antd';

/**
 * 处理API请求中的网络错误
 * @param error 错误对象
 * @param operationName 操作名称（如"创建用户"、"获取角色列表"等）
 * @returns 抛出包含详细错误信息的Error对象
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
 * @param successMessage 成功时显示的消息
 * @param errorMessagePrefix 错误消息前缀
 * @returns 如果成功，返回API响应结果；如果失败，抛出错误
 */
export const handleApiResponse = <T>(result: { code: number; message: string; data?: T }): T => {
  if (result.code === 0) {
    if (result.message) {
      message.success(result.message);
    }
    if (result.data === undefined) {
      throw new Error('API返回成功但数据为空');
    }
    return result.data;
  } else {
    console.error('API业务错误:', result);
    const errorMessage = result.message || '未知错误';
    message.error(errorMessage);
    throw new Error(errorMessage);
  }
};