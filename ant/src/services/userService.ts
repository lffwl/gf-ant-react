import { handleNetworkError, handleApiResponse } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserCreateReq {
  username: string;
  passwordHash: string;
  email: string;
  mobile?: string;
  departmentId: number;
  status: number;
  roleIds: number[];
}

export interface UserUpdateReq extends UserCreateReq {
  id: number;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  mobile: string;
  departmentId: number;
  status: number;
  roleIds: number[];
  createdAt: string;
  updatedAt: string;
  departmentName?: string;
  roleNames?: string[];
}

export interface UserListResponse {
  list: UserData[];
  total: number;
  roleList: any[];
  departmentList: any[];
}

export interface UserDetailResponse {
  id: number;
  username: string;
  email: string;
  mobile: string;
  departmentId: number;
  status: number;
  roleIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface UserUpdatePasswordReq {
  password: string;
}

export const userService = {
  async createUser(data: UserCreateReq): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/create`, {
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
      return handleNetworkError(error, '用户创建');
    }
  },

  async updateUser(data: UserUpdateReq): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/update/${data.id}`, {
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
      return handleNetworkError(error, '用户更新');
    }
  },

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, '用户删除');
    }
  },

  async getUserList(params: { page: number; size: number; username?: string; departmentId?: number; status?: number }): Promise<ApiResponse<UserListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('size', params.size.toString());
      if (params.username) queryParams.append('username', params.username);
      if (params.departmentId) queryParams.append('departmentId', params.departmentId.toString());
      if (params.status !== undefined) queryParams.append('status', params.status.toString());

      const response = await fetch(`${API_BASE_URL}/sys/user/list?${queryParams}`, {
        method: 'GET',
      });

      const result = await response.json();
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取用户列表失败');
      }
    } catch (error) {
      return handleNetworkError(error, '获取用户列表');
    }
  },

  async getUserDetail(id: number): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/detail/${id}`, {
        method: 'GET',
      });

      const result = await response.json();
      // 使用handleApiResponse处理API响应，会自动显示成功提示并返回数据
      handleApiResponse(result);
      return result;
    } catch (error) {
      return handleNetworkError(error, '获取用户详情');
    }
  },

  async updateUserPassword(id: number, data: UserUpdatePasswordReq): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/update-password/${id}`, {
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
      return handleNetworkError(error, '密码修改');
    }
  }
};