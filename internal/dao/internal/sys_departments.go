// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysDepartmentsDao is the data access object for the table sys_departments.
type SysDepartmentsDao struct {
	table    string                // table is the underlying table name of the DAO.
	group    string                // group is the database configuration group name of the current DAO.
	columns  SysDepartmentsColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler    // handlers for customized model modification.
}

// SysDepartmentsColumns defines and stores column names for the table sys_departments.
type SysDepartmentsColumns struct {
	Id        string // 部门ID
	ParentId  string // 上级部门ID，NULL表示顶级部门
	Name      string // 部门名称
	Sort      string // 排序
	Status    string // 状态: 0=禁用, 1=启用
	CreatedAt string //
	UpdatedAt string //
	DeletedAt string // 软删除时间 (NULL=未删除)
}

// sysDepartmentsColumns holds the columns for the table sys_departments.
var sysDepartmentsColumns = SysDepartmentsColumns{
	Id:        "id",
	ParentId:  "parent_id",
	Name:      "name",
	Sort:      "sort",
	Status:    "status",
	CreatedAt: "created_at",
	UpdatedAt: "updated_at",
	DeletedAt: "deleted_at",
}

// NewSysDepartmentsDao creates and returns a new DAO object for table data access.
func NewSysDepartmentsDao(handlers ...gdb.ModelHandler) *SysDepartmentsDao {
	return &SysDepartmentsDao{
		group:    "default",
		table:    "sys_departments",
		columns:  sysDepartmentsColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysDepartmentsDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysDepartmentsDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysDepartmentsDao) Columns() SysDepartmentsColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysDepartmentsDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysDepartmentsDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysDepartmentsDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
