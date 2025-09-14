import React from 'react';
import { Drawer, Form, Input, InputNumber, Select, Switch, TreeSelect } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface ApiData {
  key: React.Key;
  parentId: number;
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

interface ApiEditProps {
  visible: boolean;
  editingRecord: ApiData | null;
  apiData: ApiData[];
  onClose: () => void;
  onSubmit: (values: any) => void;
  form: FormInstance;
}

const ApiEdit: React.FC<ApiEditProps> = ({
  visible,
  editingRecord,
  apiData,
  onClose,
  onSubmit,
  form
}) => {
  const handleStatusChange = (checked: boolean) => {
    console.log('status转换:', checked, '->', checked ? 1 : 0);
    return checked ? 1 : 0;
  };

  const handleIsMenuChange = (checked: boolean) => {
    console.log('isMenu转换:', checked, '->', checked ? 1 : 0);
    return checked ? 1 : 0;
  };

  const validateMethod = (_: any, value: string) => {
    return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].includes(value)
      ? Promise.resolve()
      : Promise.reject(new Error('请求方法必须是GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD中的一个'));
  };

  return (
    <Drawer
      title={editingRecord ? '编辑API' : '新增API'}
      width={720}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ textAlign: 'right', marginBottom: 10 }}>

          <button
            type="button"
            onClick={onClose}
            style={{
              marginRight: 8,
              padding: '4px 15px',
              border: '1px solid #d9d9d9',
              borderRadius: 2,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => form.submit()}
            style={{
              padding: '4px 15px',
              border: '1px solid #1890ff',
              borderRadius: 2,
              background: '#1890ff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            提交
          </button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
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
          getValueFromEvent={handleStatusChange}
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
          getValueFromEvent={handleIsMenuChange}
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
  );
};

export default ApiEdit;