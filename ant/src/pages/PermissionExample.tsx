import React, { useState } from 'react';
import { Button, Table, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  PermissionButton,
  PermissionAction,
  PermissionGuard,
  usePermission
} from '../utils/permission';

// 示例数据类型
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const PermissionExample: React.FC = () => {
  // 示例数据
  const [data, setData] = useState<DataType[]>([
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
    { key: '2', name: '李四', age: 42, address: '上海市浦东新区' },
    { key: '3', name: '王五', age: 28, address: '广州市天河区' },
    { key: '4', name: '赵六', age: 36, address: '深圳市南山区' },
  ]);

  // 使用权限Hook检查权限
  const canCreate = usePermission('user:create');
  const canEdit = usePermission('user:edit');
  const canDelete = usePermission('user:delete');
  const canView = usePermission('user:view');

  // 表格列配置
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataType) => (
        <Space size="middle">
          {/* 使用PermissionAction控制查看按钮 */}
          <PermissionAction permission="user:view">
            <Button icon={<EyeOutlined />} size="small">
              查看
            </Button>
          </PermissionAction>

          {/* 使用PermissionAction控制编辑按钮 */}
          <PermissionAction permission="user:edit">
            <Button type="primary" icon={<EditOutlined />} size="small">
              编辑
            </Button>
          </PermissionAction>

          {/* 使用PermissionAction控制删除按钮 */}
          <PermissionAction permission="user:delete">
            <Popconfirm
              title="确定要删除这条数据吗?"
              onConfirm={() => handleDelete(record.key)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                删除
              </Button>
            </Popconfirm>
          </PermissionAction>
        </Space>
      ),
    },
  ];

  // 处理删除操作
  const handleDelete = (key: string) => {
    setData(prevData => prevData.filter(item => item.key !== key));
    message.success('删除成功');
  };

  // 处理新增操作
  const handleAdd = () => {
    const newKey = String(data.length + 1);
    setData([
      ...data,
      { key: newKey, name: '新用户' + newKey, age: 25, address: '新地址' + newKey },
    ]);
    message.success('新增成功');
  };

  // 自定义无权限时显示的内容
  const renderNoPermission = () => (
    <span style={{ color: '#8c8c8c', fontSize: '12px' }}>无权限</span>
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>权限控制示例页面</h1>
      <div style={{ marginBottom: 16 }}>
        {/* 使用PermissionButton控制新增按钮 */}
        <PermissionButton
          permission="user:create"
          onClick={handleAdd}
          showMessage={true}
          messageText="您没有新增权限"
        >
          <Button type="primary" icon={<PlusOutlined />}>
            新增用户
          </Button>
        </PermissionButton>

        {/* 使用PermissionGuard条件渲染按钮组 */}
        <PermissionGuard permission="user:batch-operate">
          <Space style={{ marginLeft: 16 }}>
            <Button>批量删除</Button>
            <Button>批量导出</Button>
          </Space>
        </PermissionGuard>

        {/* 权限状态显示 */}
        <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
          <div>当前权限状态：</div>
          <div>新增权限: {canCreate ? '✓' : '✗'}</div>
          <div>编辑权限: {canEdit ? '✓' : '✗'}</div>
          <div>删除权限: {canDelete ? '✓' : '✗'}</div>
          <div>查看权限: {canView ? '✓' : '✗'}</div>
        </div>
      </div>

      {/* 表格展示 */}
      <Table columns={columns} dataSource={data} rowKey="key" />

      {/* 其他权限控制示例 */}
      <div style={{ marginTop: 32 }}>
        <h3>其他权限控制示例</h3>
        
        {/* 带有自定义fallback的权限按钮 */}
        <PermissionButton
          permission="user:export"
          fallback={renderNoPermission()}
        >
          <Button>导出数据</Button>
        </PermissionButton>

        {/* 内联权限控制 */}
        {canCreate && (
          <Button style={{ marginLeft: 16 }}>批量新增</Button>
        )}
      </div>
    </div>
  );
};

export default PermissionExample;