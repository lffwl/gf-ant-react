// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// CmsArticleDao is the data access object for the table cms_article.
type CmsArticleDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  CmsArticleColumns  // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// CmsArticleColumns defines and stores column names for the table cms_article.
type CmsArticleColumns struct {
	Id             string // 主键ID
	Title          string // 文章标题
	Summary        string // 文章摘要/简介
	Content        string // 文章正文内容 (支持HTML/Markdown)
	ArticleType    string // 文章类型: normal-普通文章, external-外链文章
	ExternalUrl    string // 外链地址，仅当文章类型为 external 时使用
	CategoryId     string // 所属栏目ID，关联 cms_category.id
	AuthorId       string // 作者ID (如用户ID)
	AuthorName     string // 作者显示名称
	CoverImage     string // 文章封面图片URL
	Status         string // 发布状态: 1-已发布, 0-草稿/未发布
	IsTop          string // 是否置顶: 1-置顶, 0-不置顶
	IsHot          string // 是否热门: 1-热门, 0-普通
	IsRecommend    string // 是否推荐: 1-推荐, 0-不推荐
	DeletedAt      string // 软删除时间，NULL表示未删除
	PublishAt      string // 计划发布时间，NULL表示立即发布或未计划
	CreatedAt      string // 创建时间 (由应用层维护)
	UpdatedAt      string // 更新时间 (由应用层维护)
	SeoTitle       string // SEO标题
	SeoKeywords    string // SEO关键词
	SeoDescription string // SEO描述
	ViewCount      string // 浏览次数
	Extra          string // 扩展属性，如来源、关联商品、自定义字段等
}

// cmsArticleColumns holds the columns for the table cms_article.
var cmsArticleColumns = CmsArticleColumns{
	Id:             "id",
	Title:          "title",
	Summary:        "summary",
	Content:        "content",
	ArticleType:    "article_type",
	ExternalUrl:    "external_url",
	CategoryId:     "category_id",
	AuthorId:       "author_id",
	AuthorName:     "author_name",
	CoverImage:     "cover_image",
	Status:         "status",
	IsTop:          "is_top",
	IsHot:          "is_hot",
	IsRecommend:    "is_recommend",
	DeletedAt:      "deleted_at",
	PublishAt:      "publish_at",
	CreatedAt:      "created_at",
	UpdatedAt:      "updated_at",
	SeoTitle:       "seo_title",
	SeoKeywords:    "seo_keywords",
	SeoDescription: "seo_description",
	ViewCount:      "view_count",
	Extra:          "extra",
}

// NewCmsArticleDao creates and returns a new DAO object for table data access.
func NewCmsArticleDao(handlers ...gdb.ModelHandler) *CmsArticleDao {
	return &CmsArticleDao{
		group:    "default",
		table:    "cms_article",
		columns:  cmsArticleColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *CmsArticleDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *CmsArticleDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *CmsArticleDao) Columns() CmsArticleColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *CmsArticleDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *CmsArticleDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *CmsArticleDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
