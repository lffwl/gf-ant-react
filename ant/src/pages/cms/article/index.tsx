import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, Card, Row, Col, Layout, Image, Tag, Input, Select, TreeSelect, Switch } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { articleService } from '../../../services/articleService';
import type { ColumnsType } from 'antd/es/table';
import { PermissionAction, usePermission } from '../../../utils/permission';
import ArticleEdit from './edit';

const { Content } = Layout;
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
  content?: string; // 确保接口包含content字段
  // 添加SEO相关字段
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

const ArticleList: React.FC = () => {
  const [articleData, setArticleData] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    title: '',
    categoryId: undefined,
    status: undefined,
    articleType: undefined,
    isTop: undefined,
    isHot: undefined,
    isRecommend: undefined,
  });
  
  // 控制是否显示高级搜索条件
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editArticle, setEditArticle] = useState<ArticleData | undefined>(undefined);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  // 新增：存储原始栏目列表数据
  const [categoryList, setCategoryList] = useState<any[]>([]);
  
  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  const columns: ColumnsType<ArticleData> = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'id',
      width: '6%',
    },
    {
      title: '封面图',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 120,
      render: (coverImage: string) => (
        coverImage ? (
          <Image
            width={100}
            height={67}
            src={`${import.meta.env.VITE_FILE_SERVER_URL}/${coverImage}`}
            alt="封面图"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: 100, 
            height: 67,
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#999'
          }}>
            无封面
          </div>
        )
      ),
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '栏目',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: '10%',
      render: (categoryId: number) => {
        // 从categoryList中查找对应id的栏目名称
        if (!categoryId) return '未分类';
        
        const category = categoryList.find(item => item.id === categoryId);
        return category ? category.name : '未分类';
      },
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: '8%',
      render: (authorName: string) => authorName || '未知',
    },
    {
      title: '类型',
      dataIndex: 'articleType',
      key: 'articleType',
      width: '8%',
      render: (articleType: string) => (
        <Tag color={articleType === 'normal' ? 'blue' : 'orange'}>
          {articleType === 'normal' ? '普通' : '外链'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: boolean, record: ArticleData) => (
        <Switch
          checked={status}
          checkedChildren="已发布"
          unCheckedChildren="草稿"
          onChange={(checked) => hasUpdatePermission && handleStatusChange(record.id, checked)}
          disabled={!hasUpdatePermission}
          style={{ marginBottom: 4 }}
        />
      ),
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      width: '6%',
      render: (isTop: boolean, record: ArticleData) => (
        <Switch
          checked={isTop}
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={(checked) => hasUpdatePermission && handleTopStatusChange(record.id, checked)}
          disabled={!hasUpdatePermission}
          style={{ marginBottom: 4 }}
        />
      ),
    },
    {
      title: '热门',
      dataIndex: 'isHot',
      key: 'isHot',
      width: '6%',
      render: (isHot: boolean, record: ArticleData) => (
        <Switch
          checked={isHot}
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={(checked) => hasUpdatePermission && handleHotStatusChange(record.id, checked)}
          disabled={!hasUpdatePermission}
          style={{ marginBottom: 4 }}
        />
      ),
    },
    {
      title: '推荐',
      dataIndex: 'isRecommend',
      key: 'isRecommend',
      width: '6%',
      render: (isRecommend: boolean, record: ArticleData) => (
        <Switch
          checked={isRecommend}
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={(checked) => hasUpdatePermission && handleRecommendStatusChange(record.id, checked)}
          disabled={!hasUpdatePermission}
          style={{ marginBottom: 4 }}
        />
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '8%',
      render: (viewCount: number) => viewCount || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (createdAt: string) => createdAt || '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '15%',
      render: (updatedAt: string) => updatedAt || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: '14%',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <PermissionAction permission="sys.cms.article.update">
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </PermissionAction>
          <PermissionAction permission="sys.cms.article.delete">
            <Popconfirm
              title="确认删除"
              description={`确认要删除标题为"${record.title}"的文章吗？`}
              onConfirm={() => handleDelete(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </PermissionAction>
        </Space>
      ),
    },
  ];

  // 初始加载文章数据
  useEffect(() => {
    fetchArticleList();
  }, [pagination.current, pagination.pageSize]);

  const fetchArticleList = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        ...searchParams
      };
      
      const response = await articleService.getArticleList(params);
      if (response.code === 0 && response.data) {
        const { list, total, config } = response.data;
        // 处理list为null或undefined的情况
        const formattedData = (list || []).map((item: any) => ({
          key: item.id,
          id: item.id,
          title: item.title,
          summary: item.summary,
          coverImage: item.coverImage,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          authorName: item.authorName,
          articleType: item.articleType,
          status: item.status,
          isTop: item.isTop,
          isHot: item.isHot,
          isRecommend: item.isRecommend,
          viewCount: item.viewCount,
          publishAt: item.publishAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          // 这里不包含content字段，因为列表数据通常不包含完整内容
        }));
        
        setArticleData(formattedData);
        setPagination(prev => ({
          ...prev,
          total: total || 0
        }));
        
        // 处理栏目数据并转换为树形结构
        if (config && config.categoryList) {
          // 保存原始栏目列表数据
          setCategoryList(config.categoryList);
          const treeData = transformToTree(config.categoryList);
          setCategoryTree(treeData);
        }
      } else {
        // 如果响应不成功，设置空数据和0总数
        setArticleData([]);
        setCategoryList([]);
        setPagination(prev => ({
          ...prev,
          total: 0
        }));
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      // 发生错误时也设置空数据
      setArticleData([]);
      setCategoryList([]);
      setPagination(prev => ({
        ...prev,
        total: 0
      }));
    } finally {
      setLoading(false);
    }
  };
  
  // 将平面栏目数据转换为树形结构
  const transformToTree = (categories: any[]): any[] => {
    const categoryMap = new Map<number, any>();
    const tree: any[] = [];
    
    // 创建所有节点的映射
    categories.forEach(category => {
      categoryMap.set(category.id, {
        value: category.id,
        title: category.name,
        children: []
      });
    });
    
    // 构建树形结构
    categories.forEach(category => {
      const currentNode = categoryMap.get(category.id);
      
      if (category.parentId === 0) {
        // 根节点
        tree.push(currentNode);
      } else {
        // 子节点
        const parentNode = categoryMap.get(category.parentId);
        if (parentNode) {
          parentNode.children.push(currentNode);
        } else {
          // 如果父节点不存在，也添加到根节点
          tree.push(currentNode);
        }
      }
    });
    
    return tree;
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: newPagination.total
    });
  };

  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchArticleList();
  };

  const handleReset = () => {
    setSearchParams({
      title: '',
      categoryId: undefined,
      status: undefined,
      articleType: undefined,
      isTop: undefined,
      isHot: undefined,
      isRecommend: undefined
    });
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
  };

   // 修改handleEdit函数，在编辑时获取文章的完整数据（包含内容）
   const handleEdit = async (record: ArticleData) => {
     try {
       // 获取文章的完整数据
       const response = await articleService.getArticleDetail(record.id.toString());
       if (response.code === 0 && response.data) {
         // 设置包含完整内容的文章数据
         setEditArticle({
           key: response.data.id,
           id: response.data.id,
           title: response.data.title,
           summary: response.data.summary,
           coverImage: response.data.coverImage,
           categoryId: response.data.categoryId,
           categoryName: response.data.categoryName,
           authorName: response.data.authorName,
           articleType: response.data.articleType,
           status: response.data.status,
           isTop: response.data.isTop,
           isHot: response.data.isHot,
           isRecommend: response.data.isRecommend,
           viewCount: response.data.viewCount,
           publishAt: response.data.publishAt,
           createdAt: response.data.createdAt,
           updatedAt: response.data.updatedAt,
           content: response.data.content || '', // 确保content字段存在
           // 为SEO字段提供默认空字符串值，确保表单正确显示
           seoTitle: response.data.seoTitle || '',
           seoKeywords: response.data.seoKeywords || '',
           seoDescription: response.data.seoDescription || '',
         });
       } else {
         // 如果获取失败，使用列表中的数据（不包含完整内容）
         setEditArticle(record);
         console.warn('获取文章详情失败，使用列表数据');
       }
     } catch (error) {
       console.error('获取文章详情失败:', error);
       // 发生错误时，使用列表中的数据
       setEditArticle(record);
     } finally {
       setVisible(true);
     }
   };
 
   const handleDelete = async (record: ArticleData) => {
     try {
       await articleService.deleteArticle(record.id.toString());
       // 删除后重新加载数据
       const currentQueryParams = JSON.stringify({ action: 'delete', recordId: record.id });
       if (prevQueryParamsRef.current !== currentQueryParams) {
         prevQueryParamsRef.current = currentQueryParams;
         fetchArticleList();
       }
     } catch (error) {
       console.error('删除文章失败:', error);
     }
   };
 
   const handleCreate = () => {
     setEditArticle(undefined);
     setVisible(true);
   };
 
   const handleCancel = () => {
     setVisible(false);
     setEditArticle(undefined);
   };
 
   const handleSuccess = () => {
    setVisible(false);
    setEditArticle(undefined);
    fetchArticleList();
  };

  // 处理文章状态开关切换
  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      await articleService.updateArticleStatus(id.toString(), checked);
      // 更新成功后重新加载数据
      fetchArticleList();
    } catch (error) {
      console.error('更新文章状态失败:', error);
    }
  };

  // 处理文章置顶状态开关切换
  const handleTopStatusChange = async (id: number, checked: boolean) => {
    try {
      await articleService.updateArticleTopStatus(id.toString(), checked);
      // 更新成功后重新加载数据
      fetchArticleList();
    } catch (error) {
      console.error('更新文章置顶状态失败:', error);
    }
  };

  // 处理文章热门状态开关切换
  const handleHotStatusChange = async (id: number, checked: boolean) => {
    try {
      await articleService.updateArticleHotStatus(id.toString(), checked);
      // 更新成功后重新加载数据
      fetchArticleList();
    } catch (error) {
      console.error('更新文章热门状态失败:', error);
    }
  };

  // 处理文章推荐状态开关切换
  const handleRecommendStatusChange = async (id: number, checked: boolean) => {
    try {
      await articleService.updateArticleRecommendStatus(id.toString(), checked);
      // 更新成功后重新加载数据
      fetchArticleList();
    } catch (error) {
      console.error('更新文章推荐状态失败:', error);
    }
  };

  // 获取更新文章的权限状态
  const hasUpdatePermission = usePermission('sys.cms.article.update');

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          {/* 搜索区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>文章标题：</span>
                  <Input
                    placeholder="搜索文章标题"
                    value={searchParams.title}
                    onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
                    onPressEnter={handleSearch}
                    style={{ flex: 1 }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>文章栏目：</span>
                  <TreeSelect
                    placeholder="选择栏目"
                    style={{ flex: 1 }}
                    treeData={categoryTree}
                    allowClear
                    value={searchParams.categoryId}
                    onChange={(value) => setSearchParams({...searchParams, categoryId: value})}
                    treeDefaultExpandAll
                    showSearch
                    treeNodeFilterProp="title"
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>文章状态：</span>
                  <Select
                    placeholder="文章状态"
                    value={searchParams.status}
                    onChange={(value) => setSearchParams({...searchParams, status: value})}
                    style={{ flex: 1 }}
                    allowClear
                  >
                    <Option value="1">已发布</Option>
                    <Option value="0">草稿</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '88px' }}>
                  <Button 
                    type="dashed" 
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    style={{ marginRight: 8 }}
                  >
                    {showAdvancedSearch ? '收起高级搜索' : '展开高级搜索'}
                  </Button>
                </div>
              </Col>
            </Row>
            
            {/* 高级搜索条件，默认隐藏 */}
            {showAdvancedSearch && (
              <>
                <Row gutter={16} align="middle" style={{ marginTop: 16 }}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>文章类型：</span>
                      <Select
                        placeholder="文章类型"
                        value={searchParams.articleType}
                        onChange={(value) => setSearchParams({...searchParams, articleType: value})}
                        style={{ flex: 1 }}
                        allowClear
                      >
                        <Option value="normal">普通文章</Option>
                        <Option value="external">外链文章</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>是否置顶：</span>
                      <Select
                        placeholder="是否置顶"
                        value={searchParams.isTop}
                        onChange={(value) => setSearchParams({...searchParams, isTop: value})}
                        style={{ flex: 1 }}
                        allowClear
                      >
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>是否热门：</span>
                      <Select
                        placeholder="是否热门"
                        value={searchParams.isHot}
                        onChange={(value) => setSearchParams({...searchParams, isHot: value})}
                        style={{ flex: 1 }}
                        allowClear
                      >
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '80px', textAlign: 'right' }}>是否推荐：</span>
                      <Select
                        placeholder="是否推荐"
                        value={searchParams.isRecommend}
                        onChange={(value) => setSearchParams({...searchParams, isRecommend: value})}
                        style={{ flex: 1 }}
                        allowClear
                      >
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>
                    </div>
                  </Col>
                </Row>
              </>
            )}
            
            {/* 搜索和重置按钮 */}
            <Row gutter={16} align="middle" style={{ marginTop: 16 }}>
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '88px' }}>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={handleSearch}
                    style={{ marginRight: 8 }}
                  >
                    搜索
                  </Button>
                  <Button 
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 表格区域 */}
          <Card>
            <PermissionAction permission="sys.cms.article.create">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                  >
                    新增文章
                  </Button>
                </Col>
              </Row>
            </PermissionAction>

            <Table
              columns={columns}
              dataSource={articleData}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
              }}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: 1500 }}
            />
          </Card>
        </Content>
      </Layout>
       <ArticleEdit
            visible={visible}
            editArticle={editArticle}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
            categoryTree={categoryTree}
          />
     </div>
   );
 };

export default ArticleList;