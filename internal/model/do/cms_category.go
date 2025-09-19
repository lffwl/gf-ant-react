// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// CmsCategory is the golang structure of table cms_category for DAO operations like Where/Data.
type CmsCategory struct {
	g.Meta         `orm:"table:cms_category, do:true"`
	Id             any         // 主键ID
	Name           any         // 栏目名称
	Slug           any         // 栏目别名/URL标识，用于生成SEO友好的URL
	Description    any         // 栏目描述
	ParentId       any         // 父级栏目ID，0表示顶级栏目
	Level          any         // 栏目层级深度 (0=顶级, 1=二级, ...)
	Path           any         // 栏目路径，如 0,1,5, 表示从根到当前栏目的路径
	CType          any         // 栏目类型
	IsNav          any         // 是否显示在主导航: 0-否, 1-是
	SortOrder      any         // 排序权重，值越小越靠前
	Status         any         // 状态: 1-启用, 0-禁用
	DeletedAt      *gtime.Time // 软删除时间，NULL表示未删除
	CoverImage     any         // 栏目封面图片URL
	SeoTitle       any         // SEO标题
	SeoKeywords    any         // SEO关键词
	SeoDescription any         // SEO描述
	Extra          any         // 扩展属性，如模板、自定义字段等，避免频繁修改表结构
	CreatedAt      *gtime.Time // 创建时间
	UpdatedAt      *gtime.Time // 更新时间
}
