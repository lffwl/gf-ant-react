import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface RoleCreateReq {
  name: string;
  description?: string;
  dataScope: number;
  sort: number;
  status: boolean;
  apiIds: number[];
}

export interface RoleUpdateReq extends RoleCreateReq {
  id: number;
}

export interface RoleData {
  id: number;
  name: string;
  description: string;
  dataScope: number;
  sort: number;
  status: boolean;
  apiIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleListResponse {
  list: RoleData[];
  total: number;
}

export interface RoleDetailResponse {
  id: number;
  name: string;
  description: string;
  dataScope: number;
  sort: number;
  status: boolean;
  apiIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export const roleService = {
  async createRole(data: RoleCreateReq): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/role/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.code === 0) {
          message.success('角色创建成功');
          return result;
        } else {
          message.error(`创建失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        message.error(`创建失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },

  async updateRole(data: RoleUpdateReq): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/role/update/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.code === 0) {
          message.success('角色更新成功');
          return result;
        } else {
          message.error(`更新失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        message.error(`更新失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },

  async deleteRole(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/role/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.code === 0) {
          message.success('角色删除成功');
          return result;
        } else {
          message.error(`删除失败: ${result.message || response.statusText}`);
          throw new Error(result.message || response.statusText);
        }
      } else {
        const errorData = await response.json();
        message.error(`删除失败: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
      throw error;
    }
  },

  async getRoleList(params: { page: number; size: number; name?: string; status?: boolean }): Promise<ApiResponse<RoleListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('size', params.size.toString());
      if (params.name) queryParams.append('name', params.name);
      if (params.status !== undefined) queryParams.append('status', params.status.toString());

      const response = await fetch(`${API_BASE_URL}/sys/role/list?${queryParams}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result: ApiResponse<RoleListResponse> = await response.json();
        if (result.code === 0) {
          return result;
        } else {
          throw new Error(`获取角色列表失败: ${result.message || response.statusText}`);
        }
      } else {
        throw new Error(`获取角色列表失败: ${response.statusText}`);
      }
    } catch (error) {
      message.error('获取角色列表失败');
      throw error;
    }
  },

  async getRoleDetail(id: number): Promise<ApiResponse<RoleDetailResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/role/detail/${id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result: ApiResponse<RoleDetailResponse> = await response.json();
        if (result.code === 0) {
          return result;
        } else {
          throw new Error(`获取角色详情失败: ${result.message || response.statusText}`);
        }
      } else {
        throw new Error(`获取角色详情失败: ${response.statusText}`);
      }
    } catch (error) {
      message.error('获取角色详情失败');
      throw error;
    }
  }
};