import React from 'react';
import { Card, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>欢迎使用管理系统</Title>
        <Paragraph>
          这是一个功能强大的管理系统，您可以通过左侧菜单导航到不同的功能模块。
        </Paragraph>
        <Paragraph>
          主要功能包括：
        </Paragraph>
        <ul>
          <li>用户管理 - 管理系统用户信息</li>
          <li>权限管理 - 管理系统的权限配置</li>
          <li>API管理 - 管理系统API接口</li>
        </ul>
      </Space>
    </Card>
  );
};

export default Welcome;