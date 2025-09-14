import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'antd';
import { Layout } from 'antd';
const { Content } = Layout;
import { apiService } from '../../../services/apiService';
import ApiList from './ApiList';
import ApiEdit from './ApiEdit';

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

const ApiManagementMain: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ApiData | null>(null);
  const [form] = Form.useForm();
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  
  // 使用ref来跟踪上一次的查询参数
  const prevQueryParamsRef = useRef<string>('');

  // 初始加载API数据
  useEffect(() => {
    // 将当前查询参数序列化为字符串进行比较
    const currentQueryParams = JSON.stringify({ action: 'initialLoad' });
    
    // 只有当查询参数真正发生变化时才调用接口
    if (prevQueryParamsRef.current !== currentQueryParams) {
      prevQueryParamsRef.current = currentQueryParams;
      fetchApiTree();
    }
  }, []);

  const handleEdit = (record: ApiData) => {
    setEditingRecord(record);
    form.setFieldsValue({
      parentId: record.parentId === 0 ? undefined : record.parentId,
      name: record.name,
      permissionCode: record.permissionCode,
      url: record.path,
      method: record.method,
      sort: record.sort,
      status: record.status === 1,
      isMenu: record.isMenu === 1,
      description: record.description
    });
    setDrawerVisible(true);
  };

  const handleDelete = async (record: ApiData) => {
    try {
      await apiService.deleteApi(record.key.toString());
      // 删除后重新加载数据
      const currentQueryParams = JSON.stringify({ action: 'delete', recordId: record.key });
      if (prevQueryParamsRef.current !== currentQueryParams) {
        prevQueryParamsRef.current = currentQueryParams;
        fetchApiTree();
      }
    } catch (error) {
      // 错误处理已经在apiService中完成
    }
  };

  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleClose = () => {
    setDrawerVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        await apiService.updateApi(editingRecord.key.toString(), values);
      } else {
        await apiService.createApi(values);
      }
      handleClose();
      // 提交表单后重新加载数据
      const currentQueryParams = JSON.stringify({ 
        action: editingRecord ? 'update' : 'create', 
        recordId: editingRecord?.key 
      });
      if (prevQueryParamsRef.current !== currentQueryParams) {
        prevQueryParamsRef.current = currentQueryParams;
        fetchApiTree();
      }
    } catch (error) {
      // 错误处理已经在apiService中完成
    }
  };

  const fetchApiTree = async () => {
    setLoading(true);
    try {
      const response = await apiService.getApiTree();
      if (response.code === 0 && response.data && response.data.list) {
        console.log('后端返回的API树形数据:', response.data.list);
        // 转换后端返回的树形结构数据为前端需要的格式
        const transformApiData = (data: any[]): ApiData[] => {
          return data.map(item => ({
            key: item.id || item.key,
            parentId: item.parentId || 0,
            name: item.name,
            path: item.url,
            method: item.method,
            permissionCode: item.permissionCode || '',
            isMenu: item.isMenu || 0,
            status: item.status || 1,
            sort: item.sort || 0,
            description: item.description || '',
            children: item.children ? transformApiData(item.children) : undefined
          }));
        };
        const transformedData = transformApiData(response.data.list);
        console.log('转换后的表格数据:', transformedData);
        setApiData(transformedData);
        // 递归获取所有节点的key，实现N级展开
        const getAllKeys = (data: ApiData[]): React.Key[] => {
          let keys: React.Key[] = [];
          data.forEach(item => {
            keys.push(item.key);
            if (item.children && item.children.length > 0) {
              keys = keys.concat(getAllKeys(item.children));
            }
          });
          return keys;
        };
        setExpandedRowKeys(getAllKeys(transformedData));
      }
    } catch (error) {
      // 错误处理已经在apiService中完成
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Layout>
        <Content style={{ padding: '10px 0' }}>
          <ApiList
            apiData={apiData}
            loading={loading}
            expandedRowKeys={expandedRowKeys}
            setExpandedRowKeys={setExpandedRowKeys}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </Content>
        <ApiEdit
          visible={drawerVisible}
          editingRecord={editingRecord}
          apiData={apiData}
          onClose={handleClose}
          onSubmit={handleSubmit}
          form={form}
        />
      </Layout>
    </div>
  );
};

export default ApiManagementMain;