// 分类数据接口定义
export interface CategoryData {
  key: React.Key;
  parentId: number;
  name: string;
  slug: string;
  description: string;
  cType: string;
  linkUrl: string;
  isNav: boolean;
  sortOrder: number;
  status: boolean;
  coverImage: string;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  extra: string;
  children?: CategoryData[];
}

// 根据parentId构建树形结构
export const buildTreeFromParentId = (flatData: any[]): CategoryData[] => {
  const map: Record<string, CategoryData> = {};
  const roots: CategoryData[] = [];
  
  // 首先创建所有节点并放入映射中
  flatData.forEach(item => {
    const node: CategoryData = {
      key: item.id || item.key,
      parentId: item.parentId || 0,
      name: item.name,
      slug: item.slug || '',
      description: item.description || '',
      cType: item.cType || '',
      linkUrl: item.linkUrl || '',
      isNav: item.isNav ? true : false,
      sortOrder: item.sortOrder || 0,
      status: item.status ? true : false,
      coverImage: item.coverImage || '',
      seoTitle: item.seoTitle || '',
      seoKeywords: item.seoKeywords || '',
      seoDescription: item.seoDescription || '',
      extra: item.extra || '',
      children: []
    };
    map[node.key.toString()] = node;
  });
  
  // 构建树形结构
  Object.values(map).forEach(node => {
    const parentKey = node.parentId.toString();
    if (parentKey !== '0' && map[parentKey]) {
      // 如果有父节点且父节点存在，则添加到父节点的children中
      if (!map[parentKey].children) {
        map[parentKey].children = [];
      }
      map[parentKey].children.push(node);
    } else {
      // 否则是根节点
      roots.push(node);
    }
  });
  
  return roots;
};

// 转换后端返回的树形结构数据为前端需要的格式
export const transformCategoryData = (data: any[]): CategoryData[] => {
  // 检查数据是否已经是树形结构（是否有children属性）
  if (data && data.length > 0 && data[0].children) {
    // 如果已经是树形结构，直接转换
    return data.map(item => ({
      key: item.id || item.key,
      parentId: item.parentId || 0,
      name: item.name,
      slug: item.slug || '',
      description: item.description || '',
      cType: item.cType || '',
      linkUrl: item.linkUrl || '',
      isNav: item.isNav ? true : false,
      sortOrder: item.sortOrder || 0,
      status: item.status ? true : false,
      coverImage: item.coverImage || '',
      seoTitle: item.seoTitle || '',
      seoKeywords: item.seoKeywords || '',
      seoDescription: item.seoDescription || '',
      extra: item.extra || '',
      children: item.children ? transformCategoryData(item.children) : undefined
    }));
  } else {
    // 否则根据parentId构建树形结构
    return buildTreeFromParentId(data);
  }
};

// 递归获取所有节点的key，实现N级展开
export const getAllCategoryKeys = (data: CategoryData[]): React.Key[] => {
  let keys: React.Key[] = [];
  data.forEach(item => {
    keys.push(item.key);
    if (item.children && item.children.length > 0) {
      keys = keys.concat(getAllCategoryKeys(item.children));
    }
  });
  return keys;
};

// 转换表单数据为后端需要的格式
export const transformFormData = (values: any): any => {
  return {
    ...values,
    status: values.status ? 1 : 0,
    isNav: values.isNav ? 1 : 0,
    parentId: values.parentId !== undefined ? values.parentId : 0,
    sortOrder: values.sortOrder !== undefined ? values.sortOrder : 0,
    linkUrl: values.linkUrl || ''
  };
};

// 根据ID查找分类
export const findCategoryById = (data: CategoryData[], id: React.Key): CategoryData | undefined => {
  for (const item of data) {
    if (item.key === id) {
      return item;
    }
    if (item.children) {
      const found = findCategoryById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

// 过滤掉特定ID的分类（用于TreeSelect）
export const filterCategoryTree = (data: CategoryData[], excludeId: React.Key): CategoryData[] => {
  return data.filter(item => item.key !== excludeId).map(item => ({
    ...item,
    children: item.children ? filterCategoryTree(item.children, excludeId) : undefined
  }));
};