import type { TreeSelectProps } from 'antd/es/tree-select';

/**
 * API数据接口定义
 */
export interface ApiData {
  key: React.Key;
  parentId: number;
  name: string;
  path: string;
  method: string;
  permissionCode: string;
  isMenu: number;
  status: number;
  sort: number;
  description: string;
  children?: ApiData[];
}

/**
 * API创建/更新请求接口定义
 */
export interface ApiRequestData {
  parentId?: number;
  name: string;
  permissionCode: string;
  url: string;
  method: string;
  sort?: number;
  status: number;
  isMenu: number;
  description?: string;
}

/**
 * 将API数据转换为TreeSelect组件需要的格式
 * @param apiData API数据列表
 * @returns TreeSelect组件数据
 */
export const transformToTreeData = (
  apiData: ApiData[]
): TreeSelectProps['treeData'] => {
  return apiData.map(item => ({
    title: item.name,
    value: item.key.toString(), // 转换为字符串以符合TreeSelect的类型要求
    children: item.children ? transformToTreeData(item.children) : undefined
  }));
};

/**
 * 转换后端返回的API数据格式
 * @param backendData 后端返回的原始数据
 * @returns 转换后的前端API数据格式
 */
export const transformApiData = (
  backendData: any[]
): ApiData[] => {
  return backendData.map(item => ({
    key: item.id || item.key,
    parentId: item.parentId || 0,
    name: item.name,
    path: item.url,
    method: item.method,
    permissionCode: item.permissionCode || '',
    isMenu: item.isMenu || 0,
    status: item.status || 1,
    sort: item.sort || 0,
    description: item.description || '',
    children: item.children ? transformApiData(item.children) : undefined
  }));
};

/**
 * 获取所有API节点的key
 * @param apiData API数据列表
 * @returns 所有节点的key数组
 */
export const getAllApiKeys = (
  apiData: ApiData[]
): React.Key[] => {
  let keys: React.Key[] = [];
  apiData.forEach(item => {
    keys.push(item.key);
    if (item.children && item.children.length > 0) {
      keys = keys.concat(getAllApiKeys(item.children));
    }
  });
  return keys;
};

/**
 * 验证HTTP请求方法是否有效
 * @param method HTTP请求方法
 * @returns 验证结果对象，包含isValid状态和message消息
 */
export const validateHttpMethod = (
  method: string
): { isValid: boolean; message: string } => {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
  const isValid = validMethods.includes(method);
  
  return {
    isValid,
    message: isValid ? '' : `请求方法必须是${validMethods.join(', ')}中的一个`
  };
};

/**
 * 格式化请求方法显示样式
 * @param method HTTP请求方法
 * @returns 样式对象
 */
export const getMethodStyle = (
  method: string
): React.CSSProperties => {
  const colorMap: Record<string, string> = {
    'GET': 'green',
    'POST': 'blue',
    'PUT': 'orange',
    'DELETE': 'red'
  };
  return {
    color: colorMap[method] || 'gray'
  };
};

/**
 * 处理API表单提交前的数据转换
 * @param formData 表单数据
 * @returns 处理后的提交数据
 */
export const processApiFormData = (
  formData: ApiRequestData
): ApiRequestData => {
  return {
    ...formData,
    status: Number(formData.status),
    isMenu: Number(formData.isMenu),
    sort: formData.sort || 0
  };
};

/**
 * 根据API状态获取显示文本和样式
 * @param status 状态值
 * @returns 包含文本和样式的对象
 */
export const getStatusDisplay = (
  status: number
): { text: string; style: React.CSSProperties } => {
  if (status === 1) {
    return {
      text: '启用',
      style: { color: 'green' }
    };
  } else {
    return {
      text: '禁用',
      style: { color: 'red' }
    };
  }
};

/**
 * 根据isMenu值获取显示文本
 * @param isMenu 是否为菜单
 * @returns 显示文本
 */
export const getIsMenuDisplay = (
  isMenu: number
): string => {
  return isMenu === 1 ? '是' : '否';
};