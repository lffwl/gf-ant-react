import { post, get } from '../utils/request';

// 文件信息接口定义
export interface FileInfo {
  id: number;
  fileName: string;
  fileNameStored: string;
  fileSize: number;
  fileType: string;
  fileExt: string;
  storageType: string;
  storagePath: string;
  bizType: string;
  uploaderId: number;
  md5Hash: string;
  createdAt: string;
  updatedAt: string;
}

// API响应接口定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 文件上传请求参数
export interface UploadFileParams {
  file: File;
  bizType: string;
}

// 文件列表请求参数
export interface FileListParams {
  bizType?: string;
  fileName?: string;
  page?: number;
  pageSize?: number;
}

// 文件列表响应
export interface FileListResponse {
  list: FileInfo[];
  total: number;
}

// 文件上传服务
export const uploadService = {
  /**
   * 上传文件
   * @param params 上传参数
   * @returns 文件信息
   */
  uploadFile: async (params: UploadFileParams): Promise<ApiResponse<FileInfo>> => {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('bizType', params.bizType);
    
    return await post<ApiResponse<FileInfo>>('/sys/upload', formData, {
      operationName: '文件上传'
    });
  },
  
  /**
   * 获取文件列表
   * @param params 查询参数
   * @returns 文件列表和总数
   */
  getFileList: async (params: FileListParams): Promise<ApiResponse<FileListResponse>> => {
    return await get<ApiResponse<FileListResponse>>('/sys/upload/list', params, {
      operationName: '获取文件列表'
    });
  },
  
  /**
   * 获取文件URL
   * @param storagePath 文件存储路径
   * @returns 完整的文件URL
   */
  getFileUrl: (storagePath: string): string => {
    return `/public/upload/${storagePath}`;
  }
};