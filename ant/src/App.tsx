import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserManagement from './pages/UserManagement';
import ApiManagement from './pages/ApiManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import RoleManagement from './pages/RoleManagement';
import Welcome from './pages/Welcome';
import { menuItems } from './config/menuItems';

const { Header, Sider, Content } = Layout;



const LayoutContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
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

export default App;