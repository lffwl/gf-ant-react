import { post, get, put, del, patch } from '../utils/request';

export interface ArticleCreateReq {
  title: string;
  summary?: string;
  content: string;
  articleType: string;
  externalUrl?: string;
  categoryId: number;
  authorName?: string;
  coverImage?: string;
  status: boolean;
  isTop?: boolean;
  isHot?: boolean;
  isRecommend?: boolean;
  publishAt?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  extra?: string;
}

export interface ArticleUpdateReq extends ArticleCreateReq {
  id: number;
}

export interface ArticleListReq {
  page?: number;
  size?: number;
  title?: string;
  categoryId?: number;
  status?: string;
  articleType?: string;
  isTop?: string;
  isHot?: string;
  isRecommend?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface ArticleListResponse {
  code: number;
  message: string;
  data?: {
    list: any[];
    total: number;
    page: number;
    size: number;
  };
}

export interface ArticleDetailResponse {
  code: number;
  message: string;
  data?: any;
}

export const articleService = {
  // 创建文章
  async createArticle(data: ArticleCreateReq): Promise<ApiResponse> {
    try {
      const processedData = {
        ...data,
        status: Number(data.status),
        isTop: Number(data.isTop),
        isHot: Number(data.isHot),
        isRecommend: Number(data.isRecommend)
      };
      
      return post('/sys/cms/article', processedData, {
        operationName: '文章创建'
      });
    } catch (error) {
      throw error;
    }
  },

  // 获取文章列表
  async getArticleList(params: ArticleListReq): Promise<ArticleListResponse> {
    try {
      return get<ArticleListResponse>('/sys/cms/article', params);
    } catch (error) {
      throw error;
    }
  },

  // 获取文章详情
  async getArticleDetail(id: string): Promise<ArticleDetailResponse> {
    try {
      return get<ArticleDetailResponse>(`/sys/cms/article/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // 更新文章
  async updateArticle(id: string, data: ArticleUpdateReq): Promise<ApiResponse> {
    try {
      const processedData = {
        ...data,
        status: Number(data.status),
        isTop: Number(data.isTop),
        isHot: Number(data.isHot),
        isRecommend: Number(data.isRecommend)
      };
      
      return put(`/sys/cms/article/${id}`, processedData, {
        operationName: '文章更新'
      });
    } catch (error) {
      throw error;
    }
  },

  // 删除文章
  async deleteArticle(id: string): Promise<ApiResponse> {
    try {
      return del(`/sys/cms/article/${id}`, {
        operationName: '文章删除'
      });
    } catch (error) {
      throw error;
    }
  },

  // 更新文章状态
  async updateArticleStatus(id: string, status: boolean): Promise<ApiResponse> {
    try {
      return patch(`/sys/cms/article/${id}/status`, { status: Number(status) }, {
        operationName: '文章状态更新'
      });
    } catch (error) {
      throw error;
    }
  },

  // 更新文章置顶状态
  async updateArticleTopStatus(id: string, isTop: boolean): Promise<ApiResponse> {
    try {
      return patch(`/sys/cms/article/${id}/top`, { isTop: Number(isTop) }, {
        operationName: '文章置顶状态更新'
      });
    } catch (error) {
      throw error;
    }
  },

  // 更新文章热门状态
  async updateArticleHotStatus(id: string, isHot: boolean): Promise<ApiResponse> {
    try {
      return patch(`/sys/cms/article/${id}/hot`, { isHot: Number(isHot) }, {
        operationName: '文章热门状态更新'
      });
    } catch (error) {
      throw error;
    }
  },

  // 更新文章推荐状态
  async updateArticleRecommendStatus(id: string, isRecommend: boolean): Promise<ApiResponse> {
    try {
      return patch(`/sys/cms/article/${id}/recommend`, { isRecommend: Number(isRecommend) }, {
        operationName: '文章推荐状态更新'
      });
    } catch (error) {
      throw error;
    }
  }
};