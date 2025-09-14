import React from 'react';
import { Table, Button, Space, Popconfirm, Card, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PermissionAction } from '../../../utils/permission';

interface ApiData {
  key: React.Key;
  parentId: number;
  name: string;
  path: string;
  method: string;
  permissionCode: string;
  isMenu: number;
  status: number;
  sort: number;
  description: string;
  children?: ApiData[];
}

interface ApiListProps {
  apiData: ApiData[];
  loading: boolean;
  expandedRowKeys: React.Key[];
  setExpandedRowKeys: (keys: React.Key[]) => void;
  onEdit: (record: ApiData) => void;
  onDelete: (record: ApiData) => void;
  onCreate: () => void;
}

const ApiList: React.FC<ApiListProps> = ({
  apiData,
  loading,
  expandedRowKeys,
  setExpandedRowKeys,
  onEdit,
  onDelete,
  onCreate
}) => {
  const columns: ColumnsType<ApiData> = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'id',
      width: '8%',
    },
    {
      title: 'API名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '请求路径',
      dataIndex: 'path',
      key: 'path',
      width: '20%',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: '8%',
      render: (method: string) => (
        <span style={{
          color: method === 'GET' ? 'green' : method === 'POST' ? 'blue' : method === 'PUT' ? 'orange' : method === 'DELETE' ? 'red' : 'gray'
        }}>
          {method}
        </span>
      ),
    },
    {
      title: '权限标识',
      dataIndex: 'permissionCode',
      key: 'permissionCode',
      width: '15%',
    },
    {
      title: '是否目录',
      dataIndex: 'isMenu',
      key: 'isMenu',
      width: '8%',
      render: (isMenu: number) => (
        <span>{isMenu === 1 ? '是' : '否'}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: number) => (
        <span style={{ color: status === 1 ? 'green' : 'red' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '8%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <PermissionAction permission="sys.api.update">
            <Button type="link" size="small" onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.api.delete">
            <Popconfirm
              title={`是否删除ID为 ${record.key} 的API？`}
              onConfirm={() => onDelete(record)}
              okText="是"
              cancelText="否"
            >
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </PermissionAction>
        </Space>
      ),
    },
  ];

  const handleExpand = (expanded: boolean, record: ApiData) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter(key => key !== record.key);
    setExpandedRowKeys(keys);
  };

  const handleExpandedRowsChange = (keys: readonly React.Key[]) => {
    setExpandedRowKeys([...keys]);
  };

  return (
    <Card>
      <Row gutter={16}>
        <PermissionAction permission="sys.api.create">
          <Col span={9}>
            <Space>
              <Button
                type="primary"
                onClick={onCreate}
              >
                新增API
              </Button>
            </Space>
          </Col>
        </PermissionAction>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={apiData}
            pagination={false}
            rowKey={(record) => record.key}
            expandable={{
              expandedRowKeys,
              onExpand: handleExpand,
              onExpandedRowsChange: handleExpandedRowsChange
            }}
            loading={loading}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ApiList;