import { get, post, put, del } from '../utils/request';

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
      const result = await post<ApiResponse>(
        '/sys/role/create',
        data,
        {
          operationName: '角色创建'
        }
      );
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateRole(data: RoleUpdateReq): Promise<ApiResponse> {
    try {
      const result = await put<ApiResponse>(
        `/sys/role/update/${data.id}`,
        data,
        {
          operationName: '角色更新'
        }
      );
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteRole(id: number): Promise<ApiResponse> {
    try {
      const result = await del<ApiResponse>(
        `/sys/role/delete/${id}`,
        {
          operationName: '角色删除'
        }
      );
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getRoleList(params: { page: number; size: number; name?: string; status?: boolean }): Promise<ApiResponse<RoleListResponse>> {
    try {
      const result = await get<ApiResponse<RoleListResponse>>(
        '/sys/role/list',
        params,
        {
          operationName: '获取角色列表'
        }
      );
      
      // 列表接口不需要使用handleApiResponse
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取角色列表失败');
      }
    } catch (error) {
      throw error;
    }
  },

  async getRoleDetail(id: number): Promise<ApiResponse<RoleDetailResponse>> {
    try {
      const result = await get<ApiResponse<RoleDetailResponse>>(
        `/sys/role/detail/${id}`,
        {},
        {
          operationName: '获取角色详情'
        }
      );
      
      return result;
    } catch (error) {
      throw error;
    }
  }
};