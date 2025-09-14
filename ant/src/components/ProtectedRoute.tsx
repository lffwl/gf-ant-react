import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';
import { menuItems } from '../config/menuItems';
import { hasPermission } from '../utils/permission';

interface ProtectedRouteProps {
  element: React.ReactNode;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, path }) => {
  // 检查用户是否有特定路径的访问权限
  const checkPermission = (path: string): boolean => {
    
    // 查找当前路径对应的菜单项
    const menuItem = menuItems.find(item => item.key === path) || 
                    menuItems.flatMap(item => item.children || []).find(child => child.key === path);
    
    // 如果没有找到菜单项或者菜单项没有设置permission，则默认允许访问
    if (!menuItem || !menuItem.permission) {
      return true;
    }
    
    // 检查用户是否有该菜单项的权限
    return hasPermission(menuItem.permission);
  };

  const hasAccessPermission = checkPermission(path);
  
  if (!hasAccessPermission) {
    // 显示无权限提示
    message.error('您没有权限访问该页面');
    // 重定向到首页
    return <Navigate to="/" replace />;
  }
  
  return element;
};

export default ProtectedRoute;