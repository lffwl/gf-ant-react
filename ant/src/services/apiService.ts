import { handleNetworkError, handleApiResponse } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SysApiCreateReq {
  parentId?: number;
  name: string;
  permissionCode: string;
  url: string;
  method: string;
  sort?: number;
  status: number;
  isMenu: number;
  description?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface ApiTreeResponse {
  code: number;
  message: string;
  data?: {
    list: any[];
  };
}

export const apiService = {
  async createApi(data: SysApiCreateReq): Promise<ApiResponse> {
    try {
      // 确保status和isMenu字段是数字0或1
      const processedData = {
        ...data,
        status: Number(data.status),
        isMenu: Number(data.isMenu)
      };
      
      console.log('发送到后端的参数:', processedData);
      
      const response = await fetch(`${API_BASE_URL}/sys/api/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, 'API创建');
    }
  },
  async getApiTree(): Promise<ApiTreeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/api/tree`, {
        method: 'GET',
      });

      const result = await response.json();
      // 列表接口不需要使用handleApiResponse
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取API树形结构失败');
      }
    } catch (error) {
      return handleNetworkError(error, '获取API树形结构');
    }
  },

  async updateApi(id: string, data: SysApiCreateReq): Promise<ApiResponse> {
    try {
      // 确保status和isMenu字段是数字0或1
      const processedData = {
        ...data,
        status: Number(data.status),
        isMenu: Number(data.isMenu)
      };
      
      console.log('发送到后端的更新参数:', processedData);
      
      const response = await fetch(`${API_BASE_URL}/sys/api/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, 'API更新');
    }
  },

  async deleteApi(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/api/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, 'API删除');
    }
  }
};