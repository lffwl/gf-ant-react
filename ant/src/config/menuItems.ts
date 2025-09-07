import React from 'react';
import {
  UserOutlined,
  VideoCameraOutlined,
  ApiOutlined,
  HomeOutlined,
  TeamOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: React.createElement(HomeOutlined),
    label: '欢迎页面',
  },
  {
    key: '/permission',
    icon: React.createElement(VideoCameraOutlined),
    label: '权限管理',
    children: [
      {
        key: '/permission/user',
        icon: React.createElement(UserOutlined),
        label: '用户管理',
      },
      {
        key: '/permission/role',
        icon: React.createElement(SafetyOutlined),
        label: '角色管理',
      },
      {
        key: '/permission/api',
        icon: React.createElement(ApiOutlined),
        label: 'API管理',
      },
      {
        key: '/permission/department',
        icon: React.createElement(TeamOutlined),
        label: '部门管理',
      },
    ],
  },
];