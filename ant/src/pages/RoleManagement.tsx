import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Drawer, Form, Input, InputNumber, Select, Switch, Popconfirm, Tag, TreeSelect, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import { roleService, RoleCreateReq } from '../services/roleService';
import { apiService } from '../services/apiService';

interface RoleData {
  key: React.Key;
  id: number;
  name: string;
  description: string;
  dataScope: number;
  sort: number;
  status: boolean;
  apiIds: number[];
  createdAt: string;
  updatedAt: string;
}

const RoleManagement: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RoleData | null>(null);
  const formRef = useRef<FormInstance>();
  const [formInstance] = Form.useForm();
  if (!formRef.current) {
    formRef.current = formInstance;
  }
  const form = formRef.current!;
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [apiTreeData, setApiTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState<boolean | undefined>();
  const isMounted = useRef(false);

  const dataScopeMap = {
    1: '全部',
    2: '本部门',
    3: '本部门及子部门',
    4: '仅本人',
    5: '自定义'
  };

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
      render: (dataScope: number) => (
        <Tag color={dataScope === 1 ? 'green' : dataScope === 5 ? 'blue' : 'orange'}>
          {dataScopeMap[dataScope as keyof typeof dataScopeMap]}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '8%',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
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
            title={`是否删除角色"${record.name}"？`}
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
    fetchRoleList();
  }, [currentPage, pageSize, searchName, searchStatus]);

  // 获取API树形数据
  const fetchApiTree = async () => {
    try {
      const response = await apiService.getApiTree();
      if (response.code === 0 && response.data && response.data.list) {
        // 转换API树形数据为TreeSelect需要的格式
        const transformApiData = (data: any[]): any[] => {
          return data.map(item => ({
            value: item.id,
            title: item.name,
            children: item.children ? transformApiData(item.children) : undefined
          }));
        };
        const transformedData = transformApiData(response.data.list);
        setApiTreeData(transformedData);
      }
    } catch (error) {
      message.error('获取API权限数据失败');
    }
  };

  const fetchRoleList = async () => {
    setLoading(true);
    try {
      const result = await roleService.getRoleList({
        page: currentPage,
        size: pageSize,
        name: searchName,
        status: searchStatus
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

  const handleEdit = async (record: RoleData) => {
    setEditingRecord(record);
    // 在打开编辑抽屉前获取API树数据和角色详情
    await fetchApiTree();
    
    try {
      // 调用角色详情接口获取最新的API权限数据
      const detailResponse = await roleService.getRoleDetail(record.id);
      if (detailResponse.code === 0 && detailResponse.data) {
        const roleDetail = detailResponse.data;
        // 将apiIds数组转换为{value: number}格式的对象数组
        const apiIdsWithValue = Array.isArray(roleDetail.apiIds) 
          ? roleDetail.apiIds.map(id => ({ value: id }))
          : [];
        
        // 延时100ms赋值
        setTimeout(() => {
          form.setFieldsValue({
            name: roleDetail.name,
            description: roleDetail.description,
            dataScope: roleDetail.dataScope,
            sort: roleDetail.sort,
            status: roleDetail.status,
            apiIds: apiIdsWithValue
          });
        }, 100);
      } else {
        // 如果详情接口失败，使用列表中的旧数据
        // 将apiIds数组转换为{value: number}格式的对象数组
        const apiIdsWithValue = Array.isArray(record.apiIds) 
          ? record.apiIds.map(id => ({ value: id }))
          : [];
        
        form.setFieldsValue({
          name: record.name,
          description: record.description,
          dataScope: record.dataScope,
          sort: record.sort,
          status: record.status,
          apiIds: apiIdsWithValue
        });
      }
    } catch (error) {
    }
    
    setDrawerVisible(true);
  };

  const handleDelete = async (record: RoleData) => {
    try {
      await roleService.deleteRole(record.id);
      fetchRoleList();
    } catch (error) {
      // 错误处理已经在roleService中完成
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    try {
      // 将对象数组格式的apiIds转换为纯值数组
      const apiIdsArray = Array.isArray(values.apiIds) 
        ? values.apiIds.map((item: any) => typeof item === 'object' ? item.value : item)
        : [];
      
      const requestData: RoleCreateReq = {
        name: values.name,
        description: values.description,
        dataScope: values.dataScope,
        sort: values.sort,
        status: values.status,
        apiIds: apiIdsArray
      };

      if (editingRecord) {
        await roleService.updateRole({ ...requestData, id: editingRecord.id });
      } else {
        await roleService.createRole(requestData);
      }

      setDrawerVisible(false);
      setEditingRecord(null);
      form.resetFields();
      fetchRoleList();
    } catch (error) {
      // 错误处理已经在roleService中完成
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>角色管理页面</h2>
        <Space>
          <Input
            placeholder="搜索角色名称"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="状态筛选"
            value={searchStatus}
            onChange={(value) => setSearchStatus(value)}
            style={{ width: 120 }}
            allowClear
          >
            <Select.Option value={true}>启用</Select.Option>
            <Select.Option value={false}>禁用</Select.Option>
          </Select>
          <Button type="primary" onClick={async () => {
            // 在打开新增抽屉前获取API树数据
            await fetchApiTree();
            setDrawerVisible(true);
          }}>
            新增角色
          </Button>
          <Button onClick={fetchRoleList} loading={loading}>
            刷新
          </Button>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={roleData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        rowKey="id"
        size="middle"
        loading={loading}
      />

      <Drawer
        title={editingRecord ? '编辑角色' : '新增角色'}
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
          onFinish={handleCreateOrUpdate}
        >
          {editingRecord && (
            <Form.Item label="ID">
              <Input value={editingRecord.id.toString()} disabled />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="角色名称"
            rules={[
              { required: true, message: '角色名称不能为空' },
              { min: 1, max: 50, message: '角色名称长度必须在1-50个字符之间' }
            ]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ max: 500, message: '描述长度不能超过500个字符' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item
            name="dataScope"
            label="数据权限范围"
            rules={[{ required: true, message: '数据权限范围不能为空' }]}
          >
            <Select placeholder="请选择数据权限范围">
              <Select.Option value={1}>全部</Select.Option>
              <Select.Option value={2}>本部门</Select.Option>
              <Select.Option value={3}>本部门及子部门</Select.Option>
              <Select.Option value={4}>仅本人</Select.Option>
              <Select.Option value={5}>自定义</Select.Option>
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
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item
            name="apiIds"
            label="API权限"
          >
            <TreeSelect
              treeData={apiTreeData}
              placeholder="请选择API权限"
              style={{ width: '100%' }}
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              treeCheckStrictly={true}
              fieldNames={{ label: 'title', value: 'value', children: 'children' }}
              treeDefaultExpandAll
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoleManagement;