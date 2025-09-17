package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/util/gconv"
)

type SysFileUpload struct{}

var SysFileUploadService = &SysFileUpload{}

// SaveFileInfoToDB 保存文件信息到数据库
func (s *SysFileUpload) SaveFileInfoToDB(ctx context.Context, fileInfo *entity.SysFileUpload) (*entity.SysFileUpload, error) {
	// 插入数据库
	id, err := dao.SysFileUpload.Ctx(ctx).InsertAndGetId(fileInfo)
	if err != nil {
		return nil, err
	}

	fileInfo.Id = gconv.Uint64(id)
	return fileInfo, nil
}

// GetFileById 根据ID获取文件信息
func (s *SysFileUpload) GetFileById(ctx context.Context, id uint64) (*entity.SysFileUpload, error) {
	var file *entity.SysFileUpload
	err := dao.SysFileUpload.Ctx(ctx).Where(dao.SysFileUpload.Columns().Id, id).Scan(&file)
	return file, err
}

// DeleteFileFromDB 从数据库中删除文件信息
func (s *SysFileUpload) DeleteFileFromDB(ctx context.Context, id uint64) error {

	if _, err := dao.SysFileUpload.Ctx(ctx).Where(dao.SysFileUpload.Columns().Id, id).Delete(); err != nil {
		return err
	}

	return nil
}
