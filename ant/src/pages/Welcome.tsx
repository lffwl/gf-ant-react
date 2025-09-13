import React from 'react';
import { Card, Typography, Space } from 'antd';

const { Title } = Typography;

const Welcome: React.FC = () => {
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>欢迎使用GF-Ant.Design-Admin管理系统</Title>
      </Space>
    </Card>
  );
};

export default Welcome;