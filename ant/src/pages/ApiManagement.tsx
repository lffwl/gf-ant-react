import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Drawer, Form, Input, InputNumber, Select, Switch, TreeSelect, Popconfirm } from 'antd';
import { apiService } from '../services/apiService';
import type { ColumnsType } from 'antd/es/table';

interface ApiData {
  key: React.Key;
  parentId:number;
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

const ApiManagement: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ApiData | null>(null);
  const [form] = Form.useForm();
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const isMounted = useRef(false);

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
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
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
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    fetchApiTree();
  }, []);

  const handleEdit = (record: ApiData) => {
    setEditingRecord(record);
    form.setFieldsValue({
      parentId: record.parentId === 0 ? undefined : record.parentId,
      name: record.name,
      permissionCode: record.permissionCode,
      url: record.path,
      method: record.method,
      sort: record.sort,
      status: record.status === 1,
      isMenu: record.isMenu === 1,
      description: record.description
    });
    setDrawerVisible(true);
  };

  const handleDelete = async (record: ApiData) => {
    try {
      await apiService.deleteApi(record.key.toString());
      fetchApiTree();
    } catch (error) {
      // 错误处理已经在apiService中完成
    }
  };

  const fetchApiTree = async () => {
    setLoading(true);
    try {
      const response = await apiService.getApiTree();
      if (response.code === 0 && response.data && response.data.list) {
        console.log('后端返回的API树形数据:', response.data.list);
        // 转换后端返回的树形结构数据为前端需要的格式
        const transformApiData = (data: any[]): ApiData[] => {
          return data.map(item => ({
            key: item.id || item.key,
            parentId: item.parentId || 0,
            name: item.name,
            path: item.url,
            method: item.method,
            permissionCode: item.permissionCode || '',
            isMenu: item.isMenu || 0,
            status: item.status || 1,
            sort: item.sort || 0,
            description: item.description || '',
            children: item.children ? transformApiData(item.children) : undefined
          }));
        };
        const transformedData = transformApiData(response.data.list);
        console.log('转换后的表格数据:', transformedData);
        setApiData(transformedData);
        // 递归获取所有节点的key，实现N级展开
        const getAllKeys = (data: ApiData[]): React.Key[] => {
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
      // 错误处理已经在apiService中完成
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>API管理页面</h2>
        <Space>
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            新增API
          </Button>
          <Button onClick={fetchApiTree} loading={loading}>
            刷新
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={apiData}
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
        size="middle"
        loading={loading}
      />
      <Drawer
        title={editingRecord ? '编辑API' : '新增API'}
        width={720}
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
              if (editingRecord) {
                await apiService.updateApi(editingRecord.key.toString(), values);
              } else {
                await apiService.createApi(values);
              }
              setDrawerVisible(false);
              setEditingRecord(null);
              form.resetFields();
              fetchApiTree();
            } catch (error) {
              // 错误处理已经在apiService中完成
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
            label="上级API"
            rules={[{ type: 'integer', message: '上级ID必须为整数' }]}
          >
            <TreeSelect
              placeholder="请选择上级API，不选表示根节点"
              style={{ width: '100%' }}
              treeData={apiData}
              fieldNames={{ label: 'name', value: 'key', children: 'children' }}
              treeDefaultExpandAll
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="名称"
            rules={[
              { required: true, message: '名称不能为空' },
              { min: 1, message: '名称长度不能少于1个字符' },
              { max: 50, message: '名称长度不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入名称，如：用户管理、查询用户" />
          </Form.Item>

          <Form.Item
            name="permissionCode"
            label="权限标识"
            rules={[
              { required: true, message: '权限标识不能为空' },
              { min: 1, message: '权限标识长度不能少于1个字符' },
              { max: 100, message: '权限标识长度不能超过100个字符' }
            ]}
          >
            <Input placeholder="请输入权限唯一标识，如：system:user:list" />
          </Form.Item>

          <Form.Item
            name="url"
            label="接口URL"
            rules={[
              { required: true, message: '接口URL不能为空' },
              { min: 1, message: '接口URL长度不能少于1个字符' },
              { max: 200, message: '接口URL长度不能超过200个字符' }
            ]}
          >
            <Input placeholder="请输入接口URL，支持通配符" />
          </Form.Item>

          <Form.Item
            name="method"
            label="请求方法"
            rules={[
              { required: true, message: '请求方法不能为空' },
              {
                validator: (_, value) =>
                  ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].includes(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error('请求方法必须是GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD中的一个'))
              }
            ]}
          >
            <Select placeholder="请选择请求方法">
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="PATCH">PATCH</Select.Option>
              <Select.Option value="OPTIONS">OPTIONS</Select.Option>
              <Select.Option value="HEAD">HEAD</Select.Option>
            </Select>
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

          <Form.Item
            name="isMenu"
            label="是否为菜单"
            valuePropName="checked"
            initialValue={false}
            getValueFromEvent={(checked) => {
              console.log('isMenu转换:', checked, '->', checked ? 1 : 0);
              return checked ? 1 : 0;
            }}
          >
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
            />
          </Form.Item>



          <Form.Item
            name="description"
            label="描述"
            rules={[{ max: 500, message: '描述长度不能超过500个字符' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ApiManagement;