// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysApisDao is the data access object for the table sys_apis.
type SysApisDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  SysApisColumns     // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// SysApisColumns defines and stores column names for the table sys_apis.
type SysApisColumns struct {
	Id             string // 主键
	ParentId       string // 上级ID，NULL表示根节点
	Name           string // 名称，如：用户管理、查询用户
	PermissionCode string // 权限唯一标识，如：system:user:list
	Url            string // 接口URL，支持通配符
	Method         string // 请求方法
	Sort           string // 排序
	Status         string // 状态：0=禁用，1=启用
	IsMenu         string // 是否为菜单：0=否，1=是
	Description    string // 描述
	CreatedAt      string //
	UpdatedAt      string //
	DeletedAt      string //
}

// sysApisColumns holds the columns for the table sys_apis.
var sysApisColumns = SysApisColumns{
	Id:             "id",
	ParentId:       "parent_id",
	Name:           "name",
	PermissionCode: "permission_code",
	Url:            "url",
	Method:         "method",
	Sort:           "sort",
	Status:         "status",
	IsMenu:         "is_menu",
	Description:    "description",
	CreatedAt:      "created_at",
	UpdatedAt:      "updated_at",
	DeletedAt:      "deleted_at",
}

// NewSysApisDao creates and returns a new DAO object for table data access.
func NewSysApisDao(handlers ...gdb.ModelHandler) *SysApisDao {
	return &SysApisDao{
		group:    "default",
		table:    "sys_apis",
		columns:  sysApisColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysApisDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysApisDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysApisDao) Columns() SysApisColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysApisDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysApisDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysApisDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
