import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, Switch, Space, Button, message } from 'antd';
import { userService, UserData } from '../../../services/userService.ts';

interface UserEditProps {
  visible: boolean;
  modalType: 'create' | 'edit' | 'password';
  currentUser?: UserData | null;
  selectedUser?: { id: number | null; username: string };
  roles?: any[];
  departments?: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const { Option } = Select;

const UserEdit: React.FC<UserEditProps> = ({
  visible,
  modalType,
  currentUser,
  selectedUser,
  roles = [],
  departments = [],
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // 重置表单
  const resetForm = () => {
    form.resetFields();
  };

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (modalType === 'create') {
        resetForm();
      } else if (modalType === 'edit' && currentUser) {
        form.setFieldsValue({
          username: currentUser.username,
          email: currentUser.email,
          mobile: currentUser.mobile,
          departmentId: currentUser.departmentId,
          roleIds: currentUser.roleIds || [],
          status: currentUser.status === 1,
        });
      }
    }
  }, [visible, modalType, currentUser, form]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 转换状态值：true -> 1, false -> 0
      const processedValues = {
        ...values,
        status: values.status ? 1 : 0,
      };

      if (modalType === 'create') {
        // 新增用户
        await userService.createUser(processedValues, { processResponse: false });
        message.success('用户创建成功');
      } else if (modalType === 'edit' && currentUser?.id) {
        // 编辑用户
        await userService.updateUser({...processedValues, id: currentUser.id}, { processResponse: false });
        message.success('用户更新成功');
      } else if (modalType === 'password' && selectedUser?.id) {
        // 修改密码
        await userService.updateUserPassword(selectedUser.id, { password: values.password }, { processResponse: false });
        message.success('密码更新成功');
      }

      onSuccess();
      onClose();
    } catch (error) {
      // 错误处理已在service中完成
    }
  };

  // 取消按钮处理
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // 获取标题
  const getTitle = () => {
    switch (modalType) {
      case 'create':
        return '新增用户';
      case 'edit':
        return '编辑用户';
      case 'password':
        return `修改用户 ${selectedUser?.username || ''} 密码`;
      default:
        return '用户管理';
    }
  };

  // 根据modalType决定表单字段
  const renderFormItems = () => {
    if (modalType === 'password') {
      return (
        <Form.Item
          label="新密码"
          name="password"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能少于6位' },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
      );
    }

    return (
      <>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            placeholder="请输入用户名"
            disabled={modalType === 'edit'}
          />
        </Form.Item>

        {modalType === 'create' && (
          <Form.Item
            label="密码"
            name="passwordHash"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6位' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: false, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="mobile"
          rules={[
            { required: false, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          label="部门"
          name="departmentId"
          rules={[{ required: true, message: '请选择部门' }]}
        >
          <Select placeholder="请选择部门">
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="角色"
          name="roleIds"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select mode="multiple" placeholder="请选择角色">
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </>
    );
  };

  return (
    <Drawer
      title={getTitle()}
      width={520}
      open={visible}
      onClose={handleCancel}
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true,
        }}
      >
        {renderFormItems()}
      </Form>
    </Drawer>
  );
};

export default UserEdit;