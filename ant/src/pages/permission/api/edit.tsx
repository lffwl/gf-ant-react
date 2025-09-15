import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, TreeSelect, Button, Row, Col } from 'antd';
import { apiService } from '../../../services/apiService';
import { message } from 'antd';
import { ApiData, validateHttpMethod, transformToTreeData } from '../../../utils/api/ApiUtils';

interface ApiEditProps {
  visible: boolean;
  editingRecord: ApiData | null;
  apiData: ApiData[];
  onClose: () => void;
  onSuccess: () => void;
}

const ApiEdit: React.FC<ApiEditProps> = ({
  visible,
  editingRecord,
  apiData,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();

  // 当编辑记录变化时，更新表单值
  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.setFieldsValue({
          parentId: editingRecord.parentId === 0 ? undefined : editingRecord.parentId,
          name: editingRecord.name,
          permissionCode: editingRecord.permissionCode,
          url: editingRecord.path,
          method: editingRecord.method,
          sort: editingRecord.sort,
          status: editingRecord.status === 1,
          isMenu: editingRecord.isMenu === 1,
          description: editingRecord.description
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingRecord, form]);

  const handleStatusChange = (checked: boolean) => {
    return checked ? 1 : 0;
  };

  const handleIsMenuChange = (checked: boolean) => {
    return checked ? 1 : 0;
  };

  // 自定义验证器函数，符合Ant Design表单验证器的签名
  const validateMethod = (_: any, value: string) => {
    const validationResult = validateHttpMethod(value);
    return validationResult.isValid ? Promise.resolve() : Promise.reject(new Error(validationResult.message));
  };

  // 使用工具类转换API数据为TreeSelect需要的格式

  const handleSubmit = async (values: any) => {
    try {
      // 确保status和isMenu字段是数字0或1
      const processedValues = {
        ...values,
        status: Number(values.status),
        isMenu: Number(values.isMenu)
      };

      if (editingRecord) {
        await apiService.updateApi(editingRecord.key.toString(), processedValues, { processResponse: false });
        message.success('API更新成功');
      } else {
        await apiService.createApi(processedValues, { processResponse: false });
        message.success('API创建成功');
      }
      onSuccess();
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  return (
    <Modal
      title={editingRecord ? '编辑API' : '新增API'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={960} // 增加宽度
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {editingRecord && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="ID">
                <Input value={editingRecord.key.toString()} disabled />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="上级API"
              name="parentId"
            >
              <TreeSelect
              placeholder="请选择上级API，不选表示根节点"
              style={{ width: '100%' }}
              treeData={transformToTreeData(apiData)}
              fieldNames={{ label: 'title', value: 'value', children: 'children' }}
              treeDefaultExpandAll
              allowClear
            />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="method"
              label="请求方法"
              rules={[
                { required: true, message: '请求方法不能为空' },
                { validator: validateMethod }
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ type: 'integer', message: '排序必须为整数' }]}
            >
              <InputNumber placeholder="请输入排序" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="状态"
              valuePropName="checked"
              initialValue={true}
              getValueFromEvent={handleStatusChange}
            >
              <Switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isMenu"
              label="是否为菜单"
              valuePropName="checked"
              initialValue={false}
              getValueFromEvent={handleIsMenuChange}
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="描述"
          rules={[
            { max: 200, message: '描述长度不能超过200个字符' }
          ]}
        >
          <Input.TextArea rows={4} placeholder="请输入描述信息" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onClose}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiEdit;