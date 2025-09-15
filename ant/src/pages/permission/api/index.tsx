import React, { useState, useEffect, useRef } from 'react';
import { Layout, Table, Button, Space, Popconfirm, Card, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { PermissionAction } from '../../../utils/permission';
import { apiService } from '../../../services/apiService';
import ApiEdit from './edit';
import {
  ApiData,
  transformApiData,
  getAllApiKeys,
  getMethodStyle,
  getStatusDisplay,
  getIsMenuDisplay
} from '../../../utils/api/ApiUtils';

const { Content } = Layout;

const ApiList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ApiData | null>(null);
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  // 初始加载API数据
  useEffect(() => {
    // 将当前查询参数序列化为字符串进行比较
    const currentQueryParams = JSON.stringify({ action: 'initialLoad' });

    // 只有当查询参数真正发生变化时才调用接口
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchApiTree();
    }
  }, []);

  const handleEdit = (record: ApiData) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: ApiData) => {
    try {
      await apiService.deleteApi(record.key.toString());
      // 删除后重新加载数据
      const currentQueryParams = JSON.stringify({ action: 'delete', recordId: record.key });
      if (prevQueryParamsRef.current !== currentQueryParams) {
        prevQueryParamsRef.current = currentQueryParams;
        fetchApiTree();
      }
    } catch (error) {
      // 错误处理已经在apiService中完成
    }
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setModalVisible(true);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    setEditingRecord(null);
    // 提交表单后重新加载数据
    const currentQueryParams = JSON.stringify({
      action: editingRecord ? 'update' : 'create',
      recordId: editingRecord?.key
    });
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchApiTree();
    }
  };

  const fetchApiTree = async () => {
    setLoading(true);
    try {
      const response = await apiService.getApiTree();
      if (response.code === 0 && response.data && response.data.list) {
        // 使用工具类转换后端返回的数据
        const transformedData = transformApiData(response.data.list);
        setApiData(transformedData);
        // 使用工具类获取所有节点的key，实现N级展开
        setExpandedRowKeys(getAllApiKeys(transformedData));
      }
    } catch (error) {
      // 错误处理已经在apiService中完成
    } finally {
      setLoading(false);
    }
  };

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
        <span style={getMethodStyle(method)}>
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
        <span>{getIsMenuDisplay(isMenu)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: number) => {
        const statusDisplay = getStatusDisplay(status);
        return (
          <span style={statusDisplay.style}>
            {statusDisplay.text}
          </span>
        );
      },
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
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.api.delete">
            <Popconfirm
              title={`是否删除ID为 ${record.key} 的API？`}
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
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          <Card>
            <Row gutter={16}>
              <PermissionAction permission="sys.api.create">
                <Col span={9}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreate}
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
        </Content>

        {/* 新增/编辑API模态框 */}
        <ApiEdit
          visible={modalVisible}
          editingRecord={editingRecord}
          apiData={apiData}
          onClose={() => setModalVisible(false)}
          onSuccess={handleSuccess}
        />
      </Layout>
    </div>
  );
};

export default ApiList;