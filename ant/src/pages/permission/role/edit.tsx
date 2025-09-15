import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Select, Switch, TreeSelect, message, Button, Space } from 'antd';
import { roleService, RoleCreateReq } from '../../../services/roleService.ts';
import { apiService } from '../../../services/apiService.ts';
import { RoleData, convertApiIdsToObjects, convertApiIdsToValues, transformApiData } from '../../../utils/role/RoleUtils.tsx';

const { TextArea } = Input;

interface RoleEditProps {
  visible: boolean;
  editingRecord: RoleData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoleEdit: React.FC<RoleEditProps> = ({
  visible,
  editingRecord,
  onClose,
  onSuccess
}) => {
  const [formInstance] = Form.useForm();
  const [apiTreeData, setApiTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 当编辑记录变化时，加载API树数据和角色详情
  useEffect(() => {
    if (visible) {
      fetchApiTree();
      if (editingRecord) {
        loadRoleDetail();
      } else {
        // 新增时重置表单
        formInstance.resetFields();
        // 设置默认值
        formInstance.setFieldsValue({
          status: true
        });
      }
    }
  }, [visible, editingRecord, formInstance]);

  // 获取API树形数据
  const fetchApiTree = async () => {
    try {
      const response = await apiService.getApiTree();
      if (response.code === 0 && response.data && response.data.list) {
        const transformedData = transformApiData(response.data.list);
        setApiTreeData(transformedData);
      }
    } catch (error) {
      message.error('获取API权限数据失败');
    }
  };

  // 获取角色详情
  const loadRoleDetail = async () => {
    if (!editingRecord) return;
    
    setLoading(true);
    try {
      // 调用角色详情接口获取最新的API权限数据
      const detailResponse = await roleService.getRoleDetail(editingRecord.id);
      if (detailResponse.code === 0 && detailResponse.data) {
        const roleDetail = detailResponse.data;
        // 将apiIds数组转换为{value: number}格式的对象数组
        const apiIdsWithValue = convertApiIdsToObjects(roleDetail.apiIds);

        formInstance.setFieldsValue({
          name: roleDetail.name,
          description: roleDetail.description,
          dataScope: roleDetail.dataScope,
          sort: roleDetail.sort,
          status: roleDetail.status,
          apiIds: apiIdsWithValue
        });
      } else {
        // 如果详情接口失败，使用列表中的旧数据
        const apiIdsWithValue = convertApiIdsToObjects(editingRecord.apiIds);

        formInstance.setFieldsValue({
          name: editingRecord.name,
          description: editingRecord.description,
          dataScope: editingRecord.dataScope,
          sort: editingRecord.sort,
          status: editingRecord.status,
          apiIds: apiIdsWithValue
        });
      }
    } catch (error) {
      message.error('获取角色详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      // 将对象数组格式的apiIds转换为纯值数组
      const apiIdsArray = convertApiIdsToValues(values.apiIds);

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

      formInstance.resetFields();
      onSuccess();
    } catch (error) {
      // 错误处理已经在roleService中完成
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={editingRecord ? '编辑角色' : '新增角色'}
      width={600}
      open={visible}
      onClose={onClose}
      loading={loading}
      footer={
        <Space>
          <Button key="cancel" onClick={onClose}>
            取消
          </Button>
          <Button key="submit" type="primary" onClick={() => formInstance.submit()}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        form={formInstance}
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
          <TextArea rows={3} placeholder="请输入角色描述" />
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
  );
};

export default RoleEdit;