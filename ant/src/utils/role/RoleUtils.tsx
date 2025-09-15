import React from 'react';
import { Tag } from 'antd';

// 角色数据类型定义
export interface RoleData {
  key: React.Key;
  id: number;
  name: string;
  description: string;
  dataScope: number;
  sort: number;
  status: boolean;
  apiIds: number[];
  apiCount: number;
  createdAt: string;
  updatedAt: string;
}

// 数据权限范围映射
export const dataScopeMap = {
  1: '全部',
  2: '本部门',
  3: '本部门及子部门',
  4: '仅本人',
  5: '自定义'
};

// 转换API树形数据为TreeSelect需要的格式
export const transformApiData = (data: any[]): any[] => {
  return data.map(item => ({
    value: item.id,
    title: item.name,
    children: item.children ? transformApiData(item.children) : undefined
  }));
};

// 渲染数据权限标签
export const renderDataScopeTag = (dataScope: number) => (
  <Tag color={dataScope === 1 ? 'green' : dataScope === 5 ? 'blue' : 'orange'}>
    {dataScopeMap[dataScope as keyof typeof dataScopeMap]}
  </Tag>
);

// 渲染状态标签
export const renderStatusTag = (status: boolean) => (
  <Tag color={status ? 'green' : 'red'}>
    {status ? '启用' : '禁用'}
  </Tag>
);

// 渲染API数量标签
export const renderApiCountTag = (apiCount: number) => (
  <Tag color={apiCount > 0 ? 'blue' : 'default'}>
    {apiCount}
  </Tag>
);

// 将API ID对象数组转换为纯值数组
export const convertApiIdsToValues = (apiIds: any[]): number[] => {
  return Array.isArray(apiIds)
    ? apiIds.map((item: any) => typeof item === 'object' ? item.value : item)
    : [];
};

// 将API ID数组转换为对象数组格式
export const convertApiIdsToObjects = (apiIds: number[]): { value: number }[] => {
  return Array.isArray(apiIds)
    ? apiIds.map(id => ({ value: id }))
    : [];
};