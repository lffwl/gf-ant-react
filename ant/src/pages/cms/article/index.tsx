import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, Card, Row, Col, Layout, Image, Tag, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { articleService } from '../../../services/articleService';
import type { ColumnsType } from 'antd/es/table';
import { PermissionAction } from '../../../utils/permission';
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
    status: 'all',
    articleType: 'all',
    isTop: 'all',
    isHot: 'all',
    isRecommend: 'all'
  });
  const [visible, setVisible] = useState(false);
  const [editArticle, setEditArticle] = useState<ArticleData | undefined>(undefined);
  
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
      width: '8%',
      render: (coverImage: string) => (
        coverImage ? (
          <Image
            width={60}
            height={40}
            src={coverImage}
            alt="封面图"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: 60, 
            height: 40, 
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
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '10%',
      render: (categoryName: string) => categoryName || '未分类',
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
      width: '6%',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      width: '6%',
      render: (isTop: boolean) => (
        <Tag color={isTop ? 'blue' : 'default'}>
          {isTop ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '热门',
      dataIndex: 'isHot',
      key: 'isHot',
      width: '6%',
      render: (isHot: boolean) => (
        <Tag color={isHot ? 'red' : 'default'}>
          {isHot ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '推荐',
      dataIndex: 'isRecommend',
      key: 'isRecommend',
      width: '6%',
      render: (isRecommend: boolean) => (
        <Tag color={isRecommend ? 'green' : 'default'}>
          {isRecommend ? '是' : '否'}
        </Tag>
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
      title: '操作',
      key: 'action',
      width: '14%',
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
        const { list, total } = response.data;
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
          updatedAt: item.updatedAt
        }));
        
        setArticleData(formattedData);
        setPagination(prev => ({
          ...prev,
          total: total || 0
        }));
      } else {
        // 如果响应不成功，设置空数据和0总数
        setArticleData([]);
        setPagination(prev => ({
          ...prev,
          total: 0
        }));
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      // 发生错误时也设置空数据
      setArticleData([]);
      setPagination(prev => ({
        ...prev,
        total: 0
      }));
    } finally {
      setLoading(false);
    }
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
      status: 'all',
      articleType: 'all',
      isTop: 'all',
      isHot: 'all',
      isRecommend: 'all'
    });
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
  };

   const handleEdit = (record: ArticleData) => {
     setEditArticle(record);
     setVisible(true);
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

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          {/* 搜索区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Input
                  placeholder="搜索文章标题"
                  value={searchParams.title}
                  onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
                  onPressEnter={handleSearch}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="文章状态"
                  value={searchParams.status}
                  onChange={(value) => setSearchParams({...searchParams, status: value})}
                  style={{ width: '100%' }}
                >
                  <Option value="all">全部状态</Option>
                  <Option value="1">已发布</Option>
                  <Option value="0">草稿</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="文章类型"
                  value={searchParams.articleType}
                  onChange={(value) => setSearchParams({...searchParams, articleType: value})}
                  style={{ width: '100%' }}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="normal">普通文章</Option>
                  <Option value="external">外链文章</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={handleSearch}
                >
                  搜索
                </Button>
                <Button 
                  style={{ marginLeft: 8 }}
                  onClick={handleReset}
                >
                  重置
                </Button>
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
          />
     </div>
   );
 };

export default ArticleList;