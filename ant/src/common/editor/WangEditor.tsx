import React, { useRef, useEffect, useState } from 'react';
import wangEditor from 'wangeditor';
import { message } from 'antd';
import { uploadService } from '../../services/uploadService';

interface WangEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  maxHeight?: number;
  maxLength?: number; // 最大字数限制
  bizType?: string; // 业务类型，用于文件上传分类
  useSourceMode?: boolean; // 是否使用源码模式
  onSourceModeChange?: (useSourceMode: boolean) => void; // 源码模式切换回调
}

const WangEditor: React.FC<WangEditorProps> = React.forwardRef<HTMLDivElement, WangEditorProps>(({
  value,
  onChange,
  placeholder = '请输入内容...',
  disabled = false,
  height = 300,
  maxHeight,
  maxLength,
  bizType = 'editor',
  useSourceMode = false,
  onSourceModeChange
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [currentLength, setCurrentLength] = useState(0);

  useEffect(() => {
    // 源码模式不需要初始化编辑器
    if (useSourceMode) return;
    
    // 确保 DOM 已挂载
    if (!editorRef.current || !toolbarRef.current) return;

    // 初始化编辑器
    const editor = new wangEditor(toolbarRef.current, editorRef.current);

    // 配置编辑器
    editor.config.placeholder = placeholder;
    editor.config.height = height;
    // 由于 wangeditor 的类型定义问题，使用类型断言
    (editor.config as any).readOnly = disabled;
    if (maxHeight) {
      (editor.config as any).maxHeight = maxHeight;
    }
    editor.config.showFullScreen = true;
    editor.config.excludeMenus = [
      'code',
      'fullscreen',
      'insertVideo'
    ];
    
    // 配置图片上传
    editor.config.uploadImgShowBase64 = false; // 不使用 base64 保存图片
    editor.config.uploadImgMaxLength = 10; // 一次最多上传10张图片
    
    // 自定义上传图片触发方式
    editor.config.customUploadImg = (resultFiles: File[], insertImgFn: (url: string) => void) => {
      // 直接调用uploadService上传文件
      if (resultFiles && resultFiles.length > 0) {
        resultFiles.forEach(async (file) => {
          try {
            // 获取原始文件对象
            let fileObj: File;
            if ('originFileObj' in file && file.originFileObj) {
              fileObj = file.originFileObj as File;
            } else {
              fileObj = file as File;
            }
            
            const response = await uploadService.uploadFile({
              file: fileObj,
              bizType
            });
            
            if (response.code === 0 && response.data) {
              const fileUrl = uploadService.getFileUrl(response.data.storagePath);
              insertImgFn(fileUrl);
              // message.success('图片上传成功');
            } else {
              // message.error('图片上传失败');
            }
          } catch (error) {
            console.error('图片上传失败:', error);
            message.error('图片上传失败');
          }
        });
      }
    };

    // 监听内容变化
    editor.config.onchange = (newHtml: string) => {
      // 更新字数统计
      setCurrentLength(newHtml.length);
      
      if (onChange) {
        // 如果设置了最大字数限制，检查并截断
        if (maxLength !== undefined && newHtml.length > maxLength) {
          // 获取编辑器实例，截断内容
          if (editorInstanceRef.current) {
            const truncatedHtml = newHtml.slice(0, maxLength);
            editorInstanceRef.current.txt.html(truncatedHtml);
            onChange(truncatedHtml);
            setCurrentLength(maxLength); // 更新字数统计
            return;
          }
        }
        onChange(newHtml);
      }
    };

    // 创建编辑器
    editor.create();

    // 如果有初始值，设置编辑器内容
    if (value) {
      editor.txt.html(value);
    }

    // 存储编辑器实例
    editorInstanceRef.current = editor;

    // 清理函数
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [placeholder, height, disabled, useSourceMode]); // 移除 value 和 onChange 依赖

  // 当 value 变化时更新编辑器内容
  useEffect(() => {
    if (useSourceMode) {
      // 源码模式下，更新textarea的值
      if (textareaRef.current && value !== undefined) {
        textareaRef.current.value = value;
        setCurrentLength(value.length);
      }
    } else {
      // 编辑器模式下，更新编辑器内容
      if (editorInstanceRef.current && value !== undefined) {
        const currentContent = editorInstanceRef.current.txt.html();
        if (currentContent !== value) {
          editorInstanceRef.current.txt.html(value);
          // 当外部 value 变化时，更新字数统计
          setCurrentLength(value.length);
        }
      }
    }
  }, [value, useSourceMode]);

  // 处理源码模式下的内容变化
  const handleSourceModeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCurrentLength(newValue.length);
    if (onChange) {
      // 如果设置了最大字数限制，检查并截断
      if (maxLength !== undefined && newValue.length > maxLength) {
        const truncatedValue = newValue.slice(0, maxLength);
        if (textareaRef.current) {
          textareaRef.current.value = truncatedValue;
        }
        onChange(truncatedValue);
        setCurrentLength(maxLength);
        return;
      }
      onChange(newValue);
    }
  };

  // 确保组件只有一个根元素
  return (
    <div ref={ref} className="wang-editor-wrapper" style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
      {/* 源码模式切换按钮 */}
      {onSourceModeChange && (
        <div style={{ 
          borderBottom: '1px solid #f0f0f0', 
          padding: '8px 16px', 
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>编辑模式：</span>
          <div>
            <button
              type="button"
              onClick={() => onSourceModeChange(false)}
              style={{
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                backgroundColor: useSourceMode ? 'white' : '#1890ff',
                color: useSourceMode ? '#666' : 'white',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer',
                marginRight: '-1px'
              }}
            >
              编辑器模式
            </button>
            <button
              type="button"
              onClick={() => onSourceModeChange(true)}
              style={{
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                backgroundColor: useSourceMode ? '#1890ff' : 'white',
                color: useSourceMode ? 'white' : '#666',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}
            >
              源码模式
            </button>
          </div>
        </div>
      )}
      
      {useSourceMode ? (
        // 源码模式：显示文本区域
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            disabled={disabled}
            value={value || ''}
            onChange={handleSourceModeChange}
            style={{
              width: '100%',
              minHeight: `${height}px`,
              maxHeight: maxHeight ? `${maxHeight}px` : 'none',
              border: 'none',
              padding: '12px',
              resize: 'vertical',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />
        </div>
      ) : (
        // 编辑器模式：显示富文本编辑器
        <>
          <div ref={toolbarRef} style={{ borderBottom: '1px solid #f0f0f0', padding: '0 16px' }} />
          <div 
            ref={editorRef} 
            style={{ 
              minHeight: `${height}px`, 
              maxHeight: maxHeight ? `${maxHeight}px` : 'none', 
              overflowY: maxHeight ? 'auto' : 'visible' 
            }} 
          />
        </>
      )}
      
      {/* 字数统计显示 */}
      {maxLength !== undefined && (
        <div style={{
          borderTop: '1px solid #f0f0f0',
          padding: '4px 12px',
          fontSize: '12px',
          color: '#666',
          textAlign: 'right',
          backgroundColor: '#fafafa'
        }}>
          <span style={{
            color: currentLength >= maxLength * 0.9 ? '#ff4d4f' : '#666'
          }}>
            {currentLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
});

// 设置 displayName 以在 React DevTools 中更好地识别组件
WangEditor.displayName = 'WangEditor';

export default WangEditor;