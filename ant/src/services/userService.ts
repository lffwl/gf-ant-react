import { post, get, put, del } from '../utils/request';

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
      const result = await post<ApiResponse>(
        '/sys/user/create',
        data,
        {
          operationName: '用户创建',
          processResponse: false
        }
      );

      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(data: UserUpdateReq): Promise<ApiResponse> {
    try {
      const result = await put<ApiResponse>(
        `/sys/user/update/${data.id}`,
        data,
        {
          operationName: '用户更新',
          processResponse: false
        }
      );

      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      const result = await del<ApiResponse>(
        `/sys/user/delete/${id}`,
        {
          operationName: '用户删除',
          processResponse: false
        }
      );

      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getUserList(params: { page: number; size: number; username?: string; departmentId?: number; status?: number }): Promise<ApiResponse<UserListResponse>> {
    try {
      const result = await get<ApiResponse<UserListResponse>>(
        '/sys/user/list',
        params,
        {
          operationName: '获取用户列表',
          processResponse: false
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

  async getUserDetail(id: number): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const result = await get<ApiResponse<UserDetailResponse>>(
        `/sys/user/detail/${id}`,
        {},
        {
          operationName: '获取用户详情',
          processResponse: false
        }
      );

      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateUserPassword(id: number, data: UserUpdatePasswordReq): Promise<ApiResponse> {
    try {
      const result = await put<ApiResponse>(
        `/sys/user/update-password/${id}`,
        data,
        {
          operationName: '密码修改',
          processResponse: false
        }
      );

      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  }
};