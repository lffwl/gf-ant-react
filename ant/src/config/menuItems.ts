import React from 'react';
import { 
  UserOutlined, 
  VideoCameraOutlined, 
  ApiOutlined, 
  HomeOutlined, 
  TeamOutlined, 
  SafetyOutlined, 
  UserAddOutlined,
  SettingOutlined,
  AppstoreOutlined,
  UploadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import Welcome from '../pages/Welcome';
import UserManagement from '../pages/permission/user/index';
import ApiManagement from '../pages/permission/api/index';
import DepartmentList from '../pages/permission/department/index.tsx';
import RoleManagement from '../pages/permission/role/index';
import LoginPage from '../pages/auth/LoginPage';
import PermissionExample from '../pages/PermissionExample';
import CategoryList from '../pages/cms/category/index';
import ArticleList from '../pages/cms/article/index';
import DemoPage from '../pages/upload/DemoPage';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: MenuItem[];
  permission?: string;
  component?: React.ComponentType;
  hidden?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: React.createElement(HomeOutlined),
    label: '欢迎页面',
    component: Welcome
  },
  {
    key: '/cms',
    icon: React.createElement(SettingOutlined),
    label: 'CMS管理',
    permission: 'sys.cms',
    children: [
      {
        key: '/cms/category',
        icon: React.createElement(AppstoreOutlined),
        label: '栏目管理',
        permission: 'sys.cms.category.tree',
        component: CategoryList
      },
      {
        key: '/cms/article',
        icon: React.createElement(FileTextOutlined),
        label: '文章管理',
        permission: 'sys.cms.article',
        component: ArticleList
      }
    ]
  },
  {
    key: '/upload',
    icon: React.createElement(UploadOutlined),
    label: '文件上传',
    component: DemoPage,
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
        component: UserManagement
      },
      {
        key: '/permission/role',
        icon: React.createElement(SafetyOutlined),
        label: '角色管理',
        permission: 'sys.role.list',
        component: RoleManagement
      },
      {
        key: '/permission/api',
        icon: React.createElement(ApiOutlined),
        label: 'API管理',
        permission: 'sys.api.tree',
        component: ApiManagement
      },
      {
        key: '/permission/department',
        icon: React.createElement(TeamOutlined),
        label: '部门管理',
        permission: 'sys.department.tree',
        component: DepartmentList
      },
      {
        key: '/permission/example',
        icon: React.createElement(UserAddOutlined),
        label: '权限示例',
        hidden: true,
        component: PermissionExample
      },
    ],
  },
  {
    key: '/auth/login',
    icon: React.createElement(UserAddOutlined),
    label: '登录',
    component: LoginPage,
    // 通常登录页面不需要显示在菜单中
    hidden: true
  }
];