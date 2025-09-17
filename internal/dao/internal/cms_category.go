// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// CmsCategoryDao is the data access object for the table cms_category.
type CmsCategoryDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  CmsCategoryColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// CmsCategoryColumns defines and stores column names for the table cms_category.
type CmsCategoryColumns struct {
	Id             string // 主键ID
	Name           string // 栏目名称
	Slug           string // 栏目别名/URL标识，用于生成SEO友好的URL
	Description    string // 栏目描述
	ParentId       string // 父级栏目ID，0表示顶级栏目
	Level          string // 栏目层级深度 (0=顶级, 1=二级, ...)
	Path           string // 栏目路径，如 0,1,5, 表示从根到当前栏目的路径
	ContentType    string // 关联的内容类型
	IsNav          string // 是否显示在主导航: 0-否, 1-是
	SortOrder      string // 排序权重，值越小越靠前
	Status         string // 状态: 1-启用, 0-禁用
	DeletedAt      string // 软删除时间，NULL表示未删除
	CoverImage     string // 栏目封面图片URL
	SeoTitle       string // SEO标题
	SeoKeywords    string // SEO关键词
	SeoDescription string // SEO描述
	Extra          string // 扩展属性，如模板、自定义字段等，避免频繁修改表结构
	CreatedAt      string // 创建时间
	UpdatedAt      string // 更新时间
}

// cmsCategoryColumns holds the columns for the table cms_category.
var cmsCategoryColumns = CmsCategoryColumns{
	Id:             "id",
	Name:           "name",
	Slug:           "slug",
	Description:    "description",
	ParentId:       "parent_id",
	Level:          "level",
	Path:           "path",
	ContentType:    "content_type",
	IsNav:          "is_nav",
	SortOrder:      "sort_order",
	Status:         "status",
	DeletedAt:      "deleted_at",
	CoverImage:     "cover_image",
	SeoTitle:       "seo_title",
	SeoKeywords:    "seo_keywords",
	SeoDescription: "seo_description",
	Extra:          "extra",
	CreatedAt:      "created_at",
	UpdatedAt:      "updated_at",
}

// NewCmsCategoryDao creates and returns a new DAO object for table data access.
func NewCmsCategoryDao(handlers ...gdb.ModelHandler) *CmsCategoryDao {
	return &CmsCategoryDao{
		group:    "default",
		table:    "cms_category",
		columns:  cmsCategoryColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *CmsCategoryDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *CmsCategoryDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *CmsCategoryDao) Columns() CmsCategoryColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *CmsCategoryDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *CmsCategoryDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *CmsCategoryDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
