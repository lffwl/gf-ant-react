// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// CmsSiteSettingDao is the data access object for the table cms_site_setting.
type CmsSiteSettingDao struct {
	table    string                // table is the underlying table name of the DAO.
	group    string                // group is the database configuration group name of the current DAO.
	columns  CmsSiteSettingColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler    // handlers for customized model modification.
}

// CmsSiteSettingColumns defines and stores column names for the table cms_site_setting.
type CmsSiteSettingColumns struct {
	Id           string // 主键ID
	SettingKey   string // 配置项键名，如 site_name, contact_email, enable_register
	SettingValue string // 配置项值，可为字符串、JSON 或其他序列化格式
	ValueType    string // 值类型
	Group        string // 配置分组，如 general, seo, email, social, security
	Description  string // 配置项说明
	CreatedBy    string // 创建人ID（如管理员用户ID）
	UpdatedBy    string // 最后更新人ID
	CreatedAt    string // 创建时间
	UpdatedAt    string // 最后更新时间
	DeletedAt    string // 软删除时间，NULL表示未删除
}

// cmsSiteSettingColumns holds the columns for the table cms_site_setting.
var cmsSiteSettingColumns = CmsSiteSettingColumns{
	Id:           "id",
	SettingKey:   "setting_key",
	SettingValue: "setting_value",
	ValueType:    "value_type",
	Group:        "group",
	Description:  "description",
	CreatedBy:    "created_by",
	UpdatedBy:    "updated_by",
	CreatedAt:    "created_at",
	UpdatedAt:    "updated_at",
	DeletedAt:    "deleted_at",
}

// NewCmsSiteSettingDao creates and returns a new DAO object for table data access.
func NewCmsSiteSettingDao(handlers ...gdb.ModelHandler) *CmsSiteSettingDao {
	return &CmsSiteSettingDao{
		group:    "default",
		table:    "cms_site_setting",
		columns:  cmsSiteSettingColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *CmsSiteSettingDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *CmsSiteSettingDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *CmsSiteSettingDao) Columns() CmsSiteSettingColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *CmsSiteSettingDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *CmsSiteSettingDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *CmsSiteSettingDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
