import { post, get, put, del } from '../utils/request';

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

import { RequestOptions } from '../utils/request';

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
  async createApi(data: SysApiCreateReq, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse> {
    try {
      // 确保status和isMenu字段是数字0或1
      const processedData = {
        ...data,
        status: Number(data.status),
        isMenu: Number(data.isMenu)
      };
      
      console.log('发送到后端的参数:', processedData);
      
      const result = await post<ApiResponse>(
        '/sys/api/create',
        processedData,
        {
          operationName: 'API创建',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getApiTree(options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiTreeResponse> {
    try {
      const result = await get<ApiTreeResponse>(
        '/sys/api/tree',
        {},
        {
          operationName: '获取API树形结构',
          ...options
        }
      );

      // 列表接口不需要使用handleApiResponse
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取API树形结构失败');
      }
    } catch (error) {
      throw error;
    }
  },

  async updateApi(id: string, data: SysApiCreateReq, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse> {
    try {
      // 确保status和isMenu字段是数字0或1
      const processedData = {
        ...data,
        status: Number(data.status),
        isMenu: Number(data.isMenu)
      };
      
      console.log('发送到后端的更新参数:', processedData);
      
      const result = await put<ApiResponse>(
        `/sys/api/update/${id}`,
        processedData,
        {
          operationName: 'API更新',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteApi(id: string): Promise<ApiResponse> {
    try {
      const result = await del<ApiResponse>(
        `/sys/api/delete/${id}`,
        {
          operationName: 'API删除'
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  }
};