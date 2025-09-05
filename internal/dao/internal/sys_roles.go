// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysRolesDao is the data access object for the table sys_roles.
type SysRolesDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  SysRolesColumns    // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// SysRolesColumns defines and stores column names for the table sys_roles.
type SysRolesColumns struct {
	Id          string // 角色ID
	Name        string // 角色名称 (兼具标识作用)
	Description string // 描述
	DataScope   string // 数据权限范围: 1=全部, 2=本部门, 3=本部门及子部门, 4=仅本人, 5=自定义
	Sort        string // 排序
	Status      string // 状态: 0=禁用, 1=启用
	CreatedAt   string //
	UpdatedAt   string //
	DeletedAt   string //
}

// sysRolesColumns holds the columns for the table sys_roles.
var sysRolesColumns = SysRolesColumns{
	Id:          "id",
	Name:        "name",
	Description: "description",
	DataScope:   "data_scope",
	Sort:        "sort",
	Status:      "status",
	CreatedAt:   "created_at",
	UpdatedAt:   "updated_at",
	DeletedAt:   "deleted_at",
}

// NewSysRolesDao creates and returns a new DAO object for table data access.
func NewSysRolesDao(handlers ...gdb.ModelHandler) *SysRolesDao {
	return &SysRolesDao{
		group:    "default",
		table:    "sys_roles",
		columns:  sysRolesColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysRolesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysRolesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysRolesDao) Columns() SysRolesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysRolesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysRolesDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysRolesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
