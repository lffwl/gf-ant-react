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
      
      const response = await fetch(`${API_BASE_URL}/sys/department/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();
      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getDepartmentTree(): Promise<DepartmentTreeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/department/tree`, {
        method: 'GET',
      });

      const result = await response.json();
      // 列表接口不需要使用handleApiResponse
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取部门树形结构失败');
      }
    } catch (error) {
      throw error;
    }
  },

  async getDepartmentList(params: { page: number; size: number; name?: string; status?: number }): Promise<ApiResponse<DepartmentListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('size', params.size.toString());
      if (params.name) queryParams.append('name', params.name);
      if (params.status !== undefined) queryParams.append('status', params.status.toString());

      const response = await fetch(`${API_BASE_URL}/sys/department/list?${queryParams}`, {
        method: 'GET',
      });

      const result = await response.json();
      // 列表接口不需要使用handleApiResponse
      if (result.code === 0) {
        return result;
      } else {
        throw new Error(result.message || '获取部门列表失败');
      }
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
      
      const response = await fetch(`${API_BASE_URL}/sys/department/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();
      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteDepartment(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sys/department/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      // 直接返回结果，不再使用handleApiResponse自动显示成功提示
      return result;
    } catch (error) {
      throw error;
    }
  }
};