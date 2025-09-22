import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, TreeSelect, Button, Modal, Space, InputNumber, Row, Col, Image, Card, Select, Tabs } from 'antd';
import WangEditor from '../../../common/editor/WangEditor';
import { CloseOutlined, UploadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import UploadPage from '../../../common/upload/UploadPage';
import { categoryService } from '../../../services/categoryService';
import { CategoryData, transformFormData, filterCategoryTree } from '../../../utils/cms/CategoryUtils';

interface CategoryEditProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editCategory?: CategoryData;
  categoryTree: any[];
  categoryContentTypeMap: Record<string, string>;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({ visible, onCancel, onSuccess, editCategory, categoryTree, categoryContentTypeMap }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [coverImageValue, setCoverImageValue] = useState('');
  const [useSourceMode, setUseSourceMode] = useState(false); // 控制是否使用源码模式
  const [description, setDescription] = useState(''); // 本地存储description值，确保两种模式间数据同步
  const [activeTabKey, setActiveTabKey] = useState('1'); // 控制当前激活的选项卡
  const isEditMode = !!editCategory;

  // 处理文件选择回调
  const handleFileSelect = (files: any[]) => {
    if (files && files.length > 0) {
      // 获取第一个文件的URL（uploadService应该有获取文件URL的方法）
      const fileUrl = files[0].storagePath; // 假设files[0]中包含storagePath
      form.setFieldsValue({ coverImage: fileUrl });
      // 同时更新本地状态，确保图片预览立即显示
      setCoverImageValue(fileUrl);
      setUploadModalVisible(false);
    }
  };

  // 使用ref来跟踪Form组件是否已挂载
  const formRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 当Modal可见时，重置选项卡到第一个
    if (visible) {
      setActiveTabKey('1');
    }
    
    // 只有当Modal可见且Form组件已经挂载时才操作form实例
    if (visible && formRef.current) {
      // 使用setTimeout确保DOM渲染完成
      const timer = setTimeout(() => {
        try {
          // 如果是编辑模式，直接使用传递的栏目数据填充表单
          if (isEditMode && editCategory) {
            // 添加日志检查isNav的实际值和类型
            console.log('编辑模式下的editCategory数据:', editCategory);
            console.log('isNav字段值:', editCategory.isNav, '类型:', typeof editCategory.isNav);
            
            form.setFieldsValue({
              name: editCategory.name,
              slug: editCategory.slug,
              description: editCategory.description,
              cType: editCategory.cType,
              isNav: editCategory.isNav,
              sortOrder: editCategory.sortOrder || 0,
              status: editCategory.status,
              coverImage: editCategory.coverImage,
              seoTitle: editCategory.seoTitle,
              seoKeywords: editCategory.seoKeywords,
              seoDescription: editCategory.seoDescription,
              extra: editCategory.extra,
              parentId: editCategory.parentId === 0 ? undefined : editCategory.parentId,
              linkUrl: editCategory.linkUrl,
            });
            // 同时更新本地description状态
            setDescription(editCategory.description || '');
          } else {
            // 新增模式下重置表单并确保状态默认勾选上
            form.resetFields();
            // 单独设置状态字段为true，确保状态默认勾选上
            form.setFieldsValue({ status: true });
            // 清空本地description状态
            setDescription('');
          }
        } catch (error) {
          console.warn('表单操作失败，可能是因为Form组件尚未完全挂载:', error);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [visible, isEditMode, editCategory, categoryTree, form]);

  // 监听coverImage字段变化，更新本地state
  useEffect(() => {
    if (formRef.current && visible) {
      const timer = setTimeout(() => {
        try {
          const value = form.getFieldValue('coverImage');
          setCoverImageValue(value || '');
        } catch (error) {
          console.warn('获取封面图片值失败:', error);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [form, visible]);

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

  // 自定义TreeSelect的筛选逻辑
  const treeFilter = (inputValue: string, treeNode: any) => {
    return treeNode.title.indexOf(inputValue) !== -1;
  };

  // 获取过滤后的栏目树（编辑时排除自己，避免循环引用）
  const getFilteredCategoryTree = () => {
    if (isEditMode && editCategory) {
      // 转换为CategoryData格式并过滤
      const categoryData: CategoryData[] = categoryTree.map(item => ({
        key: item.key,
        parentId: 0,
        name: item.title,
        slug: '',
        description: '',
        cType: '',
        linkUrl: '',
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
          cType: '',
          isNav: false,
          sortOrder: 0,
          status: true,
          coverImage: '',
        })) : undefined
      }));

      // 过滤掉当前编辑的栏目
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
    <>
      <Modal
        title={isEditMode ? (
          <span style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
            <EditOutlined style={{ marginRight: '8px' }} /> 编辑栏目
          </span>
        ) : (
          <span style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
            <PlusOutlined style={{ marginRight: '8px' }} /> 新增栏目
          </span>
        )}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        className="custom-modal"
        style={{
          borderRadius: '8px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)'
        }}
      >
        <div ref={formRef} style={{ padding: '16px 0' }}>
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
            className="category-form"
          >
            <Card
              style={{ borderRadius: '8px', border: '1px solid #f0f0f0', marginBottom: '24px' }}
              styles={{ body: { padding: 0 } }}
            >
              <Tabs 
                activeKey={activeTabKey}
                onChange={setActiveTabKey}
                size="large" 
                style={{
                  borderBottom: '1px solid #f0f0f0'
                }}
                tabBarStyle={{
                  padding: '0 20px'
                }}
                items={[
                  {
                    key: '1',
                    label: '基础信息',
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Row gutter={[24, 24]}>
                          <Col span={16}>
                            <Row gutter={[24, 16]}>
                              <Col span={12}>
                                <Form.Item
                                  label="栏目名称"
                                  name="name"
                                  rules={[{ required: true, message: '请输入栏目名称' }, { min: 2, max: 50, message: '栏目名称长度必须在2-50个字符之间' }]}
                                >
                                  <Input placeholder="请输入栏目名称" className="form-input" />
                                </Form.Item>
                              </Col>

                              <Col span={12}>
                                <Form.Item
                                  label="栏目别名/URL标识"
                                  name="slug"
                                  rules={[
                                    { pattern: /^[a-zA-Z0-9_-]+$/, message: '栏目别名只能包含字母、数字、下划线和连字符' }
                                  ]}
                                >
                                  <Input placeholder="请输入栏目别名（只能包含字母、数字、下划线和连字符）" className="form-input" />
                                </Form.Item>
                              </Col>

                              <Col span={12}>
                                <Form.Item
                                  label="栏目类型"
                                  name="cType"
                                  rules={[{ required: true, message: '请选择栏目类型' }]}
                                >
                                  <Select placeholder="请选择栏目类型">
                                    {Object.entries(categoryContentTypeMap).map(([key, value]) => (
                                      <Select.Option key={key} value={key}>{value}</Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>

                              <Col span={12}>
                                <Form.Item
                                  label="父级栏目"
                                  name="parentId"
                                >
                                  <TreeSelect
                                    style={{ width: '100%' }}
                                    placeholder="请选择父级栏目"
                                    treeData={getFilteredCategoryTree()}
                                    treeDefaultExpandAll
                                    allowClear
                                    treeNodeFilterProp="title"
                                    filterTreeNode={treeFilter}
                                    fieldNames={{
                                      label: 'title',
                                      value: 'value'
                                    }}
                                    className="form-select"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  label="外链地址"
                                  name="linkUrl"
                                  tooltip="当栏目类型为link时使用"
                                >
                                  <Input placeholder="请输入外链地址" className="form-input" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={[24, 16]}>
                              <Col span={8}>
                                <Form.Item
                                  label="排序"
                                  name="sortOrder"
                                  rules={[]}
                                >
                                  <InputNumber placeholder="请输入排序号" style={{ width: '100%' }} className="form-input" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  label="状态"
                                  name="status"
                                  valuePropName="checked"
                                >
                                  <Switch
                                    checkedChildren="启用"
                                    unCheckedChildren="禁用"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  label="是否导航显示"
                                  name="isNav"
                                  valuePropName="checked"
                                >
                                  <Switch
                                    checkedChildren="是"
                                    unCheckedChildren="否"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>

                          <Col span={8}>
                            <div style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                              封面图片
                            </div>

                            {/* 封面图显示区域 */}
                            <div style={{
                              border: '1px dashed #d9d9d9',
                              borderRadius: '8px',
                              padding: '16px',
                              backgroundColor: '#fafafa',
                              transition: 'all 0.3s'
                            }}>
                              {coverImageValue ? (
                                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                  <Image
                                    src={`${import.meta.env.VITE_FILE_SERVER_URL}/${coverImageValue}`}
                                    alt="封面图片"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '180px',
                                      borderRadius: '4px',
                                      transition: 'transform 0.3s',
                                      cursor: 'pointer'
                                    }}
                                    preview={true}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                  />
                                  <Button
                                    type="text"
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={() => {
                                      // 强制清除封面图片字段值并确保组件重新渲染
                                      form.setFieldsValue({ coverImage: '' });
                                      setCoverImageValue('');
                                      // 使用重置字段的方式确保表单状态完全更新
                                      form.resetFields(['coverImage']);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '-8px',
                                      right: '-8px',
                                      backgroundColor: 'white',
                                      borderRadius: '50%',
                                      width: '28px',
                                      height: '28px',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                      transition: 'all 0.3s',
                                      zIndex: 1
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#ff4d4f';
                                      e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'white';
                                      e.currentTarget.style.color = '#ff4d4f';
                                    }}
                                  />
                                </div>
                              ) : (
                                <Button
                                  type="dashed"
                                  onClick={() => setUploadModalVisible(true)}
                                  style={{
                                    width: '100%',
                                    height: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    borderColor: '#d9d9d9',
                                    backgroundColor: '#ffffff',
                                    transition: 'all 0.3s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#1890ff';
                                    e.currentTarget.style.backgroundColor = '#e6f7ff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                  }}
                                >
                                  <UploadOutlined style={{ fontSize: '28px', marginBottom: '8px', color: '#999' }} />
                                  <span style={{ color: '#666' }}>点击上传封面图片</span>
                                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                    支持JPG、PNG、GIF格式，建议尺寸：200×200px
                                  </div>
                                </Button>
                              )}
                            </div>

                            {/* 封面图片URL输入框 */}
                            <Form.Item
                              label="封面图URL"
                              name="coverImage"
                              rules={[]}
                              style={{ marginTop: '16px' }}
                            >
                              <Input placeholder="也可直接输入封面图片URL地址" className="form-input" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    )
                  },
                  {
                    key: '2',
                    label: '栏目详情',
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Form.Item
                          label="栏目描述"
                          name="description"
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ marginRight: '8px' }}>编辑模式：</span>
                            <Switch
                              checked={useSourceMode}
                              onChange={setUseSourceMode}
                              checkedChildren="源码模式"
                              unCheckedChildren="编辑器模式"
                            />
                          </div>
                          {useSourceMode ? (
                            <Input.TextArea
                              placeholder="请输入栏目描述信息，简要介绍此栏目的内容和特点（源码模式）"
                              rows={12}
                              maxLength={16383}
                              showCount
                              value={description}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setDescription(newValue);
                                form.setFieldsValue({ description: newValue });
                              }}
                            />
                          ) : (
                            <WangEditor
                              placeholder="请输入栏目描述信息，简要介绍此栏目的内容和特点"
                              height={200}
                              maxHeight={400} // 限制最大高度为400px，超出时显示滚动条
                              maxLength={16383} // 限制字数为16383个
                              value={description}
                              onChange={(value) => {
                                setDescription(value);
                                form.setFieldsValue({ description: value });
                              }}
                            />
                          )}
                        </Form.Item>
                      </div>
                    )
                  },
                  {
                    key: '3',
                    label: 'SEO设置',
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Row gutter={[24, 16]}>
                          <Col span={12}>
                            <Form.Item
                              label="SEO标题"
                              name="seoTitle"
                              rules={[{ max: 100, message: 'SEO标题长度不能超过100个字符' }]}
                            >
                              <Input placeholder="请输入SEO标题，建议包含核心关键词" className="form-input" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="SEO关键词"
                              name="seoKeywords"
                              rules={[{ max: 255, message: 'SEO关键词长度不能超过255个字符' }]}
                            >
                              <Input placeholder="请输入SEO关键词，多个关键词用逗号分隔" className="form-input" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          label="SEO描述"
                          name="seoDescription"
                          rules={[{ max: 255, message: 'SEO描述长度不能超过255个字符' }]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="请输入SEO描述，简要概述栏目内容，吸引用户点击"
                            className="form-textarea"
                          />
                        </Form.Item>
                      </div>
                    )
                  },
                  {
                    key: '4',
                    label: '高级设置',
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Form.Item
                          label="扩展属性"
                        >
                          <Form.Item
                            name="extra"
                            rules={[{ max: 5000, message: '扩展属性长度不能超过5000个字符' }]}
                            noStyle
                          >
                            <Input.TextArea
                              rows={4}
                              placeholder="请输入扩展属性（JSON格式），用于自定义栏目的额外配置"
                              className="form-textarea"
                            />
                          </Form.Item>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                            示例：{`{"color": "#ff6b6b", "icon": "category-icon"}`}
                          </div>
                        </Form.Item>
                      </div>
                    )
                  }
                ]}
              />
            </Card>

            {/* 操作按钮区域 */}
            <div style={{
              textAlign: 'right',
              padding: '16px 0',
              borderTop: '1px solid #f0f0f0',
              marginTop: '16px'
            }}>
              <Space size="middle">
                <Button
                  onClick={handleCancel}
                  style={{ padding: '4px 16px', fontSize: '14px' }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    padding: '4px 24px',
                    fontSize: '14px',
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    borderRadius: '6px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#40a9ff';
                    e.currentTarget.style.borderColor = '#40a9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1890ff';
                    e.currentTarget.style.borderColor = '#1890ff';
                  }}
                >
                  {isEditMode ? '更新栏目' : '创建栏目'}
                </Button>
              </Space>
            </div>
          </Form>

          {/* 添加全局样式 */}
          <style dangerouslySetInnerHTML={{
            __html: `
          .category-form .ant-form-item-label > label {
            font-size: 14px;
            font-weight: 500;
            color: #262626;
          }
          
          .form-input {
            border-radius: 6px;
            border: 1px solid #d9d9d9;
            transition: all 0.3s;
          }
          
          .form-input:focus {
            border-color: #40a9ff !important;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
          
          .form-textarea {
            border-radius: 6px;
            border: 1px solid #d9d9d9;
            transition: all 0.3s;
          }
          
          .form-textarea:focus {
            border-color: #40a9ff !important;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
          
          .form-select {
            border-radius: 6px;
            transition: all 0.3s;
          }
          
          .form-select:focus {
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
          
          .custom-modal .ant-modal-content {
            border-radius: 8px;
          }
          
          .custom-modal .ant-modal-header {
            border-bottom: 1px solid #f0f0f0;
            border-radius: 8px 8px 0 0;
          }
          
          /* 美化滚动条 */
          .custom-modal .ant-modal-body::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-modal .ant-modal-body::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          
          .custom-modal .ant-modal-body::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          
          .custom-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}} />
        </div>
      </Modal>

      {/* 图片上传弹窗 */}
      <Modal
        title="上传封面图片"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <UploadPage
          modalMode={true}
          multiple={false}
          onFileSelect={handleFileSelect}
          onClose={() => setUploadModalVisible(false)}
        />
      </Modal>
    </>
  );
}

export default CategoryEdit;