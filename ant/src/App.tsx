import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ApiOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserManagement from './pages/UserManagement';
import ApiManagement from './pages/ApiManagement';
import Welcome from './pages/Welcome';

const { Header, Sider, Content } = Layout;



const LayoutContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '欢迎页面',
      onClick: () => navigate('/'),
    },
    {
      key: '/permission',
      icon: <VideoCameraOutlined />,
      label: '权限管理',
      children: [
        {
          key: '/api',
          icon: <ApiOutlined />,
          label: 'API管理',
          onClick: () => navigate('/api'),
        },
        {
          key: '/user',
          icon: <UserOutlined />,
          label: '用户管理',
          onClick: () => navigate('/user'),
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
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
            <Route path="/user" element={<UserManagement />} />
            <Route path="/api" element={<ApiManagement />} />
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