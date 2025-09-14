import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { authService } from '../services/authService';

interface ResetPasswordModalProps {
  visible: boolean;
  onCancel: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ visible, onCancel }) => {
  const [resetPasswordForm] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await resetPasswordForm.validateFields();
      const result = await authService.resetPassword(values.newPassword);
      if (result.code === 0) {
        resetPasswordForm.resetFields();
        onCancel();
      } else {
        message.error(result.message || '密码重置失败');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidateError') {
        // 表单验证失败，不需要额外处理
        return;
      }
      message.error('密码重置失败');
      console.error('重置密码失败:', error);
    }
  };

  const handleAfterClose = () => {
    resetPasswordForm.resetFields();
  };

  return (
    <Modal
      title="重置密码"
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={handleAfterClose}
    >
      <Form form={resetPasswordForm} layout="vertical">
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能小于6位' }
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;