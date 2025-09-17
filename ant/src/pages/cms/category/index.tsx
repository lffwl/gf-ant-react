import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, Card, Row, Col, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { categoryService } from '../../../services/categoryService';
import type { ColumnsType } from 'antd/es/table';
import { PermissionAction } from '../../../utils/permission';
import { CategoryData, transformCategoryData, getAllCategoryKeys } from '../../../utils/cms/CategoryUtils';
import CategoryEdit from './edit';

const { Content } = Layout;

const CategoryList: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryData | undefined>(undefined);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  
  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  const columns: ColumnsType<CategoryData> = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'id',
      width: '10%',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '分类别名',
      dataIndex: 'slug',
      key: 'slug',
      width: '15%',
    },
    {
      title: '内容类型',
      dataIndex: 'contentType',
      key: 'contentType',
      width: '15%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: boolean) => (
        <span style={{ color: status ? 'green' : 'red' }}>
          {status ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '是否导航',
      dataIndex: 'isNav',
      key: 'isNav',
      width: '8%',
      render: (isNav: boolean) => (
        <span style={{ color: isNav ? 'blue' : 'grey' }}>
          {isNav ? '是' : '否'}
        </span>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: '8%',
    },
    {
      title: '操作',
      key: 'action',
      width: '16%',
      render: (_, record) => (
        <Space size="middle">
          <PermissionAction permission="sys.cms.category.update">
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.cms.category.delete">
            <Popconfirm
              title="确认删除"
              description={`确认要删除ID为 ${record.key} 的分类吗？`}
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

  // 初始加载分类数据
  useEffect(() => {
    // 将当前查询参数序列化为字符串进行比较
    const currentQueryParams = JSON.stringify({ action: 'initialLoad' });
    
    // 只有当查询参数真正发生变化时才调用接口
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchCategoryTree();
    }
  }, []);

  // 转换为TreeSelect需要的数据结构
  const transformToTreeSelectData = (data: CategoryData[]): any[] => {
    return data.map(item => ({
      title: item.name,
      value: item.key.toString(),
      key: item.key.toString(),
      children: item.children ? transformToTreeSelectData(item.children) : undefined
    }));
  };

  const fetchCategoryTree = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategoryTree();
      if (response.code === 0 && response.data && response.data.list) {
        console.log('后端返回的分类树形数据:', response.data.list);
        // 转换后端返回的树形结构数据为前端需要的格式
        const transformedData = transformCategoryData(response.data.list);
        console.log('转换后的表格数据:', transformedData);
        setCategoryData(transformedData);
        // 递归获取所有节点的key，实现N级展开
        setExpandedRowKeys(getAllCategoryKeys(transformedData));
        // 转换为TreeSelect需要的数据结构并存储
        const treeData = transformToTreeSelectData(transformedData);
        setCategoryTree(treeData);
      }
    } catch (error) {
      // 错误处理已经在categoryService中完成
      console.error('获取分类树失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: CategoryData) => {
    setEditCategory(record);
    setVisible(true);
  };

  const handleDelete = async (record: CategoryData) => {
    try {
      await categoryService.deleteCategory(record.key.toString());
      // 删除后重新加载数据
      const currentQueryParams = JSON.stringify({ action: 'delete', recordId: record.key });
      if (prevQueryParamsRef.current !== currentQueryParams) {
        prevQueryParamsRef.current = currentQueryParams;
        fetchCategoryTree();
      }
    } catch (error) {
      // 错误处理已经在categoryService中完成
      console.error('删除分类失败:', error);
    }
  };

  const handleCreate = () => {
    setEditCategory(undefined);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setEditCategory(undefined);
  };

  const handleSuccess = () => {
    setVisible(false);
    setEditCategory(undefined);
    // 成功后重新加载数据
    const currentQueryParams = JSON.stringify({ action: 'success', timestamp: Date.now() });
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchCategoryTree();
    }
  };

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          {/* 表格区域 */}
          <Card>
            <PermissionAction permission="sys.cms.category.create">
              <Row gutter={16}>
                <Col span={9}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreate}
                    >
                      新增分类
                    </Button>
                  </Space>
                </Col>
              </Row>
            </PermissionAction>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={categoryData}
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
      {/* 分类编辑弹窗 */}
      <CategoryEdit
        visible={visible}
        editCategory={editCategory}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        categoryTree={categoryTree}
      />
    </div>
  );
};

export default CategoryList;