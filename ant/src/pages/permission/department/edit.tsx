import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, TreeSelect, Button, message, Modal, Space } from 'antd';
import { departmentService } from '../../../services/departmentService';
import { DepartmentData, transformFormData } from '../../../utils/department/DepartmentUtils';

interface DepartmentEditProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editDepartment?: DepartmentData;
  departmentTree: any[];
}

const DepartmentEdit: React.FC<DepartmentEditProps> = ({ visible, onCancel, onSuccess, editDepartment, departmentTree }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editDepartment;

  useEffect(() => {
    if (visible) {
      // 如果是编辑模式，直接使用传递的部门数据填充表单
      if (isEditMode && editDepartment) {
        form.setFieldsValue({
          name: editDepartment.name,
          status: editDepartment.status,
          sort: editDepartment.sort || 0,
          parentId: editDepartment.parentId === 0 ? undefined : editDepartment.parentId,
        });
      } else {
        // 新增模式下重置表单
        form.resetFields();
      }
    }
  }, [visible, isEditMode, editDepartment, departmentTree]);



  // 转换为TreeSelect需要的数据结构
  const transformToTreeSelectData = (data: DepartmentData[]): any[] => {
    return data.map(item => ({
      title: item.name,
      value: item.key.toString(),
      key: item.key.toString(),
      children: item.children ? transformToTreeSelectData(item.children) : undefined
    }));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 转换表单数据为后端需要的格式
      const formData = transformFormData(values);
      
      let response;
      if (isEditMode && editDepartment) {
        response = await departmentService.updateDepartment(editDepartment.key.toString(), formData);
      } else {
        response = await departmentService.createDepartment(formData);
      }
      
      if (response.code === 0) {
        message.success(isEditMode ? '部门更新成功' : '部门创建成功');
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 自定义TreeSelect的筛选逻辑
  const treeFilter = (inputValue: string, treeNode: any) => {
    return treeNode.title.indexOf(inputValue) !== -1;
  };

  return (
    <Modal
      title={isEditMode ? '编辑部门' : '新增部门'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: true,
          sort: undefined,
          parentId: undefined
        }}
      >
        <Form.Item
          label="部门名称"
          name="name"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        
        <Form.Item
          label="父级部门"
          name="parentId"
        >
          <TreeSelect
            style={{ width: '100%' }}
            placeholder="请选择父级部门"
            treeData={departmentTree}
            treeDefaultExpandAll
            allowClear
            treeNodeFilterProp="title"
            filterTreeNode={treeFilter}
            fieldNames={{
              label: 'title',
              value: 'value'
            }}
          />
        </Form.Item>
        
        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入排序号' }]}
        >
          <Input type="number" placeholder="请输入排序号" />
        </Form.Item>
        
        <Form.Item
          label="状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        
        <Form.Item>
          <Space size="middle">
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? '更新' : '创建'}
            </Button>
            <Button onClick={handleCancel}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentEdit;