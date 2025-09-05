// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysUsersDao is the data access object for the table sys_users.
type SysUsersDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  SysUsersColumns    // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// SysUsersColumns defines and stores column names for the table sys_users.
type SysUsersColumns struct {
	Id            string //
	Username      string // 用户名
	PasswordHash  string // 密码哈希
	Email         string // 邮箱
	Mobile        string // 手机号
	DepartmentId  string // 所属部门ID
	Status        string // 状态: 0=禁用, 1=正常, 2=锁定
	LastLoginAt   string // 最后登录时间
	LastLoginIp   string // 最后登录IP
	LoginAttempts string // 登录失败次数
	LockedUntil   string // 锁定到期时间
	CreatedAt     string //
	UpdatedAt     string //
	DeletedAt     string // 软删除时间 (NULL=未删除)
}

// sysUsersColumns holds the columns for the table sys_users.
var sysUsersColumns = SysUsersColumns{
	Id:            "id",
	Username:      "username",
	PasswordHash:  "password_hash",
	Email:         "email",
	Mobile:        "mobile",
	DepartmentId:  "department_id",
	Status:        "status",
	LastLoginAt:   "last_login_at",
	LastLoginIp:   "last_login_ip",
	LoginAttempts: "login_attempts",
	LockedUntil:   "locked_until",
	CreatedAt:     "created_at",
	UpdatedAt:     "updated_at",
	DeletedAt:     "deleted_at",
}

// NewSysUsersDao creates and returns a new DAO object for table data access.
func NewSysUsersDao(handlers ...gdb.ModelHandler) *SysUsersDao {
	return &SysUsersDao{
		group:    "default",
		table:    "sys_users",
		columns:  sysUsersColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysUsersDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysUsersDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysUsersDao) Columns() SysUsersColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysUsersDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysUsersDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysUsersDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
