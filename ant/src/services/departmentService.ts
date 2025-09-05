import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DepartmentCreateReq {
  parentId?: number;
  name: string;
  sort?: number;
  status: number;
}

export interface DepartmentUpdateReq extends DepartmentCreateReq {
  id: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface DepartmentTreeResponse {
  code: number;
  message: string;
  data?: {
    list: any[];
  };
}

export const departmentService = {
  async createDepartment(data: DepartmentCreateReq): Promise<ApiResponse> {
    try {
      const processedData = {
        ...data,
        status: Number(data.status)
      };
      
      console.log('发送到后端的参数:', processedData);
      
      const response = await fetch(`${API_BASE_URL}/sys/department/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          message.success('部门创建成功');
          return result;
        } else {
          console.error('部门创建失败详情:', result);
          message.error(`创建失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        console.error('部门创建失败详情:', errorData);
        message.error(`创建失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },

  async getDepartmentTree(): Promise<DepartmentTreeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/department/tree`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          return result;
        } else {
          console.error('获取部门树形结构失败详情:', result);
          message.error(`获取部门树形结构失败: ${result.message || response.statusText}`);
          throw new Error(`获取部门树形结构失败: ${result.message || response.statusText}`);
        }
      } else {
        throw new Error(`获取部门树形结构失败: ${response.statusText}`);
      }
    } catch (error) {
      message.error('获取部门树形结构失败');
      throw error;
    }
  },

  async updateDepartment(id: string, data: DepartmentCreateReq): Promise<ApiResponse> {
    try {
      const processedData = {
        ...data,
        status: Number(data.status)
      };
      
      console.log('发送到后端的更新参数:', processedData);
      
      const response = await fetch(`${API_BASE_URL}/sys/department/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          message.success('部门更新成功');
          return result;
        } else {
          console.error('部门更新失败详情:', result);
          message.error(`更新失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        console.error('部门更新失败详情:', errorData);
        message.error(`更新失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },

  async deleteDepartment(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/department/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          message.success('部门删除成功');
          return result;
        } else {
          console.error('部门删除失败详情:', result);
          message.error(`删除失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        console.error('部门删除失败详情:', errorData);
        message.error(`删除失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  }
};