import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, Input, Select, Card, Row, Col, Layout } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { roleService } from '../../../services/roleService.ts';
import { PermissionAction } from '../../../utils/permission.tsx';
import RoleEdit from './edit.tsx';
import { RoleData, renderDataScopeTag, renderStatusTag, renderApiCountTag } from '../../../utils/role/RoleUtils.tsx';

const { Header, Content } = Layout;

const RoleList: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RoleData | null>(null);
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  // 创建统一的查询参数状态对象
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    name: undefined as string | undefined,
    status: undefined as boolean | undefined
  });

  const columns: ColumnsType<RoleData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: '数据权限',
      dataIndex: 'dataScope',
      key: 'dataScope',
      width: '12%',
      render: renderDataScopeTag
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: renderStatusTag
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '8%',
    },
    {
      title: '权限数量',
      dataIndex: 'apiCount',
      key: 'apiCount',
      width: '10%',
      render: renderApiCountTag
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <PermissionAction permission="sys.role.update">
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.role.delete">
            <Popconfirm
              title={`是否删除角色"${record.name}"？`}
              onConfirm={() => handleDelete(record)}
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

  // 当查询参数变化时自动加载数据
  useEffect(() => {
    // 将查询参数序列化为字符串进行比较
    const currentQueryParams = JSON.stringify({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      name: queryParams.name,
      status: queryParams.status
    });
    
    // 只有当查询参数真正发生变化时才调用接口
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchRoleList();
    }
  }, [queryParams.page, queryParams.pageSize, queryParams.name, queryParams.status]);

  const fetchRoleList = async () => {
    setLoading(true);
    try {
      const result = await roleService.getRoleList({
        page: queryParams.page,
        size: queryParams.pageSize,
        name: queryParams.name,
        status: queryParams.status
      });

      if (result.code === 0 && result.data) {
        const dataWithKeys = result.data.list ? result.data.list.map(item => ({
          ...item,
          key: item.id
        })) : [];
        setRoleData(dataWithKeys);
        setTotal(result.data?.total || 0);
      }
    } catch (error) {
      // 错误处理已经在roleService中完成
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: RoleData) => {
    setEditingRecord(record);
    setDrawerVisible(true);
  };

  const handleDelete = async (record: RoleData) => {
    try {
      await roleService.deleteRole(record.id);
      // 删除后重新加载数据
      const currentQueryParams = JSON.stringify({ 
        action: 'delete', 
        recordId: record.id,
        ...queryParams 
      });
      if (prevQueryParamsRef.current !== currentQueryParams) {
        prevQueryParamsRef.current = currentQueryParams;
        fetchRoleList();
      }
    } catch (error) {
      // 错误处理已经在roleService中完成
    }
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setDrawerVisible(true);
  };

  const handleSuccess = () => {
    setDrawerVisible(false);
    setEditingRecord(null);
    // 提交表单后重新加载数据
    const currentQueryParams = JSON.stringify({
      action: editingRecord ? 'update' : 'create',
      recordId: editingRecord?.id,
      ...queryParams
    });
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchRoleList();
    }
  };

  return (
    <div>
      <Layout>
        <Header style={{ padding: "0 15px", background: '#fff', margin: "10px 0", borderRadius: '8px' }}>
          {/* 搜索区域 */}
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="搜索角色名称"
                value={queryParams.name}
                onChange={(e) => setQueryParams(prev => ({ ...prev, name: e.target.value }))}
                allowClear
                onPressEnter={fetchRoleList}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="状态筛选"
                value={queryParams.status}
                onChange={(value) => setQueryParams(prev => ({ ...prev, status: value }))}
                allowClear
                style={{ width: '100%' }}
              >
                <Select.Option value={true}>启用</Select.Option>
                <Select.Option value={false}>禁用</Select.Option>
              </Select>
            </Col>
          </Row>
        </Header>
        <Content>
          {/* 表格区域 */}
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <PermissionAction permission="sys.role.create">
                <Col span={9}>
                  <Space>
                    <Button
                      type="primary"
                      onClick={handleCreate}
                    >
                      新增角色
                    </Button>
                  </Space>
                </Col>
              </PermissionAction>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={roleData}
                  pagination={{
                    current: queryParams.page,
                    pageSize: queryParams.pageSize,
                    total: total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: (page, pageSize) => {
                      setQueryParams(prev => ({ ...prev, page, pageSize: pageSize || 10 }));
                    },
                    onShowSizeChange: (_current, pageSize) => {
                      setQueryParams(prev => ({ ...prev, page: 1, pageSize }));
                    },
                  }}
                  rowKey="id"
                  loading={loading}
                />
              </Col>
            </Row>
          </Card>
        </Content>

        <RoleEdit
          visible={drawerVisible}
          editingRecord={editingRecord}
          onClose={() => {
            setDrawerVisible(false);
            setEditingRecord(null);
          }}
          onSuccess={handleSuccess}
        />
      </Layout>
    </div>
  );
};

export default RoleList;