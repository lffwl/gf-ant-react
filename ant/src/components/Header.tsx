import React from 'react';
import { Layout, Button, Breadcrumb, Avatar, Dropdown, Space, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { menuItems } from '../config/menuItems';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onResetPassword: () => void;
  onLogout: () => void;
  userInfo: { username: string };
  userRoles: any[];
  location: any;
}

const HeaderContent: React.FC<HeaderProps> = ({
  collapsed,
  onCollapsedChange,
  onResetPassword,
  onLogout,
  userInfo,
  userRoles,
  location
}) => {
  const themeData = theme.useToken();
  const { colorBgContainer } = themeData.token;

  // 获取下拉菜单选项
  const getMenuItems = (): Array<{ key: string; label: string; onClick?: () => void; disabled?: boolean } | { type: 'divider' }> => {
    if (userRoles.length > 0) {
      return [
        ...userRoles.map((role: any) => ({
          key: role.id,
          label: role.name
        })),
        {
          type: 'divider'
        },
        {
          key: 'reset-password',
          label: '重置密码',
          onClick: onResetPassword
        },
        {
          type: 'divider'
        },
        {
          key: 'logout',
          label: '退出登录',
          onClick: onLogout
        }
      ];
    } else {
      return [
        {
          key: 'no-role',
          label: '无角色信息',
          disabled: true
        },
        {
          type: 'divider'
        },
        {
          key: 'reset-password',
          label: '重置密码',
          onClick: onResetPassword
        },
        {
          type: 'divider'
        },
        {
          key: 'logout',
          label: '退出登录',
          onClick: onLogout
        }
      ];
    }
  };

  // 根据当前路由生成面包屑数据
  const generateBreadcrumbItems = () => {
    const currentPath = location.pathname;
    const items = [{ title: '首页' }];
    
    // 查找当前路由对应的菜单项
    const currentMenuItem = menuItems.find(item => item.key === currentPath) || 
                          menuItems.flatMap(item => item.children || []).find(child => child.key === currentPath);
    
    if (currentMenuItem) {
      // 如果是子菜单，先添加父级菜单
      const parentMenu = menuItems.find(item => 
        item.children?.some(child => child.key === currentPath)
      );
      
      if (parentMenu) {
        items.push({ title: parentMenu.label });
      }
      
      items.push({ title: currentMenuItem.label });
    } else {
      // 如果没有找到匹配的菜单项，显示默认页面名称
      items.push({ title: '页面' });
    }
    
    return items;
  };

  return (
    <Header 
      style={{ 
        padding: '0 16px', 
        background: colorBgContainer, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapsedChange(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Breadcrumb 
          style={{ marginLeft: 16 }}
          items={generateBreadcrumbItems()}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
          title="刷新页面"
          style={{
            fontSize: '16px',
            width: 100,
            height: 64,
          }}
        >刷新</Button>

        {/* 用户名显示和角色列表悬停 */}
        <Dropdown
          placement="bottomRight"
          menu={{
            items: getMenuItems()
          }}
        >
          <Space
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Avatar icon={<UserOutlined />} />
            <span>{userInfo.username}</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderContent;