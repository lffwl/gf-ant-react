package admin

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
	"gf-ant-react/utility/auth"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gfile"
)

type sSysFileUploadLogic struct{}

var SysFileUploadLogic = &sSysFileUploadLogic{}

// UploadFile 上传文件
func (s *sSysFileUploadLogic) UploadFile(ctx context.Context, file *ghttp.UploadFile, bizType string) (*entity.SysFileUpload, error) {
	// 获取当前登录用户ID
	uploaderId := auth.GetUserId(ctx)

	// 获取文件信息
	fileName := file.Filename
	fileSize := file.Size
	fileType := file.Header.Get("Content-Type")
	fileExt := gfile.Ext(fileName)

	// 检查文件大小是否超过限制
	maxSize := g.Cfg("upload").MustGet(ctx, "maxSize", 104857600).Int64()
	if fileSize > maxSize {
		return nil, fmt.Errorf("文件大小超过限制，最大支持 %.2f MB", float64(maxSize)/1024/1024)
	}

	// 检查文件扩展名是否在允许列表中
	allowedExts := g.Cfg("upload").MustGet(ctx, "allowedExtensions").Strings()
	if !slices.Contains(allowedExts, strings.ToLower(fileExt)) {
		return nil, fmt.Errorf("文件扩展名 %s 不被允许", fileExt)
	}

	// 检查文件类型是否在允许列表中
	allowedTypes := g.Cfg("upload").MustGet(ctx, "allowedTypes").Strings()
	if !slices.Contains(allowedTypes, fileType) {
		return nil, fmt.Errorf("文件类型 %s 不被允许", fileType)
	}

	fileMd5, err := calculateFileMD5(file)
	if err != nil {
		return nil, fmt.Errorf("计算文件MD5失败: %v", err)
	}

	// 检查文件是否已存在
	fileInfo, err := service.SysFileUploadService.GetFileByMd5(ctx, fileMd5)
	if err != nil {
		return nil, fmt.Errorf("检查文件是否已存在失败: %v", err)
	}
	if fileInfo != nil {
		return fileInfo, nil
	}

	// 创建存储目录
	uploadPath := g.Cfg("upload").MustGet(ctx, "path", "resource/public/upload").String()
	// 按日期创建子目录
	dateDir := time.Now().Format("200601")
	savePath := filepath.Join(uploadPath, dateDir)
	if err = gfile.Mkdir(savePath); err != nil {
		return nil, fmt.Errorf("创建存储目录失败: %v", err)
	}

	// 保存文件
	storedFileName, err := file.Save(savePath, true)
	if err != nil {
		return nil, fmt.Errorf("保存文件失败: %v", err)
	}

	fileURL := filepath.Join(savePath, storedFileName)

	// 构建文件信息
	fileInfo = &entity.SysFileUpload{
		FileName:       fileName,
		FileNameStored: storedFileName,
		FileSize:       uint64(fileSize),
		FileType:       fileType,
		FileExt:        fileExt,
		StorageType:    admin.StorageTypeLocal,
		StoragePath:    fileURL,
		BizType:        bizType,
		UploaderId:     uploaderId,
		Md5Hash:        fileMd5,
	}

	// 调用服务层保存文件信息到数据库
	savedFileInfo, err := service.SysFileUploadService.SaveFileInfoToDB(ctx, fileInfo)
	if err != nil {
		// 如果数据库操作失败，删除已保存的文件
		_ = os.Remove(filepath.Join(savePath, storedFileName))
		return nil, fmt.Errorf("保存文件信息到数据库失败: %v", err)
	}

	return savedFileInfo, nil
}

// calculateFileMD5 计算文件的MD5值
func calculateFileMD5(file *ghttp.UploadFile) (string, error) {
	// 打开文件
	srcFile, err := file.Open()
	if err != nil {
		return "", err
	}
	defer srcFile.Close()

	// 计算MD5
	hash := md5.New()
	buf := make([]byte, 32*1024) // 32KB缓冲区
	for {
		n, err := srcFile.Read(buf)
		if n > 0 {
			hash.Write(buf[:n])
		}
		if err != nil {
			break
		}
	}

	// 返回十六进制格式的MD5
	return hex.EncodeToString(hash.Sum(nil)), nil
}

// GetFileById 根据ID获取文件信息
func (s *sSysFileUploadLogic) GetFileById(ctx context.Context, id uint64) (*entity.SysFileUpload, error) {
	return service.SysFileUploadService.GetFileById(ctx, id)
}

// DeleteFile 删除文件
func (s *sSysFileUploadLogic) DeleteFile(ctx context.Context, id uint64) error {
	// 获取文件信息以进行删除操作前的验证
	file, err := service.SysFileUploadService.GetFileById(ctx, id)
	if err != nil {
		return fmt.Errorf("获取文件信息失败: %v", err)
	}

	if file == nil {
		return fmt.Errorf("文件不存在")
	}

	// 调用服务层从数据库中删除文件信息
	return service.SysFileUploadService.DeleteFileFromDB(ctx, id)
}

// GetUploadList 获取文件列表
func (s *sSysFileUploadLogic) GetUploadList(ctx context.Context, req *v1.UploadListReq) ([]*entity.SysFileUpload, int, error) {
	return service.SysFileUploadService.GetFileList(ctx, req.BizType, req.FileName, req.Page, req.PageSize)
}
