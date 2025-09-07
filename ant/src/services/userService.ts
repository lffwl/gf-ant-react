import { message } from 'antd';

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

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.code === 0) {
          message.success('用户创建成功');
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

  async updateUser(data: UserUpdateReq): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/update/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.code === 0) {
          message.success('用户更新成功');
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

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.code === 0) {
          message.success('用户删除成功');
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

      if (response.ok) {
        const result: ApiResponse<UserListResponse> = await response.json();
        if (result.code === 0) {
          return result;
        } else {
          throw new Error(`获取用户列表失败: ${result.message || response.statusText}`);
        }
      } else {
        throw new Error(`获取用户列表失败: ${response.statusText}`);
      }
    } catch (error) {
      message.error('获取用户列表失败');
      throw error;
    }
  },

  async getUserDetail(id: number): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/user/detail/${id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result: ApiResponse<UserDetailResponse> = await response.json();
        if (result.code === 0) {
          return result;
        } else {
          throw new Error(`获取用户详情失败: ${result.message || response.statusText}`);
        }
      } else {
        throw new Error(`获取用户详情失败: ${response.statusText}`);
      }
    } catch (error) {
      message.error('获取用户详情失败');
      throw error;
    }
  }
};