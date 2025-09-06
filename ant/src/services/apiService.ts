import { message } from 'antd';

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

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          message.success('API创建成功');
          return result;
        } else {
          console.error('API创建失败详情:', result);
          message.error(`创建失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        console.error('API创建失败详情:', errorData);
        message.error(`创建失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },
  async getApiTree(): Promise<ApiTreeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/api/tree`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          return result;
        } else {
          console.error('获取API树形结构失败详情:', result);
          throw new Error(`获取API树形结构失败: ${result.message || response.statusText}`);
        }
      } else {
        throw new Error(`获取API树形结构失败: ${response.statusText}`);
      }
    } catch (error) {
      message.error('获取API树形结构失败');
      throw error;
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

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          message.success('API更新成功');
          return result;
        } else {
          console.error('API更新失败详情:', result);
          message.error(`更新失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        console.error('API更新失败详情:', errorData);
        message.error(`更新失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },

  async deleteApi(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/api/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          message.success('API删除成功');
          return result;
        } else {
          console.error('API删除失败详情:', result);
          message.error(`删除失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        console.error('API删除失败详情:', errorData);
        message.error(`删除失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  }
};