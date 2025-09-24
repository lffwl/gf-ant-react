import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, Row, Col } from 'antd';
import { siteSettingService } from '../../../services/siteSettingService';

const { Option } = Select;

interface SiteSettingData {
  id: number;
  settingKey: string;
  settingValue: string;
  valueType: string;
  group: string;
  description: string;
}

interface SiteSettingEditProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editSetting?: SiteSettingData;
}

const SiteSettingEdit: React.FC<SiteSettingEditProps> = ({ visible, onCancel, onSuccess, editSetting }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editSetting;

  // 配置分组选项
  const groupOptions = [
    { label: '通用设置', value: 'general' },
    { label: 'SEO设置', value: 'seo' },
    { label: '邮箱设置', value: 'email' },
    { label: '社交设置', value: 'social' },
    { label: '安全设置', value: 'security' },
  ];

  // 配置值类型选项
  const valueTypeOptions = [
    { label: '文本', value: 'text' },
    { label: '数字', value: 'number' },
    { label: '布尔值', value: 'boolean' },
    { label: 'JSON', value: 'json' },
    { label: 'HTML', value: 'html' },
  ];

  useEffect(() => {
    if (visible) {
      // 如果是编辑模式，填充表单数据
      if (isEditMode && editSetting) {
        form.setFieldsValue({
          settingKey: editSetting.settingKey || '',
          settingValue: editSetting.settingValue || '',
          valueType: editSetting.valueType || 'text',
          group: editSetting.group || 'general',
          description: editSetting.description || '',
        });
      } else {
        // 新增模式下重置表单
        form.resetFields();
      }
    }
  }, [visible, isEditMode, editSetting, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let response;
      if (isEditMode && editSetting) {
        response = await siteSettingService.updateSiteSetting(editSetting.id.toString(), values);
      } else {
        response = await siteSettingService.createSiteSetting(values);
      }

      if (response.code === 0) {
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      console.error('提交表单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditMode ? '编辑网站设置' : '新增网站设置'}
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          提交
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="settingKey"
              label="配置项键名"
              rules={[
                { required: true, message: '请输入配置项键名' },
                { min: 2, max: 100, message: '配置项键名长度必须在2-100个字符之间' },
              ]}
            >
              <Input placeholder="如 site_name, contact_email, enable_register" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="settingValue"
              label="配置项值"
              rules={[
                { max: 4000, message: '配置项值长度不能超过4000个字符' },
              ]}
            >
              <Input.TextArea rows={4} placeholder="可为字符串、JSON 或其他序列化格式" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="valueType"
              label="值类型"
              rules={[
                { required: true, message: '请选择值类型' },
              ]}
            >
              <Select placeholder="请选择值类型">
                {valueTypeOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="group"
              label="配置分组"
              rules={[
                { required: true, message: '请选择配置分组' },
              ]}
            >
              <Select placeholder="请选择配置分组">
                {groupOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="配置项说明"
              rules={[
                { max: 500, message: '配置项说明长度不能超过500个字符' },
              ]}
            >
              <Input.TextArea rows={2} placeholder="请输入配置项说明" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SiteSettingEdit;