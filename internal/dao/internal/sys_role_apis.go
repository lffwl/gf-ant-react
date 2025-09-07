// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysRoleApisDao is the data access object for the table sys_role_apis.
type SysRoleApisDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  SysRoleApisColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// SysRoleApisColumns defines and stores column names for the table sys_role_apis.
type SysRoleApisColumns struct {
	Id             string // 主键
	RoleId         string // 角色ID
	ApiId          string // apiID
	PermissionCode string // 权限码 (关联 api_permissions.permission_code)
	CreatedAt      string //
}

// sysRoleApisColumns holds the columns for the table sys_role_apis.
var sysRoleApisColumns = SysRoleApisColumns{
	Id:             "id",
	RoleId:         "role_id",
	ApiId:          "api_id",
	PermissionCode: "permission_code",
	CreatedAt:      "created_at",
}

// NewSysRoleApisDao creates and returns a new DAO object for table data access.
func NewSysRoleApisDao(handlers ...gdb.ModelHandler) *SysRoleApisDao {
	return &SysRoleApisDao{
		group:    "default",
		table:    "sys_role_apis",
		columns:  sysRoleApisColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysRoleApisDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysRoleApisDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysRoleApisDao) Columns() SysRoleApisColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysRoleApisDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysRoleApisDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysRoleApisDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
