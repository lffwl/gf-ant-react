import React from 'react';
import { Tag } from 'antd';

// 用户数据类型定义
export interface UserData {
  key: React.Key;
  id: number;
  username: string;
  email?: string;
  mobile?: string;
  departmentId?: number;
  departmentName?: string;
  roleIds?: number[];
  roleNames?: string[];
  status: number;
  createdAt: string;
  updatedAt?: string;
}

// 状态映射
const statusMap = {
  0: { text: '禁用', color: 'red' },
  1: { text: '正常', color: 'green' },
  2: { text: '锁定', color: 'orange' },
};

// 渲染状态标签
export const renderStatusTag = (status: number) => {
  const statusInfo = statusMap[status as keyof typeof statusMap] || { text: '未知', color: 'default' };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

// 渲染角色标签
export const renderRoleTags = (roleNames: string[], roleIds: number[], roles: any[]) => {
  if (roleNames && roleNames.length > 0) {
    return roleNames.map((name, index) => <Tag key={index} color="blue">{name}</Tag>);
  } else if (roleIds && roles) {
    const roleTags = roles.filter(role => roleIds.includes(role.id)).map(role => (
      <Tag key={role.id} color="blue">{role.name}</Tag>
    ));
    return roleTags.length > 0 ? roleTags : <Tag color="default">无角色</Tag>;
  }
  return <Tag color="default">无角色</Tag>;
};

// 格式化日期时间
export const formatDateTime = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return dateString;
  }
};