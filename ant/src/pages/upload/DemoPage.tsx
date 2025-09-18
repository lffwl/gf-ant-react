import React, { useState } from 'react';
import { Card, Button, message, Tag, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import UploadPage from '../../common/upload/UploadPage';
import type { FileInfo } from '../../services/uploadService';
import type { ColumnsType } from 'antd/es/table';

const DemoPage: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);

  // 打开上传弹窗
  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  // 关闭上传弹窗
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  // 处理文件选择
  const handleFileSelect = (files: FileInfo[]) => {
    setSelectedFiles(files);
    message.success(`已选择 ${files.length} 个文件`);
  };

  // 移除已选文件
  const handleRemoveFile = (fileId: number) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // 表格列定义
  const columns: ColumnsType<FileInfo> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          onClick={() => handleRemoveFile(record.id)}
        >
          移除
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="文件上传组件演示" extra={
        <Button type="primary" icon={<UploadOutlined />} onClick={handleOpenUploadModal}>
          上传文件
        </Button>
      }>
        <p style={{ marginBottom: 16 }}>本页面展示了文件上传组件的使用方式，您可以上传新文件或选择已有文件。</p>
        
        {/* 已选文件列表 */}
        {selectedFiles.length > 0 && (
          <Card size="small" title="已选文件" style={{ marginBottom: 16 }}>
            <Table
              columns={columns}
              dataSource={selectedFiles}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: '暂无选择的文件'
              }}
            />
          </Card>
        )}
        
        {/* 嵌入方式展示上传组件 */}
        <Card size="small" title="嵌入方式上传组件" style={{ marginTop: 16 }}>
          <UploadPage 
            bizType="demo"
            multiple={false}
            onFileSelect={handleFileSelect}
          />
        </Card>
      </Card>
      
      {/* 弹窗方式展示上传组件 */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 24
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 8,
            width: '100%',
            maxWidth: 900,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <UploadPage 
              bizType="demo"
              multiple={false}
              modalMode={true}
              onFileSelect={handleFileSelect}
              onClose={handleCloseUploadModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;