import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserManagement from './pages/permission/UserManagement';
import ApiManagement from './pages/permission/ApiManagement';
import DepartmentManagement from './pages/permission/DepartmentManagement';
import RoleManagement from './pages/permission/RoleManagement';
import Welcome from './pages/Welcome';
import { menuItems } from './config/menuItems';
import 'antd/dist/reset.css'

const { Header, Sider, Content } = Layout;



const LayoutContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const themeData = theme.useToken();
  const { colorBgContainer } = themeData.token;

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

  const processedMenuItems = menuItems.map(item => ({
    ...item,
    onClick: item.children ? undefined : () => navigate(item.key),
    children: item.children?.map(child => ({
      ...child,
      onClick: () => navigate(child.key),
    })),
  }));

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
            <Route path="/" element={<Welcome />} />
            <Route path="/permission/user" element={<UserManagement />} />
            <Route path="/permission/api" element={<ApiManagement />} />
            <Route path="/permission/department" element={<DepartmentManagement />} />
            <Route path="/permission/role" element={<RoleManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LayoutContent />
    </Router>
  );
};

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
