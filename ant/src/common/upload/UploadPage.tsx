import React, { useState, useCallback, useRef } from 'react';
import { Card, Upload, message, Button, Input, Empty, Modal, Tooltip, Image } from 'antd';
import { InboxOutlined, SearchOutlined, DownloadOutlined, FileImageOutlined, FileTextOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { uploadService, FileInfo } from '../../services/uploadService';

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
  bizType = '',
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
  const pageSize = 12;
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
        // 确保fileList始终是一个数组，即使list为null
        setFileList(response.data.list || []);
        setTotal(response.data.total || 0);
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
    // 根据multiple参数决定是单选还是多选
    if (!multiple && newSelectedRowKeys.length > 1) {
      // 如果是单选模式且选择了多个，只保留最后一个选择
      setSelectedRowKeys([newSelectedRowKeys[newSelectedRowKeys.length - 1]]);
    } else {
      setSelectedRowKeys(newSelectedRowKeys);
    }
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
    multiple: true, // 支持多文件上传
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
            // message.success('文件上传成功');
            // 重新获取文件列表
            fetchFileList();
          } 
      } catch (error) {
        onError?.(error as any);
        message.error('文件上传失败');
      }
    },
    // 对于多文件上传的额外配置
    onDrop: (e) => {
      // 处理拖拽上传的文件列表
      if (e.dataTransfer.files && e.dataTransfer.files.length > 10) {
        message.warning('一次最多上传10个文件');
        // 返回false可以阻止上传超过限制的文件
        return false;
      }
    },
    showUploadList: false,
    accept: '*/*'
  };

  // 查看文件 - 直接在图片上显示预览
  const handleViewFile = (file: FileInfo) => {
    const fileUrl = uploadService.getFileUrl(file.storagePath);
    const fileType = file.fileType.toLowerCase();
    
    // 对于不同类型的文件使用不同的预览方式
    if (fileType.includes('image')) {
      // 图片类型使用新标签页打开预览
      window.open(fileUrl, '_blank');
    } else if (fileType.includes('video') || fileType.includes('audio') || fileType.includes('pdf')) {
      // 视频、音频和PDF使用新标签页打开
      window.open(fileUrl, '_blank');
    } else {
      // 其他文件类型提示下载
      message.info('此文件类型不支持预览，请下载查看');
    }
  };

  // 下载文件
  const handleDownloadFile = (file: FileInfo) => {
    try {
      const fileUrl = uploadService.getFileUrl(file.storagePath);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.fileName;
      link.target = '_blank'; // 在新标签页打开，避免当前页面跳转
      link.rel = 'noopener noreferrer'; // 增强安全性
      
      // 对于某些文件类型，可能需要设置MIME类型来确保正确下载
      const fileType = file.fileType.toLowerCase();
      if (fileType.includes('pdf')) {
        link.type = 'application/pdf';
      } else if (fileType.includes('excel')) {
        link.type = 'application/vnd.ms-excel';
      } else if (fileType.includes('word')) {
        link.type = 'application/msword';
      }
      
      document.body.appendChild(link);
      link.click();
      
      // 使用setTimeout确保在移除前完成点击事件
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('文件下载失败:', error);
      message.error('文件下载失败，请稍后重试');
    }
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

  // 弹窗模式下的确认按钮
  const renderFooter = () => {
    if (!modalMode) return null;
    return (
      <div style={{ 
        textAlign: 'right', 
        marginTop: 16,
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#fff',
        padding: '16px 0',
        borderTop: '1px solid #f0f0f0',
        zIndex: 100 // 确保按钮浮层在最上层
      }}>
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
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

        {/* 内容区域容器 - 限制高度并添加滚动条 */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          marginBottom: '16px'
        }}>

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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              加载中...
            </div>
          ) : fileList.length === 0 ? (
            <Empty description="暂无文件" />
          ) : (
            <div>
              {/* 图片网格布局 - 更紧凑版本 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {fileList.map(file => {
                  const isSelected = selectedRowKeys.includes(file.id);
                  const fileUrl = uploadService.getFileUrl(file.storagePath);
                  const isImage = file.fileType.toLowerCase().includes('image');
                  
                  return (
                    <div 
                      key={file.id} 
                      style={{
                        border: `2px solid ${isSelected ? '#1890ff' : '#f0f0f0'}`,
                        borderRadius: '4px',
                        padding: '4px',
                        position: 'relative',
                        backgroundColor: '#fff',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        if (modalMode) {
                          // 弹窗模式下点击切换选择状态
                          if (multiple) {
                            // 允许多选
                            if (isSelected) {
                              handleSelectionChange(selectedRowKeys.filter(key => key !== file.id));
                            } else {
                              handleSelectionChange([...selectedRowKeys, file.id]);
                            }
                          } else {
                            // 不允许多选，直接替换
                            handleSelectionChange([file.id]);
                          }
                        } else {
                          // 非弹窗模式下点击预览
                          handleViewFile(file);
                        }
                      }}
                    >
                      {/* 选择状态 */}
                      {modalMode && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? '#1890ff' : '#fff',
                            border: `2px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10 // 确保选择勾选浮层低于按钮浮层
                          }}
                        >
                          {isSelected && (
                            <CheckCircleOutlined style={{ color: '#fff', fontSize: '14px' }} />
                          )}
                        </div>
                      )}
                       
                      {/* 文件预览区域 */}
                      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {isImage ? (
                          <Image
                            src={fileUrl}
                            alt={file.fileName}
                            style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                            preview={false}
                            // 移除预览功能，让点击事件冒泡到父级div触发选择逻辑
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1+QK//t3vR8a6/Wt4Nwv7WpemOA7TiVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg=="
                          />
                        ) : (
                          <div style={{ width: '100%', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                            {getFileIcon(file.fileType)}
                          </div>
                        )}
                      </div>
                       
                      {/* 文件名 */}
                      <Tooltip title={file.fileName}>
                        <div style={{ textAlign: 'center', wordBreak: 'break-all' }}>
                          {file.fileName}
                        </div>
                      </Tooltip>
                       
                      {/* 操作按钮 */}
                      <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                        <Button
                          type="text"
                          icon={<SearchOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewFile(file);
                          }}
                          size="small"
                        >
                          预览
                        </Button>
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(file);
                          }}
                          size="small"
                        >
                          下载
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
               
              {/* 分页 */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button 
                  disabled={currentPage === 1 || total === 0} 
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  上一页
                </Button>
                <span style={{ margin: '0 16px' }}>第 {total === 0 ? 0 : currentPage} 页 / 共 {total === 0 ? 0 : Math.ceil(total / pageSize)} 页</span>
                <Button 
                  disabled={currentPage === Math.ceil(total / pageSize) || total === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  下一页
                </Button>
                <span style={{ marginLeft: '16px' }}>共 {total} 个文件</span>
              </div>
            </div>
          )}
        </Card>
      </div>

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
          <div style={{ maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            {/* 文件列表内容区 - 可滚动 */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
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
            </div>
            {/* 按钮区域 - 固定在底部 */}
            <div style={{ 
              textAlign: 'right', 
              paddingTop: '16px',
              borderTop: '1px solid #f0f0f0'
            }}>
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