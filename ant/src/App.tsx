import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { menuItems, MenuItem } from './config/menuItems';
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

  // 全局认证检查
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expireTimeStr = localStorage.getItem('expireTime');
    
    // 如果不存在token，直接重定向到登录页面
    if (!token) {
      // 清除所有缓存
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expireTime');
      localStorage.removeItem('refreshTime');
      localStorage.removeItem('apiCodes');
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
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('expireTime');
          localStorage.removeItem('refreshTime');
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('解析过期时间失败:', error);
        // 解析失败时，也清除缓存并重定向到登录页面
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expireTime');
        localStorage.removeItem('refreshTime');
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

  // 过滤掉hidden为true的菜单项，不显示在菜单中
  const filteredMenuItems = menuItems.filter(item => !item.hidden);

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
                element={<item.component />}
              />
            ))}
          </Routes>
        </Content>
      </Layout>
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
