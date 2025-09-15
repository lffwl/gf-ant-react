import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import { Layout } from 'antd';
const { Content } = Layout;
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from './config/menuItems';
import 'antd/dist/reset.css'

// 导入拆分出的组件
import Sidebar from './components/Sidebar';
import HeaderContent from './components/Header';
import ResetPasswordModal from './components/ResetPasswordModal';
import ProtectedRoute from './components/ProtectedRoute';

// 导入工具函数
import { clearAllCache, getUserInfo, getRoleInfo, extractRouteItems } from './utility/AuthUtils';

const LayoutContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 处理退出登录
  const handleLogout = () => {
    clearAllCache();
    navigate('/auth/login');
  };

  // 处理重置密码
  const handleResetPassword = () => {
    setIsResetPasswordModalVisible(true);
  };

  // 关闭重置密码弹窗
  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  // 获取用户信息和角色信息
  const userInfo = getUserInfo();
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

  // 生成路由配置，但排除登录页面
  const routeItems = extractRouteItems(menuItems).filter(item => item.key !== '/auth/login');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <HeaderContent 
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onResetPassword={handleResetPassword}
          onLogout={handleLogout}
          userInfo={userInfo}
          userRoles={userRoles}
          location={location}
        />
      
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
      <ResetPasswordModal 
        visible={isResetPasswordModalVisible} 
        onCancel={handleCloseResetPasswordModal} 
      />
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
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
