import { post, get, put, del } from '../utils/request';

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

export interface DepartmentListResponse {
  list: any[];
  total: number;
}

export const departmentService = {
  async createDepartment(data: DepartmentCreateReq): Promise<ApiResponse> {
    try {
      const processedData = {
        ...data,
        status: Number(data.status)
      };
      
      console.log('发送到后端的参数:', processedData);
      
      return post('/sys/department/create', processedData, {
        operationName: '部门创建'
      });
    } catch (error) {
      throw error;
    }
  },
  
  // 获取部门详情
  async getDepartmentDetail(id: string): Promise<ApiResponse> {
    try {
      return get<ApiResponse>(`/sys/department/detail/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async getDepartmentTree(): Promise<DepartmentTreeResponse> {
    try {
      return get<DepartmentTreeResponse>('/sys/department/tree');
    } catch (error) {
      throw error;
    }
  },

  async getDepartmentList(params: { page: number; size: number; name?: string; status?: number }): Promise<ApiResponse<DepartmentListResponse>> {
    try {
      return get<ApiResponse<DepartmentListResponse>>('/sys/department/list', params);
    } catch (error) {
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
      
      return put(`/sys/department/update/${id}`, processedData, {
        operationName: '部门更新'
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteDepartment(id: string): Promise<ApiResponse> {
    try {
      return del(`/sys/department/delete/${id}`, {
        operationName: '部门删除'
      });
    } catch (error) {
      throw error;
    }
  }
};