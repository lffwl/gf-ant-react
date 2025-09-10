import { handleNetworkError, handleApiResponse } from '../utils/errorHandler';

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
  apiCount: number;
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
  apiCount: number;
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

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, '角色创建');
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

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, '角色更新');
    }
  },

  async deleteRole(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/role/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, '角色删除');
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

      const result = await response.json();
      // 列表接口不需要使用handleApiResponse
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取角色列表失败');
      }
    } catch (error) {
      return handleNetworkError(error, '获取角色列表');
    }
  },

  async getRoleDetail(id: number): Promise<ApiResponse<RoleDetailResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/role/detail/${id}`, {
        method: 'GET',
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, '获取角色详情');
    }
  }
};