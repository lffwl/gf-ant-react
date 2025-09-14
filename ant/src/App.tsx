import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Breadcrumb, message, Avatar, Dropdown, Space, Modal, Input, Form } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { menuItems, MenuItem } from './config/menuItems';
import { getUserApiCodes, hasPermission } from './utils/permission.tsx';
import { authService } from './services/authService';
import 'antd/dist/reset.css'

const { Header, Sider, Content } = Layout;

// 从menuItems中提取所有带有component的菜单项
const extractRouteItems = (items: MenuItem[]): Array<MenuItem & { component: React.ComponentType }> => {
  const routeItems: Array<MenuItem & { component: React.ComponentType }> = [];
  
  const traverse = (menuItems: MenuItem[]) => {
    menuItems.forEach(item => {
      // 只添加有component属性的菜单项
      if (item.component) {
        routeItems.push(item as MenuItem & { component: React.ComponentType });
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


const LayoutContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const themeData = theme.useToken();
  const { colorBgContainer } = themeData.token;
  const [resetPasswordForm] = Form.useForm();
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);

  // 清除所有缓存
  const clearAllCache = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expireTime');
    localStorage.removeItem('refreshTime');
    localStorage.removeItem('apiCodes');
    localStorage.removeItem('roles');
  };

  // 处理退出登录
  const handleLogout = () => {
    clearAllCache();
    navigate('/auth/login');
  };

  // 处理重置密码
  const handleResetPassword = () => {
    setIsResetPasswordModalVisible(true);
  };

  // 获取下拉菜单选项
  const getMenuItems = () => {
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
          onClick: handleResetPassword
        },
        {
          type: 'divider'
        },
        {
          key: 'logout',
          label: '退出登录',
          onClick: handleLogout
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
          onClick: handleResetPassword
        },
        {
          type: 'divider'
        },
        {
          key: 'logout',
          label: '退出登录',
          onClick: handleLogout
        }
      ];
    }
  };

  // 获取用户信息
  const getUserInfo = () => {
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

  const userInfo = getUserInfo();

  // 获取角色信息
  const getRoleInfo = () => {
    try {
      const roleStr = localStorage.getItem('roles') || '[]';
      const roles = JSON.parse(roleStr);
      return roles;
    } catch (error) {
      console.error('解析角色信息失败:', error);
    }
    return [];
  };

  const userRoles = getRoleInfo();
  
  // 全局认证检查
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expireTimeStr = localStorage.getItem('expireTime');
    
    // 如果不存在token，直接重定向到登录页面
    if (!token) {
      // 清除所有缓存
      clearAllCache();
      navigate('/auth/login');
      return;
    }
    
    // 如果存在token，检查是否过期
    if (expireTimeStr) {
      try {
        // 解析ISO 8601格式的时间字符串
        const expireTimeDate = new Date(expireTimeStr);
        const currentTime = new Date();
        
        // 检查token是否过期
        if (currentTime >= expireTimeDate) {
          // token已过期，清除所有缓存并重定向到登录页面
          clearAllCache();
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('解析过期时间失败:', error);
        // 解析失败时，也清除缓存并重定向到登录页面
        clearAllCache();
        navigate('/auth/login');
      }
    }
  }, [navigate]);

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

  // 创建受保护的路由组件
  const ProtectedRoute: React.FC<{ element: React.ReactNode; path: string }> = ({ element, path }) => {
    const hasPermission = checkPermission(path);
    
    if (!hasPermission) {
      // 显示无权限提示
      message.error('您没有权限访问该页面');
      // 可以选择重定向到某个页面，比如首页
      return <Navigate to="/" replace />;
    }
    
    return element;
  };

  const processedMenuItems = filteredMenuItems.map(item => ({
    ...item,
    onClick: item.children ? undefined : () => navigate(item.key),
    children: item.children?.map(child => ({
      ...child,
      onClick: () => navigate(child.key),
    })),
  }));

  // 生成路由配置，但排除登录页面
  const routeItems = extractRouteItems(menuItems).filter(item => item.key !== '/auth/login');

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
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
      
        <Content
          style={{
            margin: '0 10px',
            minHeight: 280,
          }}
        >
          <Routes>
            {routeItems.map(item => (
              <Route 
                key={item.key} 
                path={item.key} 
                element={
                  <ProtectedRoute 
                    path={item.key} 
                    element={<item.component />} 
                  />
                }
              />
            ))}
          </Routes>
        </Content>
      </Layout>
      
      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={isResetPasswordModalVisible}
        okText="确定"
        cancelText="取消"
        onOk={async () => {
          try {
            const values = await resetPasswordForm.validateFields();
            const result = await authService.resetPassword(values.newPassword);
            if (result.code === 0) {
              resetPasswordForm.resetFields();
              setIsResetPasswordModalVisible(false);
            } else {
              message.error(result.message || '密码重置失败');
            }
          } catch (error) {
            if (error instanceof Error && error.name === 'ValidateError') {
              // 表单验证失败，不需要额外处理
              return;
            }
            message.error('密码重置失败');
            console.error('重置密码失败:', error);
          }
        }}
        onCancel={() => {
          setIsResetPasswordModalVisible(false);
        }}
        afterClose={() => {
          resetPasswordForm.resetFields();
        }}
      >
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

const App: React.FC = () => {
  // 获取登录页面组件
  const loginItem = extractRouteItems(menuItems).find(item => item.key === '/auth/login');
  const LoginPage = loginItem?.component;

  return (
    <Router>
      <Routes>
        {/* 登录页面路由，不使用LayoutContent布局 */}
        {LoginPage && (
          <Route path="/auth/login" element={<LoginPage />} />
        )}
        
        {/* 其他页面路由，使用LayoutContent布局 */}
        <Route path="/*" element={<LayoutContent />} />
      </Routes>
    </Router>
  );
};

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
