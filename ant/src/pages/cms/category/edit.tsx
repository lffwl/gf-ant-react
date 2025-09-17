import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, TreeSelect, Button, message, Modal, Space, InputNumber, Row, Col } from 'antd';
import { categoryService } from '../../../services/categoryService';
import { CategoryData, transformFormData, filterCategoryTree } from '../../../utils/cms/CategoryUtils';

interface CategoryEditProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editCategory?: CategoryData;
  categoryTree: any[];
}

const CategoryEdit: React.FC<CategoryEditProps> = ({ visible, onCancel, onSuccess, editCategory, categoryTree }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editCategory;

  useEffect(() => {
    if (visible) {
      // 如果是编辑模式，直接使用传递的分类数据填充表单
      if (isEditMode && editCategory) {
        form.setFieldsValue({
          name: editCategory.name,
          slug: editCategory.slug,
          description: editCategory.description,
          contentType: editCategory.contentType,
          isNav: editCategory.isNav,
          sortOrder: editCategory.sortOrder || 0,
          status: editCategory.status,
          coverImage: editCategory.coverImage,
          seoTitle: editCategory.seoTitle,
          seoKeywords: editCategory.seoKeywords,
          seoDescription: editCategory.seoDescription,
          extra: editCategory.extra,
          parentId: editCategory.parentId === 0 ? undefined : editCategory.parentId,
        });
      } else {
        // 新增模式下重置表单
        form.resetFields();
      }
    }
  }, [visible, isEditMode, editCategory, categoryTree]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 转换表单数据为后端需要的格式
      const formData = transformFormData(values);
      
      let response;
      if (isEditMode && editCategory) {
        response = await categoryService.updateCategory(editCategory.key.toString(), formData);
      } else {
        response = await categoryService.createCategory(formData);
      }
      
      if (response.code === 0) {
        message.success(isEditMode ? '分类更新成功' : '分类创建成功');
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

  // 获取过滤后的分类树（编辑时排除自己，避免循环引用）
  const getFilteredCategoryTree = () => {
    if (isEditMode && editCategory) {
      // 转换为CategoryData格式并过滤
      const categoryData: CategoryData[] = categoryTree.map(item => ({
        key: item.key,
        parentId: 0,
        name: item.title,
        slug: '',
        description: '',
        contentType: '',
        isNav: false,
        sortOrder: 0,
        status: true,
        coverImage: '',
        seoTitle: '',
        seoKeywords: '',
        seoDescription: '',
        extra: '',
        children: item.children ? item.children.map((child: any) => ({
          key: child.key,
          parentId: 0,
          name: child.title,
          slug: '',
          description: '',
          contentType: '',
          isNav: false,
          sortOrder: 0,
          status: true,
          coverImage: '',
          seoTitle: '',
          seoKeywords: '',
          seoDescription: '',
          extra: '',
          children: undefined
        })) : undefined
      }));
      
      // 过滤掉当前编辑的分类
      const filteredData = filterCategoryTree(categoryData, editCategory.key);
      
      // 转换回TreeSelect需要的格式
      const transformToTreeSelectFormat = (data: CategoryData[]): any[] => {
        return data.map(item => ({
          title: item.name,
          value: item.key.toString(),
          key: item.key.toString(),
          children: item.children ? transformToTreeSelectFormat(item.children) : undefined
        }));
      };
      
      return transformToTreeSelectFormat(filteredData);
    }
    return categoryTree;
  };

  return (
    <Modal
      title={isEditMode ? '编辑分类' : '新增分类'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: true,
          isNav: false,
          sortOrder: 0,
          parentId: undefined
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="分类名称"
              name="name"
              rules={[{ required: true, message: '请输入分类名称' }, { min: 2, max: 50, message: '分类名称长度必须在2-50个字符之间' }]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
            
            <Form.Item
              label="分类别名/URL标识"
              name="slug"
              rules={[
                { required: true, message: '请输入分类别名' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: '分类别名只能包含字母、数字、下划线和连字符' }
              ]}
            >
              <Input placeholder="请输入分类别名（只能包含字母、数字、下划线和连字符）" />
            </Form.Item>
            
            <Form.Item
              label="父级分类"
              name="parentId"
            >
              <TreeSelect
                style={{ width: '100%' }}
                placeholder="请选择父级分类"
                treeData={getFilteredCategoryTree()}
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
              label="内容类型"
              name="contentType"
              rules={[{ required: true, message: '请选择内容类型' }]}
            >
              <Input placeholder="请输入关联的内容类型" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="排序"
              name="sortOrder"
              rules={[{ required: true, message: '请输入排序号' }]}
            >
              <InputNumber placeholder="请输入排序号" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              label="状态"
              name="status"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
            
            <Form.Item
              label="是否显示在主导航"
              name="isNav"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            
            <Form.Item
              label="封面图片URL"
              name="coverImage"
              rules={[{ type: 'url', message: '请输入有效的URL地址' }]}
            >
              <Input placeholder="请输入封面图片URL" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          label="分类描述"
          name="description"
          rules={[{ max: 255, message: '分类描述长度不能超过255个字符' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入分类描述" />
        </Form.Item>
        
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: '0 0 16px 0' }}>SEO设置</h4>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="SEO标题"
                name="seoTitle"
                rules={[{ max: 100, message: 'SEO标题长度不能超过100个字符' }]}
              >
                <Input placeholder="请输入SEO标题" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label="SEO关键词"
                name="seoKeywords"
                rules={[{ max: 255, message: 'SEO关键词长度不能超过255个字符' }]}
              >
                <Input placeholder="请输入SEO关键词，多个关键词用逗号分隔" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="SEO描述"
            name="seoDescription"
            rules={[{ max: 255, message: 'SEO描述长度不能超过255个字符' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入SEO描述" />
          </Form.Item>
        </div>
        
        <Form.Item
          label="扩展属性"
          name="extra"
          rules={[{ max: 1000, message: '扩展属性长度不能超过1000个字符' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入扩展属性（JSON格式）" />
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

export default CategoryEdit;