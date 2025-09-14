// 清除所有缓存
export const clearAllCache = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('expireTime');
  localStorage.removeItem('refreshTime');
  localStorage.removeItem('apiCodes');
  localStorage.removeItem('roles');
};

// 获取用户信息
export const getUserInfo = (): { username: string } => {
  try {
    const userStr = localStorage.getItem('user') || '{}';
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('解析用户信息失败:', error);
  }
  return {
    username: '未登录',
  };
};

// 获取角色信息
export const getRoleInfo = (): any[] => {
  try {
    const roleStr = localStorage.getItem('roles') || '[]';
    const roles = JSON.parse(roleStr);
    return roles;
  } catch (error) {
    console.error('解析角色信息失败:', error);
  }
  return [];
};

// 从menuItems中提取所有带有component的菜单项
export const extractRouteItems = (items: any[]): Array<any> => {
  const routeItems: Array<any> = [];
  
  const traverse = (menuItems: any[]) => {
    menuItems.forEach(item => {
      // 只添加有component属性的菜单项
      if (item.component) {
        routeItems.push(item);
      }
      
      // 递归处理子菜单
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };
  
  traverse(items);
  return routeItems;
};