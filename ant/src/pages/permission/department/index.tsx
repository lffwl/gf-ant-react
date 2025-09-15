import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, Card, Row, Col, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { departmentService } from '../../../services/departmentService';
import type { ColumnsType } from 'antd/es/table';
import { PermissionAction } from '../../../utils/permission';
import { DepartmentData, transformDepartmentData, getAllDepartmentKeys } from '../../../utils/department/DepartmentUtils';
import DepartmentEdit from './edit';

const { Content } = Layout;

const DepartmentList: React.FC = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [editDepartment, setEditDepartment] = useState<DepartmentData | undefined>(undefined);
  const [departmentTree, setDepartmentTree] = useState<any[]>([]);
  
  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  const columns: ColumnsType<DepartmentData> = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'id',
      width: '10%',
    },
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: boolean) => (
        <span style={{ color: status ? 'green' : 'red' }}>
          {status ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '10%',
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <PermissionAction permission="sys.department.update">
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.department.delete">
            <Popconfirm
              title="确认删除"
              description={`确认要删除ID为 ${record.key} 的部门吗？`}
              onConfirm={() => handleDelete(record)}
              okText="确认"
              cancelText="取消"
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

  // 初始加载部门数据
  useEffect(() => {
    // 将当前查询参数序列化为字符串进行比较
    const currentQueryParams = JSON.stringify({ action: 'initialLoad' });
    
    // 只有当查询参数真正发生变化时才调用接口
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchDepartmentTree();
    }
  }, []);

  // 转换为TreeSelect需要的数据结构
  const transformToTreeSelectData = (data: DepartmentData[]): any[] => {
    return data.map(item => ({
      title: item.name,
      value: item.key.toString(),
      key: item.key.toString(),
      children: item.children ? transformToTreeSelectData(item.children) : undefined
    }));
  };

  const fetchDepartmentTree = async () => {
    setLoading(true);
    try {
      const response = await departmentService.getDepartmentTree();
      if (response.code === 0 && response.data && response.data.list) {
        console.log('后端返回的部门树形数据:', response.data.list);
        // 转换后端返回的树形结构数据为前端需要的格式
        const transformedData = transformDepartmentData(response.data.list);
        console.log('转换后的表格数据:', transformedData);
        setDepartmentData(transformedData);
        // 递归获取所有节点的key，实现N级展开
        setExpandedRowKeys(getAllDepartmentKeys(transformedData));
        // 转换为TreeSelect需要的数据结构并存储
        const treeData = transformToTreeSelectData(transformedData);
        setDepartmentTree(treeData);
      }
    } catch (error) {
      // 错误处理已经在departmentService中完成
      console.error('获取部门树失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: DepartmentData) => {
    setEditDepartment(record);
    setVisible(true);
  };

  const handleDelete = async (record: DepartmentData) => {
    try {
      await departmentService.deleteDepartment(record.key.toString());
      // 删除后重新加载数据
      const currentQueryParams = JSON.stringify({ action: 'delete', recordId: record.key });
      if (prevQueryParamsRef.current !== currentQueryParams) {
        prevQueryParamsRef.current = currentQueryParams;
        fetchDepartmentTree();
      }
    } catch (error) {
      // 错误处理已经在departmentService中完成
      console.error('删除部门失败:', error);
    }
  };

  const handleCreate = () => {
    setEditDepartment(undefined);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setEditDepartment(undefined);
  };

  const handleSuccess = () => {
    setVisible(false);
    setEditDepartment(undefined);
    // 成功后重新加载数据
    const currentQueryParams = JSON.stringify({ action: 'success', timestamp: Date.now() });
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchDepartmentTree();
    }
  };

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          {/* 表格区域 */}
          <Card>
            <PermissionAction permission="sys.department.create">
              <Row gutter={16}>
                <Col span={9}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreate}
                    >
                      新增部门
                    </Button>
                  </Space>
                </Col>
              </Row>
            </PermissionAction>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={departmentData}
                  pagination={false}
                  rowKey={(record) => record.key}
                  expandable={{
                    expandedRowKeys,
                    onExpand: (expanded, record) => {
                      const keys = expanded
                        ? [...expandedRowKeys, record.key]
                        : expandedRowKeys.filter(key => key !== record.key);
                      setExpandedRowKeys(keys);
                    },
                    onExpandedRowsChange: (keys) => {
                      setExpandedRowKeys([...keys]);
                    }
                  }}
                  loading={loading}
                />
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
      {/* 部门编辑弹窗 */}
      <DepartmentEdit
        visible={visible}
        editDepartment={editDepartment}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        departmentTree={departmentTree}
      />
    </div>
  );
};

export default DepartmentList;