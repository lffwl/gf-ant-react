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
  permission?: string;
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
    permission: 'sys.permission',
    children: [
      {
        key: '/permission/user',
        icon: React.createElement(UserOutlined),
        label: '用户管理',
        permission: 'sys.user.list',
      },
      {
        key: '/permission/role',
        icon: React.createElement(SafetyOutlined),
        label: '角色管理',
        permission: 'sys.role.list',
      },
      {
        key: '/permission/api',
        icon: React.createElement(ApiOutlined),
        label: 'API管理',
        permission: 'sys.api.list',
      },
      {
        key: '/permission/department',
        icon: React.createElement(TeamOutlined),
        label: '部门管理',
        permission: 'sys.department.list',
      },
    ],
  },
];