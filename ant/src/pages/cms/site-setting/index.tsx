import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, Card, Row, Col, Input, Select, Layout } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { siteSettingService } from '../../../services/siteSettingService';
import type { ColumnsType } from 'antd/es/table';
import { usePermission } from '../../../utils/permission';
import SiteSettingEdit from './edit';

const { Content } = Layout;

interface SiteSettingData {
  key: number;
  id: number;
  settingKey: string;
  settingValue: string;
  valueType: string;
  group: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const SiteSettingList: React.FC = () => {
  const [siteSettingData, setSiteSettingData] = useState<SiteSettingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    group: undefined,
    key: '',
    page: 1,
    size: 10
  });
  const [visible, setVisible] = useState(false);
  const [editSetting, setEditSetting] = useState<SiteSettingData | undefined>(undefined);
  
  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  // 配置分组选项
  const groupOptions = [
    { label: '通用设置', value: 'general' },
    { label: 'SEO设置', value: 'seo' },
    { label: '邮箱设置', value: 'email' },
    { label: '社交设置', value: 'social' },
    { label: '安全设置', value: 'security' },
  ];

  // 获取权限
  const hasCreatePermission = usePermission('sys.cms.site_setting.create');
  const hasUpdatePermission = usePermission('sys.cms.site_setting.update');
  const hasDeletePermission = usePermission('sys.cms.site_setting.delete');

  // 获取网站设置列表
  const fetchSiteSettingList = async () => {
    setLoading(true);
    try {
      const response = await siteSettingService.getSiteSettingList(searchParams);
      if (response.code === 0 && response.data && response.data.list) {
        const formattedData = response.data.list.map((item: any, index: number) => ({
          key: index,
          id: item.id,
          settingKey: item.settingKey,
          settingValue: item.settingValue,
          valueType: item.valueType,
          group: item.group,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setSiteSettingData(formattedData);
        // 确保response.data不为undefined后再访问其属性
        const data = response.data;
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
          current: data.page || 1,
          pageSize: data.size || 10
        }));
      }
    } catch (error) {
      console.error('获取网站设置列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除网站设置
  const handleDelete = async (id: number) => {
    try {
      const response = await siteSettingService.deleteSiteSetting(id.toString());
      if (response.code === 0) {
        fetchSiteSettingList();
      }
    } catch (error) {
      console.error('删除网站设置失败:', error);
    }
  };

  // 打开编辑对话框
  const handleEdit = (setting: SiteSettingData) => {
    setEditSetting(setting);
    setVisible(true);
  };

  // 打开新增对话框
  const handleAdd = () => {
    setEditSetting(undefined);
    setVisible(true);
  };

  // 处理搜索
  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      group: undefined,
      key: '',
      page: 1,
      size: 10
    });
  };

  // 处理分页变化
  const handlePaginationChange = (page: number, pageSize: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
      size: pageSize
    }));
  };

  // 当对话框关闭并成功时刷新列表
  const handleSuccess = () => {
    setVisible(false);
    fetchSiteSettingList();
  };

  // 获取配置分组显示名称
  const getGroupLabel = (group: string) => {
    const option = groupOptions.find(opt => opt.value === group);
    return option ? option.label : group;
  };

  // 获取值类型显示名称
  const getValueLabel = (valueType: string) => {
    const typeMap: Record<string, string> = {
      'text': '文本',
      'number': '数字',
      'boolean': '布尔值',
      'json': 'JSON',
      'html': 'HTML'
    };
    return typeMap[valueType] || valueType;
  };

  const columns: ColumnsType<SiteSettingData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '6%',
    },
    {
      title: '配置项键名',
      dataIndex: 'settingKey',
      key: 'settingKey',
      ellipsis: true,
    },
    {
      title: '配置项值',
      dataIndex: 'settingValue',
      key: 'settingValue',
      ellipsis: true,
      render: (value: string) => {
        // 限制显示长度
        if (value.length > 50) {
          return `${value.substring(0, 50)}...`;
        }
        return value;
      }
    },
    {
      title: '值类型',
      dataIndex: 'valueType',
      key: 'valueType',
      width: '10%',
      render: (valueType: string) => getValueLabel(valueType)
    },
    {
      title: '配置分组',
      dataIndex: 'group',
      key: 'group',
      width: '10%',
      render: (group: string) => getGroupLabel(group)
    },
    {
      title: '配置项说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          {hasUpdatePermission && (
            <Button size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          )}
          {hasDeletePermission && (
            <Popconfirm
              title="确定要删除这个配置项吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button size="small" danger>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 监听搜索参数变化，重新获取数据
  useEffect(() => {
    const currentQueryParams = JSON.stringify(searchParams);
    if (currentQueryParams !== prevQueryParamsRef.current) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchSiteSettingList();
    }
  }, [searchParams]);

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          {/* 搜索区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '100px', textAlign: 'right' }}>配置分组：</span>
                  <Select
                    placeholder="请选择配置分组"
                    allowClear
                    style={{ flex: 1 }}
                    value={searchParams.group}
                    onChange={(value) => setSearchParams(prev => ({ ...prev, group: value }))}
                  >
                    {groupOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', color: '#595959', fontSize: '14px', width: '100px', textAlign: 'right' }}>配置项键名：</span>
                  <Input
                    placeholder="请输入配置项键名"
                    allowClear
                    value={searchParams.key}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, key: e.target.value }))}
                    onPressEnter={handleSearch}
                    style={{ flex: 1 }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '108px' }}>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    style={{ marginRight: 8 }}
                  >
                    搜索
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 表格区域 */}
          <Card>
            {hasCreatePermission && (
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                  >
                    新增
                  </Button>
                </Col>
              </Row>
            )}
            
            <Table
              columns={columns}
              dataSource={siteSettingData}
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
                onChange: handlePaginationChange,
                onShowSizeChange: handlePaginationChange
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Content>
      </Layout>
      
      <SiteSettingEdit
        visible={visible}
        onCancel={() => setVisible(false)}
        onSuccess={handleSuccess}
        editSetting={editSetting}
      />
    </div>
  );
};

export default SiteSettingList;