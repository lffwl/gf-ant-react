import React from 'react';
import { Card, Typography, Space } from 'antd';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { User } from '../services/authService';

const { Title, Text } = Typography;

const Welcome: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        if (response.code === 0 && response.data?.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        console.error('获取个人中心信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 格式化日期时间
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>欢迎使用GF-Ant.Design-Admin管理系统</Title>
        {!loading && userInfo && (
          <Space direction="vertical" size="middle">
            <Text strong style={{ fontSize: '16px' }}>
              欢迎您，{userInfo.username}
            </Text>
            <Text>
              您上次登录时间：{formatDate(userInfo.lastLoginAt)}
            </Text>
            <Text>
              上次登录IP：{userInfo.lastLoginIp || '-'}
            </Text>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default Welcome;