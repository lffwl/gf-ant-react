import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Input, Select, Card, Row, Col, Layout, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { userService, UserData } from '../../../services/userService.ts';
import { PermissionAction } from '../../../utils/permission.tsx';
import UserEdit from './edit.tsx';
import { renderStatusTag, renderRoleTags, formatDateTime } from '../../../utils/user/UserUtils.tsx';

const { Header, Content } = Layout;
const { Option } = Select;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  // 创建统一的查询参数状态对象
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    username: undefined as string | undefined,
    departmentId: undefined as number | undefined,
    status: undefined as number | undefined
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: null as number | null, username: '' });

  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  // 加载用户列表
  const loadUsers = async () => {
    if (loading) return; // 防止重复调用
    setLoading(true);
    try {
      const response = await userService.getUserList({
        page: queryParams.page,
        size: queryParams.pageSize,
        username: queryParams.username,
        departmentId: queryParams.departmentId,
        status: queryParams.status
      });

      if (response.code === 0 && response.data) {
        response.data.list = response.data.list || []
        // 处理用户数据，将roles信息合并到user对象中
        const processedUsers = response.data.list.map((item: any) => ({
          ...item.user,
          // 从roles数组中提取角色名称
          roleNames: item.roles?.map((role: any) => {
            const roleInfo = response.data?.roleList?.find((r: any) => r.id === role.roleId);
            return roleInfo?.name || `角色${role.roleId}`;
          }) || [],
          // 从roles数组中提取角色ID
          roleIds: item.roles?.map((role: any) => role.roleId) || []
        }));
        setUsers(processedUsers || []);
        setTotal(response.data.total || 0);
        // 直接从用户列表接口获取角色和部门列表
        setRoles(response.data.roleList || []);
        setDepartments(response.data.departmentList || []);
      }
    } catch (error) {
      // message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 当查询参数变化时自动加载数据
  useEffect(() => {
    // 将查询参数序列化为字符串进行比较
    const currentQueryParams = JSON.stringify({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      username: queryParams.username,
      departmentId: queryParams.departmentId,
      status: queryParams.status
    });
    
    // 只有当查询参数真正发生变化时才调用接口
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      loadUsers();
    }
  }, [queryParams.page, queryParams.pageSize, queryParams.username, queryParams.departmentId, queryParams.status]);

  // 搜索
  const handleSearch = () => {
    setQueryParams(prev => ({
      ...prev,
      page: 1 // 搜索时重置到第一页
    }));
  };

  // 分页变化处理
  const handlePaginationChange = (page: number, size?: number) => {
    setQueryParams(prev => ({
      ...prev,
      page,
      pageSize: size || 10
    }));
  };

  // 打开新增模态框
  const handleCreate = () => {
    setModalType('create');
    setCurrentUser(null);
    setModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = (user: UserData) => {
    setModalType('edit');
    setCurrentUser(user);
    setModalVisible(true);
  };

  // 打开修改密码模态框
  const handleOpenPasswordModal = (user: UserData) => {
    setSelectedUser({ id: user.id, username: user.username });
    setPasswordModalVisible(true);
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

  // 处理成功后的回调
  const handleSuccess = () => {
    loadUsers();
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
      title: '角色',
      dataIndex: 'roleNames',
      key: 'roleNames',
      render: (roleNames: string[], record: UserData) => (
        <span>{renderRoleTags(roleNames, record.roleIds || [], roles)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => renderStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserData) => (
        <Space size="middle">
          <PermissionAction permission="sys.user.update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.user.update-password">
            <Button
              type="link"
              icon={<KeyOutlined />}
              onClick={() => handleOpenPasswordModal(record)}
            >
              修改密码
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.user.delete">
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
          </PermissionAction>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Layout>
        <Header style={{ padding: "0 15px", background: '#fff', margin: "10px 0", borderRadius: '8px' }}>
          {/* 搜索区域 */}
          <Row gutter={16}>
            <Col span={5}>
              <Input
                placeholder="请输入用户名"
                value={queryParams.username}
                onChange={(e) => setQueryParams(prev => ({ ...prev, username: e.target.value }))}
                onPressEnter={handleSearch}
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="请选择部门"
                value={queryParams.departmentId}
                onChange={(value) => setQueryParams(prev => ({ ...prev, departmentId: value }))}
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
                value={queryParams.status}
                onChange={(value) => setQueryParams(prev => ({ ...prev, status: value }))}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value={0}>禁用</Option>
                <Option value={1}>正常</Option>
                <Option value={2}>锁定</Option>
              </Select>
            </Col>
          </Row>
        </Header>
        <Content>
          {/* 表格区域 */}
          <Card>
            <Row gutter={16}>
              <PermissionAction permission="sys.user.create">
                <Col span={9}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreate}
                    >
                      新增用户
                    </Button>
                  </Space>
                </Col>
              </PermissionAction>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={users}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    current: queryParams.page,
                    pageSize: queryParams.pageSize,
                    total: total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: handlePaginationChange,
                    onShowSizeChange: handlePaginationChange,
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Content>

        {/* 新增/编辑用户模态框 */}
        <UserEdit
          visible={modalVisible}
          modalType={modalType}
          currentUser={currentUser}
          roles={roles}
          departments={departments}
          onClose={() => setModalVisible(false)}
          onSuccess={handleSuccess}
        />

        {/* 修改密码模态框 */}
        <UserEdit
          visible={passwordModalVisible}
          modalType="password"
          selectedUser={selectedUser}
          onClose={() => setPasswordModalVisible(false)}
          onSuccess={handleSuccess}
        />
      </Layout>
    </div>
  );
};

export default UserList;