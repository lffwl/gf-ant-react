import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Select, Button, Modal, Row, Col, Image, Tabs, DatePicker, TreeSelect } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import WangEditor from '../../../common/editor/WangEditor';
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import UploadPage from '../../../common/upload/UploadPage';
import { articleService } from '../../../services/articleService';

const { Option } = Select;

interface ArticleData {
  key: number;
  id: number;
  title: string;
  summary?: string;
  coverImage?: string;
  categoryId?: number;
  categoryName?: string;
  authorName?: string;
  articleType: string;
  status: boolean;
  isTop: boolean;
  isHot: boolean;
  isRecommend: boolean;
  viewCount?: number;
  publishAt?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: string;
  externalUrl?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  extra?: string;
}

interface ArticleEditProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editArticle?: ArticleData;
  categoryTree: any[];
}

const ArticleEdit: React.FC<ArticleEditProps> = ({ visible, onCancel, onSuccess, editArticle, categoryTree }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [coverImageValue, setCoverImageValue] = useState('');
  const [useSourceMode, setUseSourceMode] = useState(false);
  const [content, setContent] = useState('');
  // const [categories, setCategories] = useState<CategoryOption[]>([]);
  // const [loadingCategories, setLoadingCategories] = useState(false);
  const [articleType, setArticleType] = useState('normal'); // 新增文章类型状态
  const isEditMode = !!editArticle;

  // 处理文件选择回调
  const handleFileSelect = (files: any[]) => {
    if (files && files.length > 0) {
      const fileUrl = files[0].storagePath;
      form.setFieldsValue({ coverImage: fileUrl });
      setCoverImageValue(fileUrl);
      setUploadModalVisible(false);
    }
  };

  // 加载栏目列表（现在从父组件直接获取）
  // const fetchCategories = async () => {
  //   setLoadingCategories(true);
  //   try {
  //     const response = await categoryService.getCategoryTree();
  //     if (response.code === 0 && response.data) {
  //       const categoryOptions = (response.data.list || []).map((item: any) => ({
  //         value: item.id,
  //         label: item.name
  //       }));
  //       setCategories(categoryOptions);
  //     }
  //   } catch (error) {
  //     console.error('获取栏目列表失败:', error);
  //   } finally {
  //     setLoadingCategories(false);
  //   }
  // };

  useEffect(() => {
    if (visible) {
      // fetchCategories(); // 不再调用接口，直接使用父组件传递的categoryTree
      
      // 如果是编辑模式，填充表单数据
      if (isEditMode && editArticle) {
        form.setFieldsValue({
          title: editArticle.title,
          summary: editArticle.summary,
          coverImage: editArticle.coverImage,
          categoryId: editArticle.categoryId,
          articleType: editArticle.articleType,
          externalUrl: editArticle.externalUrl,
          authorName: editArticle.authorName,
          status: editArticle.status,
          isTop: editArticle.isTop,
          isHot: editArticle.isHot,
          isRecommend: editArticle.isRecommend,
          publishAt: editArticle.publishAt ? new Date(editArticle.publishAt) : undefined,
          seoTitle: editArticle.seoTitle,
          seoKeywords: editArticle.seoKeywords,
          seoDescription: editArticle.seoDescription,
          extra: editArticle.extra,
          content: editArticle.content
        });
        setContent(editArticle.content || '');
        setCoverImageValue(editArticle.coverImage || '');
        setArticleType(editArticle.articleType || 'normal');
      } else {
        // 新增模式下重置表单并设置默认值
        form.resetFields();
        form.setFieldsValue({
          status: true,
          articleType: 'normal',
          isTop: false,
          isHot: false,
          isRecommend: false
        });
        setContent('');
        setCoverImageValue('');
        setArticleType('normal');
      }
    }
  }, [visible, isEditMode, editArticle, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 准备提交数据
      const formData = {
        ...values,
        content: content
      };

      let response;
      if (isEditMode && editArticle) {
        response = await articleService.updateArticle(editArticle.id.toString(), formData);
      } else {
        response = await articleService.createArticle(formData);
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
      title={isEditMode ? '编辑文章' : '新增文章'}
      open={visible}
      onCancel={handleCancel}
      width={1000}
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
        style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }} // 添加overflowX: 'hidden'防止横向滚动条
      >
        <Tabs 
          defaultActiveKey="1" 
          items={[
            {
              key: '1',
              label: '基本信息',
              children: (
                <>
                  {/* 左侧表单区域和右侧封面图片区域 */}
                  <Row gutter={[16, 12]} align="top">
                    {/* 左侧表单区域 */}
                    <Col span={16}>
                    {/* 标题和栏目 */}
                    <Row gutter={[16, 12]}>
                      <Col span={12}>
                        <Form.Item
                          name="title"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>文章标题</span>}
                          rules={[{ required: true, message: '请输入文章标题' }]}
                        >
                          <Input 
                            placeholder="请输入文章标题" 
                            style={{ borderRadius: '6px' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="categoryId"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>所属栏目</span>}
                          rules={[{ required: true, message: '请选择所属栏目' }]}
                        >
                          <TreeSelect
                            placeholder="请选择所属栏目"
                            style={{ width: '100%', borderRadius: '6px' }}
                            treeData={categoryTree}
                            allowClear
                            treeDefaultExpandAll
                            showSearch
                            treeNodeFilterProp="title"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 表单字段区域 */}
                    <Row gutter={[16, 12]}>
                      <Col span={6}>
                        <Form.Item
                          name="articleType"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>文章类型</span>}
                          rules={[{ required: true, message: '请选择文章类型' }]}
                        >
                          <Select 
                            onChange={(value) => setArticleType(value)}
                            style={{ borderRadius: '6px' }}
                          >
                            <Option value="normal">普通文章</Option>
                            <Option value="external">外链文章</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="authorName"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>作者名称</span>}
                        >
                          <Input 
                            placeholder="请输入作者名称" 
                            style={{ borderRadius: '6px' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="status"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>发布状态</span>}
                          valuePropName="checked"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                            <Switch 
                              checkedChildren="发布" 
                              unCheckedChildren="草稿" 
                            />
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="isTop"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>置顶</span>}
                          valuePropName="checked"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                            <Switch />
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 外链地址 */}
                    {articleType === 'external' && (
                      <Form.Item
                        name="externalUrl"
                        label={<span style={{ fontWeight: 500, color: '#262626' }}>外链地址</span>}
                        rules={[{ required: true, message: '请输入外链地址' }, { type: 'url', message: '请输入有效的URL地址' }]}
                      >
                        <Input 
                          placeholder="请输入文章外链地址" 
                          style={{ borderRadius: '6px' }}
                        />
                      </Form.Item>
                    )}

                    {/* 热门和推荐开关 */}
                    <Row gutter={[16, 12]}>
                      <Col span={6}>
                        <Form.Item
                          name="isHot"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>热门</span>}
                          valuePropName="checked"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                            <Switch />
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="isRecommend"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>推荐</span>}
                          valuePropName="checked"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                            <Switch />
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 发布时间 */}
                    <Row gutter={[16, 12]}>
                      <Col span={12}>
                        <Form.Item
                          name="publishAt"
                          label={<span style={{ fontWeight: 500, color: '#262626' }}>发布时间</span>}
                          tooltip="留空则使用当前时间"
                        >
                          <DatePicker 
                            showTime 
                            placeholder="请选择发布时间，不需要定时发布留空"
                            locale={locale}
                            style={{ width: '100%', borderRadius: '6px' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 文章摘要 */}
                    <Form.Item
                      name="summary"
                      label={<span style={{ fontWeight: 500, color: '#262626' }}>文章摘要</span>}
                    >
                      <Input.TextArea 
                        rows={3} 
                        placeholder="请输入文章摘要（可选）" 
                        style={{ borderRadius: '6px' }}
                      />
                    </Form.Item>
                  </Col>

                  {/* 右侧封面图片区域 */}
                  <Col span={8}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#262626', marginBottom: '8px' }}>
                      封面图片
                    </div>

                    {/* 封面图显示区域 - 调整内边距以容纳移除按钮 */}
                    <div style={{
                      border: '1px dashed #d9d9d9',
                      borderRadius: '8px',
                      padding: '24px 16px 16px 16px', // 增加顶部内边距
                      backgroundColor: '#fafafa',
                      transition: 'all 0.3s',
                      minHeight: '180px',
                      position: 'relative' // 添加相对定位作为参考
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
                              form.setFieldsValue({ coverImage: '' });
                              setCoverImageValue('');
                              form.resetFields(['coverImage']);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-16px', // 调整位置，避免超出容器
                              right: '8px', // 调整位置，避免超出容器
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
                            transition: 'all 0.3s',
                            borderRadius: '6px'
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
                            支持JPG、PNG、GIF格式，建议尺寸：800×400px
                          </div>
                        </Button>
                      )}
                    </div>

                    {/* 封面图片URL输入框 */}
                    <Form.Item
                      name="coverImage"
                      rules={[]}
                      style={{ marginTop: '16px' }}
                    >
                      <Input 
                        placeholder="也可直接输入封面图片URL地址" 
                        style={{ borderRadius: '6px' }}
                        onChange={(e) => {
                          setCoverImageValue(e.target.value);
                          form.setFieldsValue({ coverImage: e.target.value });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                </>
              )
            },
            {
              key: '2',
              label: '文章内容',
              children: (
                <Form.Item
                  name="content"
                  label="文章内容"
                  rules={[{ required: true, message: '请输入文章内容' }]}
                >
                  <WangEditor
                    value={content}
                    onChange={setContent}
                    useSourceMode={useSourceMode}
                    onSourceModeChange={setUseSourceMode}
                    height={400}
                    maxHeight={600}
                    maxLength={65535} // 从16383修改为65535，允许输入更多文字
                    placeholder="请输入文章内容"
                  />
                </Form.Item>
              ),
            },
            {
              key: '3',
              label: 'SEO设置',
              children: (
                <>
                  <Form.Item
                    name="seoTitle"
                    label="SEO标题"
                  >
                    <Input placeholder="请输入SEO标题" />
                  </Form.Item>

                  <Form.Item
                    name="seoKeywords"
                    label="SEO关键词"
                  >
                    <Input placeholder="请输入SEO关键词，多个用逗号分隔" />
                  </Form.Item>

                  <Form.Item
                    name="seoDescription"
                    label="SEO描述"
                  >
                    <Input.TextArea 
                      rows={3} 
                      placeholder="请输入SEO描述" 
                    />
                  </Form.Item>
                </>
              ),
            },
            {
              key: '4',
              label: '高级设置',
              children: (
                <>
                  <Form.Item
                    name="extra"
                    label="扩展属性"
                    tooltip="以JSON格式存储额外的配置信息"
                  >
                    <Input.TextArea 
                      rows={6} 
                      placeholder="请输入扩展属性（JSON格式）"
                      style={{ borderRadius: '6px' }}
                    />
                  </Form.Item>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', marginLeft: '16px' }}>
                    示例：{`{"color": "#ff6b6b", "icon": "category-icon"}`}
                  </div>
                </>
              ),
            },
          ]}
        />
      </Form>

      {/* 上传模态框 */}
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
    </Modal>
  );
};

export default ArticleEdit;