import { post, get, put, del } from '../utils/request';

export interface CategoryCreateReq {
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  cType: string;
  isNav?: boolean;
  sortOrder?: number;
  status: boolean;
  coverImage?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  extra?: string;
}

export interface CategoryUpdateReq extends CategoryCreateReq {
  id: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface CategoryTreeResponse {
  code: number;
  message: string;
  data?: {
    list: any[];
  };
}

export interface CategoryDetailResponse {
  code: number;
  message: string;
  data?: any;
}

export const categoryService = {
  async createCategory(data: CategoryCreateReq): Promise<ApiResponse> {
    try {
      // 后端API期望的字段名就是cType
      const processedData = {
        ...data,
        status: Number(data.status),
        isNav: Number(data.isNav),
        parentId: data.parentId !== undefined ? data.parentId : 0,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : 0
      };
      
      console.log('发送到后端的参数:', processedData);
      
      return post('/sys/cms/category', processedData, {
        operationName: '分类创建'
      });
    } catch (error) {
      throw error;
    }
  },
  
  // 获取分类详情
  async getCategoryDetail(id: string): Promise<CategoryDetailResponse> {
    try {
      return get<CategoryDetailResponse>(`/sys/cms/category/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async getCategoryTree(): Promise<CategoryTreeResponse> {
    try {
      return get<CategoryTreeResponse>('/sys/cms/category/tree');
    } catch (error) {
      throw error;
    }
  },

  async updateCategory(id: string, data: CategoryCreateReq): Promise<ApiResponse> {
    try {
      // 后端API期望的字段名就是cType
      const processedData = {
        ...data,
        status: Number(data.status),
        isNav: Number(data.isNav),
        parentId: data.parentId !== undefined ? data.parentId : 0,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : 0
      };
      
      console.log('发送到后端的更新参数:', processedData);
      
      return put(`/sys/cms/category/${id}`, processedData, {
        operationName: '分类更新'
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<ApiResponse> {
    try {
      return del(`/sys/cms/category/${id}`, {
        operationName: '分类删除'
      });
    } catch (error) {
      throw error;
    }
  }
};