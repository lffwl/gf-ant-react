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

// GetFileByMd5 根据MD5获取文件信息
func (s *SysFileUpload) GetFileByMd5(ctx context.Context, md5 string) (*entity.SysFileUpload, error) {
	var file *entity.SysFileUpload
	err := dao.SysFileUpload.Ctx(ctx).Where(dao.SysFileUpload.Columns().Md5Hash, md5).Scan(&file)
	return file, err
}

// GetFileList 获取文件列表，支持按业务类型搜索、文件名模糊检索和分页
func (s *SysFileUpload) GetFileList(ctx context.Context, bizType string, fileName string, page int, pageSize int) ([]*entity.SysFileUpload, int, error) {
	// 构建查询条件
	model := dao.SysFileUpload.Ctx(ctx)

	// 添加业务类型搜索条件
	if bizType != "" {
		model = model.Where(dao.SysFileUpload.Columns().BizType, bizType)
	}

	// 添加文件名模糊检索条件
	if fileName != "" {
		model = model.WhereLike(dao.SysFileUpload.Columns().FileName, "%"+fileName+"%")
	}

	// 计算总数
	var total int
	var err error
	total, err = model.Count()
	if err != nil {
		return nil, 0, err
	}

	// 构建文件列表
	var fileList []*entity.SysFileUpload

	// 分页查询并按ID降序排序
	if err := model.OrderDesc(dao.SysFileUpload.Columns().Id).Page(page, pageSize).Scan(&fileList); err != nil {
		return nil, 0, err
	}

	return fileList, total, nil
}
