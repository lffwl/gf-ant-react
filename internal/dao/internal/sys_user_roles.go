// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysUserRolesDao is the data access object for the table sys_user_roles.
type SysUserRolesDao struct {
	table    string              // table is the underlying table name of the DAO.
	group    string              // group is the database configuration group name of the current DAO.
	columns  SysUserRolesColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler  // handlers for customized model modification.
}

// SysUserRolesColumns defines and stores column names for the table sys_user_roles.
type SysUserRolesColumns struct {
	Id        string // ID
	UserId    string // 用户ID
	RoleId    string // 角色ID
	CreatedAt string //
}

// sysUserRolesColumns holds the columns for the table sys_user_roles.
var sysUserRolesColumns = SysUserRolesColumns{
	Id:        "id",
	UserId:    "user_id",
	RoleId:    "role_id",
	CreatedAt: "created_at",
}

// NewSysUserRolesDao creates and returns a new DAO object for table data access.
func NewSysUserRolesDao(handlers ...gdb.ModelHandler) *SysUserRolesDao {
	return &SysUserRolesDao{
		group:    "default",
		table:    "sys_user_roles",
		columns:  sysUserRolesColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysUserRolesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysUserRolesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysUserRolesDao) Columns() SysUserRolesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysUserRolesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysUserRolesDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysUserRolesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
