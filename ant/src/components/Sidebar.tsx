import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems, MenuItem } from '../config/menuItems';
import { getUserApiCodes } from '../utils/permission';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 根据apiCodes和hidden属性过滤菜单项
  const filterMenuItemsByPermission = (items: MenuItem[]): MenuItem[] => {
    const apiCodes = getUserApiCodes();
    
    return items
      .filter(item => {
        // 先过滤掉hidden为true的菜单项
        if (item.hidden) {
          return false;
        }
        
        // 如果菜单项没有设置permission，则默认显示
        if (!item.permission) {
          // 如果有子菜单，检查是否有子菜单可以显示
          if (item.children && item.children.length > 0) {
            const hasVisibleChildren = item.children.some(child => 
              !child.hidden && (!child.permission || apiCodes.includes(child.permission))
            );
            return hasVisibleChildren;
          }
          return true;
        }
        
        // 检查用户是否有该菜单项的权限
        const hasPermission = apiCodes.includes(item.permission);
        
        // 如果有子菜单，即使当前菜单项有权限，也要检查是否有子菜单可以显示
        if (hasPermission && item.children && item.children.length > 0) {
          const hasVisibleChildren = item.children.some(child => 
            !child.hidden && (!child.permission || apiCodes.includes(child.permission))
          );
          return hasVisibleChildren;
        }
        
        return hasPermission;
      })
      .map(item => {
        // 深拷贝菜单项并递归过滤子菜单
        const result = { ...item };
        if (item.children && item.children.length > 0) {
          result.children = filterMenuItemsByPermission(item.children);
        }
        return result;
      });
  };

  // 根据apiCodes和hidden属性过滤菜单项
  const filteredMenuItems = filterMenuItemsByPermission(menuItems);

  const processedMenuItems = filteredMenuItems.map(item => ({
    ...item,
    onClick: item.children ? undefined : () => navigate(item.key),
    children: item.children?.map(child => ({
      ...child,
      onClick: () => navigate(child.key),
    })),
  }));

  // 监听路由变化，自动展开父级菜单
  useEffect(() => {
    const currentPath = location.pathname;
    // 查找当前路径对应的父级菜单key
    const parentKey = menuItems.find(item => 
      item.children?.some(child => child.key === currentPath)
    )?.key;
    
    if (parentKey) {
      setOpenKeys([parentKey]);
    }
  }, [location.pathname]);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        items={processedMenuItems}
      />
    </Sider>
  );
};

export default Sidebar;