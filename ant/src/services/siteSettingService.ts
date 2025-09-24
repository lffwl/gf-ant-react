import { post, get, put, del } from '../utils/request';

export interface SiteSettingCreateReq {
  settingKey: string;
  settingValue: string;
  valueType: string;
  group: string;
  description: string;
}

export interface SiteSettingUpdateReq extends SiteSettingCreateReq {
  id: number;
}

export interface SiteSettingListReq {
  page?: number;
  size?: number;
  group?: string;
  key?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface SiteSettingListResponse {
  code: number;
  message: string;
  data?: {
    list: any[];
    total: number;
    page: number;
    size: number;
  };
}

export interface SiteSettingDetailResponse {
  code: number;
  message: string;
  data?: any;
}

export const siteSettingService = {
  // 创建网站设置
  async createSiteSetting(data: SiteSettingCreateReq): Promise<ApiResponse> {
    try {
      return post('/sys/cms/site-setting', data, {
        operationName: '网站设置创建'
      });
    } catch (error) {
      throw error;
    }
  },

  // 获取网站设置列表
  async getSiteSettingList(params: SiteSettingListReq): Promise<SiteSettingListResponse> {
    try {
      return get<SiteSettingListResponse>('/sys/cms/site-setting/list', params);
    } catch (error) {
      throw error;
    }
  },

  // 获取网站设置详情
  async getSiteSettingDetail(id: string): Promise<SiteSettingDetailResponse> {
    try {
      const response = await get<SiteSettingDetailResponse>(`/sys/cms/site-setting/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 更新网站设置
  async updateSiteSetting(id: string, data: SiteSettingUpdateReq): Promise<ApiResponse> {
    try {
      return put(`/sys/cms/site-setting/${id}`, data, {
        operationName: '网站设置更新'
      });
    } catch (error) {
      throw error;
    }
  },

  // 删除网站设置
  async deleteSiteSetting(id: string): Promise<ApiResponse> {
    try {
      return del(`/sys/cms/site-setting/${id}`, {
        operationName: '网站设置删除'
      });
    } catch (error) {
      throw error;
    }
  }
};