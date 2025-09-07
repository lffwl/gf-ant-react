import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Tag,
  Popconfirm,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { userService, UserData, UserCreateReq, UserUpdateReq } from '../services/userService';

const { Option } = Select;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchDepartmentId, setSearchDepartmentId] = useState<number>();
  const [searchStatus, setSearchStatus] = useState<number>();

  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [form] = Form.useForm();
  const hasLoadedRef = useRef(false);

  // 加载用户列表
  const loadUsers = async () => {
    if (loading) return; // 防止重复调用
    setLoading(true);
    try {
      const response = await userService.getUserList({
        page: currentPage,
        size: pageSize,
        username: searchUsername,
        departmentId: searchDepartmentId,
        status: searchStatus
      });

      if (response.code === 0 && response.data) {
        response.data.list = response.data.list || []
        setUsers(response.data.list.map((item: any) => item.user) || []);
        setTotal(response.data.total || 0);
        // 直接从用户列表接口获取角色和部门列表
        setRoles(response.data.roleList || []);
        setDepartments(response.data.departmentList || []);
      }
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadUsers();
    }
  }, []);

  // 监听搜索条件变化，自动触发搜索
  useEffect(() => {
    if (hasLoadedRef.current) {
      loadUsers();
    }
  }, [currentPage, pageSize, searchUsername, searchDepartmentId, searchStatus]);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    // useEffect会自动触发loadUsers
  };

  // 重置搜索
  const handleReset = () => {
    setSearchUsername('');
    setSearchDepartmentId(undefined);
    setSearchStatus(undefined);
    setCurrentPage(1);
    // 状态更新是异步的，需要在useEffect中触发loadUsers
  };

  // 打开新增模态框
  const handleCreate = () => {
    setModalType('create');
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = async (user: UserData) => {
    setModalType('edit');
    setCurrentUser(user);
    setModalVisible(true);

    try {
      // 获取用户详情信息
      const response = await userService.getUserDetail(user.id);
      if (response.code === 0 && response.data) {
        const userDetail = response.data;
        form.setFieldsValue({
          ...userDetail,
          departmentId: userDetail.departmentId === 0 ? undefined : userDetail.departmentId,
          passwordHash: '' // 编辑时不显示密码
        });
      }
    } catch (error) {
      message.error('获取用户详情失败');
      // 如果获取详情失败，仍然使用列表中的基本信息
      form.setFieldsValue({
        ...user,
        departmentId: user.departmentId === 0 ? undefined : user.departmentId,
        passwordHash: '' // 编辑时不显示密码
      });
    }
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      loadUsers();
    } catch (error) {
      // 错误处理已在service中完成
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (modalType === 'create') {
        await userService.createUser(values as UserCreateReq);
      } else {
        await userService.updateUser({
          ...values,
          id: currentUser?.id
        } as UserUpdateReq);
      }

      setModalVisible(false);
      loadUsers();
    } catch (error) {
      // 错误处理已在service中完成
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text: string, record: UserData) => (
        <span>{text || departments.find(d => d.id === record.departmentId)?.name || ''}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap = {
          0: { text: '禁用', color: 'red' },
          1: { text: '正常', color: 'green' },
          2: { text: '锁定', color: 'orange' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { text: '未知', color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserData) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={
              <span>
                确定要删除用户 <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{record.username}</span> 吗？
              </span>
            }
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 搜索区域 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={5}>
            <Input
              placeholder="请输入用户名"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder="请选择部门"
              value={searchDepartmentId}
              onChange={(value) => setSearchDepartmentId(value)}
              allowClear
              style={{ width: '100%' }}
            >
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={5}>
            <Select
              placeholder="请选择状态"
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={0}>禁用</Option>
              <Option value={1}>正常</Option>
              <Option value={2}>锁定</Option>
            </Select>
          </Col>
          <Col span={9}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新增用户
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>

        {/* 表格区域 */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={modalType === 'create' ? '新增用户' : '编辑用户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {modalType === 'edit' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="用户ID"
                >
                  <Input disabled placeholder="用户ID" />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, max: 50, message: '用户名长度必须在3-50个字符之间' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>

            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机号"
                rules={[
                  { max: 20, message: '手机号长度不能超过20个字符' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleIds"
                label="角色"
                rules={[
                  { required: true, message: '请选择角色' }
                ]}
              >
                <Select mode="multiple" placeholder="请选择角色">
                  {roles.map(role => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="departmentId"
                label="所属部门"
              >
                <Select placeholder="请选择部门" allowClear>
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[
                  { required: true, message: '请选择状态' }
                ]}
              >
                <Select placeholder="请选择状态">
                  <Option value={0}>禁用</Option>
                  <Option value={1}>正常</Option>
                  <Option value={2}>锁定</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {modalType === 'create' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="passwordHash"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, max: 100, message: '密码长度必须在6-100个字符之间' }
                  ]}
                >
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {modalType === 'create' ? '创建' : '更新'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;