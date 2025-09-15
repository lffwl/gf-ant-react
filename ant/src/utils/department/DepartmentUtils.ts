// 部门数据接口定义
export interface DepartmentData {
  key: React.Key;
  parentId: number;
  name: string;
  status: boolean;
  sort: number;
  children?: DepartmentData[];
}

// 转换后端返回的树形结构数据为前端需要的格式
export const transformDepartmentData = (data: any[]): DepartmentData[] => {
  return data.map(item => ({
    key: item.id || item.key,
    parentId: item.parentId || 0,
    name: item.name,
    status: item.status,
    sort: item.sort || 0,
    children: item.children ? transformDepartmentData(item.children) : undefined
  }));
};

// 递归获取所有节点的key，实现N级展开
export const getAllDepartmentKeys = (data: DepartmentData[]): React.Key[] => {
  let keys: React.Key[] = [];
  data.forEach(item => {
    keys.push(item.key);
    if (item.children && item.children.length > 0) {
      keys = keys.concat(getAllDepartmentKeys(item.children));
    }
  });
  return keys;
};

// 转换表单数据为后端需要的格式
export const transformFormData = (values: any): any => {
  return {
    ...values,
    status: values.status ? 1 : 0,
    sort: values.sort !== undefined ? values.sort : 0,
    parentId: values.parentId !== undefined ? values.parentId : 0
  };
};

// 根据ID查找部门
export const findDepartmentById = (data: DepartmentData[], id: React.Key): DepartmentData | undefined => {
  for (const item of data) {
    if (item.key === id) {
      return item;
    }
    if (item.children) {
      const found = findDepartmentById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

// 过滤掉特定ID的部门（用于TreeSelect）
export const filterDepartmentTree = (data: DepartmentData[], excludeId: React.Key): DepartmentData[] => {
  return data.filter(item => item.key !== excludeId).map(item => ({
    ...item,
    children: item.children ? filterDepartmentTree(item.children, excludeId) : undefined
  }));
};