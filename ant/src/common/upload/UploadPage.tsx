import React, { useState, useCallback, useRef } from 'react';
import { Card, Upload, message, Button, Input, Space, Table, Tag, Empty, Modal, Tooltip } from 'antd';
import { InboxOutlined, SearchOutlined, DownloadOutlined, FileImageOutlined, FileTextOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { uploadService, FileInfo } from '../../services/uploadService';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Dragger } = Upload;

interface UploadPageProps {
  /** 业务类型，用于区分不同场景的文件上传 */
  bizType?: string;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 已选文件ID列表，用于回显 */
  selectedFileIds?: number[];
  /** 文件选择后的回调函数 */
  onFileSelect?: (files: FileInfo[]) => void;
  /** 弹窗模式，用于以弹窗形式展示 */
  modalMode?: boolean;
  /** 关闭弹窗的回调，仅在modalMode为true时有效 */
  onClose?: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({
  bizType = 'common',
  multiple = false,
  selectedFileIds = [],
  onFileSelect,
  modalMode = false,
  onClose
}) => {
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(selectedFileIds);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const confirmModalRef = useRef<any>(null);

  // 获取文件列表
  const fetchFileList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await uploadService.getFileList({
        bizType,
        fileName: searchText,
        page: currentPage,
        pageSize
      });
      
      if (response.code === 0 && response.data) {
        setFileList(response.data.list);
        setTotal(response.data.total);
      } else {
        message.error('获取文件列表失败');
        setFileList([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取文件列表失败:', error);
      message.error('获取文件列表失败');
    } finally {
      setLoading(false);
    }
  }, [bizType, searchText, currentPage]);

  // 组件挂载时获取文件列表
  React.useEffect(() => {
    fetchFileList();
  }, [fetchFileList]);

  // 选择文件变化时的回调
  const handleSelectionChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 搜索文件
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      // 上传前检查文件大小，限制10MB
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // 确保file参数正确传递
      if (!file) {
        onError?.(new Error('文件为空'));
        return;
      }
      
      // 安全地获取File对象
      let fileObj: File;
      if (typeof file === 'string') {
        fileObj = new File([], file);
      } else if ('originFileObj' in file && file.originFileObj) {
        fileObj = file.originFileObj as File;
      } else {
        fileObj = file as File;
      }
      
      const response = await uploadService.uploadFile({
        file: fileObj,
        bizType
      });
        
        if (response.code === 0) {
          onSuccess?.(response.data);
          message.success('文件上传成功');
          // 重新获取文件列表
          fetchFileList();
        } else {
          onError?.(new Error(response.message || '上传失败'));
        }
      } catch (error) {
        onError?.(error as any);
        message.error('文件上传失败');
      }
    },
    showUploadList: false,
    accept: '*/*'
  };

  // 查看文件
  const handleViewFile = (file: FileInfo) => {
    const fileUrl = uploadService.getFileUrl(file.fileNameStored);
    window.open(fileUrl, '_blank');
  };

  // 下载文件
  const handleDownloadFile = (file: FileInfo) => {
    const fileUrl = uploadService.getFileUrl(file.fileNameStored);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 确认选择文件
  const handleConfirmSelect = () => {
    const selectedFiles = fileList.filter(file => selectedRowKeys.includes(file.id));
    if (onFileSelect) {
      onFileSelect(selectedFiles);
    }
    if (modalMode && onClose) {
      onClose();
    }
  };

  // 获取文件图标
  const getFileIcon = (fileType: string) => {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('image')) return <FileImageOutlined style={{ color: '#1890ff' }} />;
    if (lowerType.includes('pdf')) return <FilePdfOutlined style={{ color: '#f5222d' }} />;
    if (lowerType.includes('excel') || lowerType.includes('spreadsheet')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (lowerType.includes('word') || lowerType.includes('document')) return <FileWordOutlined style={{ color: '#1890ff' }} />;
    return <FileTextOutlined style={{ color: '#faad14' }} />;
  };

  // 表格列定义
  const columns: ColumnsType<FileInfo> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text}>
          <Space style={{ cursor: 'pointer' }} onClick={() => handleViewFile(record)}>
            {getFileIcon(record.fileType)}
            <span>{text}</span>
          </Space>
        </Tooltip>
      )
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
      ellipsis: true,
      render: (text) => <Tag>{text}</Tag>
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
      }
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadFile(record)}
          size="small"
        >
          下载
        </Button>
      )
    }
  ];

  // 选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectionChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE
    ],
    ...(multiple ? {} : { hideDefaultSelections: true })
  };

  // 弹窗模式下的确认按钮
  const renderFooter = () => {
    if (!modalMode) return null;
    return (
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>取消</Button>
        <Button type="primary" onClick={handleConfirmSelect}>
          确认选择
        </Button>
      </div>
    );
  };

  return (
    <>
      <Card
        title={modalMode ? '选择文件' : '文件上传'}
        extra={modalMode && (
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => confirmModalRef.current?.show()}>
            <CheckCircleOutlined /> 已选择 {selectedRowKeys.length} 个文件
          </span>
        )}
      >
        {/* 上传区域 */}
        <Card size="small" title="上传新文件" style={{ marginBottom: 16 }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持单个文件上传，最大10MB</p>
          </Dragger>
        </Card>

        {/* 文件列表 */}
        <Card size="small" title="文件列表">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Search
              placeholder="搜索文件名"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={fileList}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `共 ${total} 个文件`
            }}
            locale={{
              emptyText: <Empty description="暂无文件" />
            }}
            scroll={{ x: 'max-content' }}
          />
        </Card>

        {/* 确认选择区域 */}
        {renderFooter()}
      </Card>

      {/* 确认选择弹窗，用于展示已选文件 */}
      <Modal
        title="已选择文件"
        open={false}
        footer={null}
        width={600}
        onCancel={() => confirmModalRef.current?.close()}
        getContainer={() => document.body}
      >
        {selectedRowKeys.length > 0 ? (
          <div>
            {fileList
              .filter(file => selectedRowKeys.includes(file.id))
              .map(file => (
                <div key={file.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  {getFileIcon(file.fileType)}
                  <span style={{ marginLeft: 8, flex: 1 }}>{file.fileName}</span>
                  <Button type="text" size="small" onClick={() => handleDownloadFile(file)}>
                    下载
                  </Button>
                </div>
              ))
            }
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button onClick={() => confirmModalRef.current?.close()} style={{ marginRight: 8 }}>取消</Button>
              <Button type="primary" onClick={handleConfirmSelect}>
                确认选择
              </Button>
            </div>
          </div>
        ) : (
          <Empty description="暂无选择的文件" />
        )}
      </Modal>
    </>
  );
};

export default UploadPage;