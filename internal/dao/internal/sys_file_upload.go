// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysFileUploadDao is the data access object for the table sys_file_upload.
type SysFileUploadDao struct {
	table    string               // table is the underlying table name of the DAO.
	group    string               // group is the database configuration group name of the current DAO.
	columns  SysFileUploadColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler   // handlers for customized model modification.
}

// SysFileUploadColumns defines and stores column names for the table sys_file_upload.
type SysFileUploadColumns struct {
	Id             string // 主键ID
	FileName       string // 原始文件名
	FileNameStored string // 存储时的文件名 (可包含路径)
	FileSize       string // 文件大小 (字节)
	FileType       string // MIME类型 (如 image/jpeg)
	FileExt        string // 文件扩展名 (如 jpg, pdf)
	StorageType    string // 存储类型
	StoragePath    string // 文件在存储系统中的完整路径或URL
	StorageBucket  string // 存储桶名称 (用于云存储)
	BizType        string // 业务类型 (如 avatar, document, image)
	UploaderId     string // 上传者ID
	DeletedAt      string // 软删除时间，NULL表示未删除
	IsPublic       string // 是否公开: 0-私有, 1-公开
	Md5Hash        string // 文件MD5哈希值，用于去重和完整性校验
	CreatedAt      string // 创建时间
	UpdatedAt      string // 更新时间
}

// sysFileUploadColumns holds the columns for the table sys_file_upload.
var sysFileUploadColumns = SysFileUploadColumns{
	Id:             "id",
	FileName:       "file_name",
	FileNameStored: "file_name_stored",
	FileSize:       "file_size",
	FileType:       "file_type",
	FileExt:        "file_ext",
	StorageType:    "storage_type",
	StoragePath:    "storage_path",
	StorageBucket:  "storage_bucket",
	BizType:        "biz_type",
	UploaderId:     "uploader_id",
	DeletedAt:      "deleted_at",
	IsPublic:       "is_public",
	Md5Hash:        "md5_hash",
	CreatedAt:      "created_at",
	UpdatedAt:      "updated_at",
}

// NewSysFileUploadDao creates and returns a new DAO object for table data access.
func NewSysFileUploadDao(handlers ...gdb.ModelHandler) *SysFileUploadDao {
	return &SysFileUploadDao{
		group:    "default",
		table:    "sys_file_upload",
		columns:  sysFileUploadColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysFileUploadDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysFileUploadDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysFileUploadDao) Columns() SysFileUploadColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysFileUploadDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysFileUploadDao) Ctx(ctx context.Context) *gdb.Model {
	model := dao.DB().Model(dao.table)
	for _, handler := range dao.handlers {
		model = handler(model)
	}
	return model.Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *SysFileUploadDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
