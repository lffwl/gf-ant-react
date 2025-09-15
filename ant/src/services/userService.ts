import { post, get, put, del, RequestOptions } from '../utils/request';

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
  async createUser(data: UserCreateReq, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse> {
    try {
      const result = await post<ApiResponse>(
        '/sys/user/create',
        data,
        {
          operationName: '用户创建',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(data: UserUpdateReq, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse> {
    try {
      const result = await put<ApiResponse>(
        `/sys/user/update/${data.id}`,
        data,
        {
          operationName: '用户更新',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: number, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<ApiResponse> {
    try {
      const result = await del<ApiResponse>(
        `/sys/user/delete/${id}`,
        {
          operationName: '用户删除',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getUserList(params: { page: number; size: number; username?: string; departmentId?: number; status?: number }, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse<UserListResponse>> {
    try {
      const result = await get<ApiResponse<UserListResponse>>(
        '/sys/user/list',
        params,
        {
          operationName: '获取用户列表',
          ...options
        }
      );

      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取用户列表失败');
      }
    } catch (error) {
      throw error;
    }
  },

  async getUserDetail(id: number, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const result = await get<ApiResponse<UserDetailResponse>>(
        `/sys/user/detail/${id}`,
        {},
        {
          operationName: '获取用户详情',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateUserPassword(id: number, data: UserUpdatePasswordReq, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<ApiResponse> {
    try {
      const result = await put<ApiResponse>(
        `/sys/user/update-password/${id}`,
        data,
        {
          operationName: '密码修改',
          ...options
        }
      );

      
      return result;
    } catch (error) {
      throw error;
    }
  }
};