import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Drawer, Form, Input, InputNumber, Switch, TreeSelect, Popconfirm, Card, Row, Col, Layout } from 'antd';
const { Content } = Layout;
import { departmentService } from '../../services/departmentService';
import type { ColumnsType } from 'antd/es/table';

interface DepartmentData {
  key: React.Key;
  parentId: number;
  name: string;
  status: boolean;
  sort: boolean;
  children?: DepartmentData[];
}

const DepartmentManagement: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DepartmentData | null>(null);
  const [form] = Form.useForm();
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

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
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
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
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchDepartmentTree();
  }, []);

  const handleEdit = (record: DepartmentData) => {
    setEditingRecord(record);
    form.setFieldsValue({
      parentId: record.parentId === 0 ? undefined : record.parentId,
      name: record.name,
      sort: record.sort,
      status: record.status
    });
    setDrawerVisible(true);
  };

  const handleDelete = async (record: DepartmentData) => {
    try {
      await departmentService.deleteDepartment(record.key.toString());
      fetchDepartmentTree();
    } catch (error) {
      // 错误处理已经在departmentService中完成
    }
  };

  const fetchDepartmentTree = async () => {
    setLoading(true);
    try {
      const response = await departmentService.getDepartmentTree();
      if (response.code === 0 && response.data && response.data.list) {
        console.log('后端返回的部门树形数据:', response.data.list);
        // 转换后端返回的树形结构数据为前端需要的格式
        const transformDepartmentData = (data: any[]): DepartmentData[] => {
          return data.map(item => ({
            key: item.id || item.key,
            parentId: item.parentId || 0,
            name: item.name,
            status: item.status ,
            sort: item.sort || 0,
            children: item.children ? transformDepartmentData(item.children) : undefined
          }));
        };
        const transformedData = transformDepartmentData(response.data.list);
        console.log('转换后的表格数据:', transformedData);
        setDepartmentData(transformedData);
        // 递归获取所有节点的key，实现N级展开
        const getAllKeys = (data: DepartmentData[]): React.Key[] => {
          let keys: React.Key[] = [];
          data.forEach(item => {
            keys.push(item.key);
            if (item.children && item.children.length > 0) {
              keys = keys.concat(getAllKeys(item.children));
            }
          });
          return keys;
        };
        setExpandedRowKeys(getAllKeys(transformedData));
      }
    } catch (error) {
      // 错误处理已经在departmentService中完成
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          {/* 表格区域 */}
          <Card>
            <Row gutter={16}>
              <Col span={9}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => setDrawerVisible(true)}
                  >
                    新增部门
                  </Button>
                </Space>
              </Col>
            </Row>
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
      <Drawer
        title={editingRecord ? '编辑部门' : '新增部门'}
        width={600}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => form.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              // 转换status字段为后端需要的数字类型
              const submitData = {
                ...values,
                status: values.status ? 1 : 0
              };
              
              if (editingRecord) {
                await departmentService.updateDepartment(editingRecord.key.toString(), submitData);
              } else {
                await departmentService.createDepartment(submitData);
              }
              setDrawerVisible(false);
              setEditingRecord(null);
              form.resetFields();
              fetchDepartmentTree();
            } catch (error) {
              // 错误处理已经在departmentService中完成
            }
          }}
        >
          {editingRecord && (
            <Form.Item label="ID">
              <Input value={editingRecord.key.toString()} disabled />
            </Form.Item>
          )}
          <Form.Item
            name="parentId"
            label="上级部门"
            rules={[{ type: 'integer', message: '上级ID必须为整数' }]}
          >
            <TreeSelect
              placeholder="请选择上级部门，不选表示根节点"
              style={{ width: '100%' }}
              treeData={departmentData}
              fieldNames={{ label: 'name', value: 'key', children: 'children' }}
              treeDefaultExpandAll
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="部门名称"
            rules={[
              { required: true, message: '部门名称不能为空' },
              { min: 1, message: '部门名称长度不能少于1个字符' },
              { max: 50, message: '部门名称长度不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>



          <Form.Item
            name="sort"
            label="排序"
            rules={[{ type: 'integer', message: '排序必须为整数' }]}
          >
            <InputNumber placeholder="请输入排序" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
            getValueFromEvent={(checked) => {
              console.log('status转换:', checked, '->', checked ? 1 : 0);
              return checked ? 1 : 0;
            }}
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>


        </Form>
      </Drawer>
      </Layout>
    </div>
  );
};

export default DepartmentManagement;