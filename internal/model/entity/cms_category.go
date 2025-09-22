// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// CmsCategory is the golang structure for table cms_category.
type CmsCategory struct {
	Id             uint64      `json:"id"             orm:"id"              description:"主键ID"`                       // 主键ID
	Name           string      `json:"name"           orm:"name"            description:"栏目名称"`                       // 栏目名称
	Slug           string      `json:"slug"           orm:"slug"            description:"栏目别名/URL标识，用于生成SEO友好的URL"`   // 栏目别名/URL标识，用于生成SEO友好的URL
	Description    string      `json:"description"    orm:"description"     description:"栏目描述"`                       // 栏目描述
	ParentId       uint64      `json:"parentId"       orm:"parent_id"       description:"父级栏目ID，0表示顶级栏目"`             // 父级栏目ID，0表示顶级栏目
	Level          uint        `json:"level"          orm:"level"           description:"栏目层级深度 (0=顶级, 1=二级, ...)"`   // 栏目层级深度 (0=顶级, 1=二级, ...)
	Path           string      `json:"path"           orm:"path"            description:"栏目路径，如 0,1,5, 表示从根到当前栏目的路径"` // 栏目路径，如 0,1,5, 表示从根到当前栏目的路径
	CType          string      `json:"cType"          orm:"c_type"          description:"栏目类型"`                       // 栏目类型
	LinkUrl        string      `json:"linkUrl"        orm:"link_url"        description:"外链地址，c_type 为 link 使用"`      // 外链地址，c_type 为 link 使用
	IsNav          bool        `json:"isNav"          orm:"is_nav"          description:"是否显示在主导航: 0-否, 1-是"`         // 是否显示在主导航: 0-否, 1-是
	SortOrder      int         `json:"sortOrder"      orm:"sort_order"      description:"排序权重，值越小越靠前"`                // 排序权重，值越小越靠前
	Status         bool        `json:"status"         orm:"status"          description:"状态: 1-启用, 0-禁用"`             // 状态: 1-启用, 0-禁用
	DeletedAt      *gtime.Time `json:"deletedAt"      orm:"deleted_at"      description:"软删除时间，NULL表示未删除"`            // 软删除时间，NULL表示未删除
	CoverImage     string      `json:"coverImage"     orm:"cover_image"     description:"栏目封面图片URL"`                  // 栏目封面图片URL
	SeoTitle       string      `json:"seoTitle"       orm:"seo_title"       description:"SEO标题"`                      // SEO标题
	SeoKeywords    string      `json:"seoKeywords"    orm:"seo_keywords"    description:"SEO关键词"`                     // SEO关键词
	SeoDescription string      `json:"seoDescription" orm:"seo_description" description:"SEO描述"`                      // SEO描述
	Extra          string      `json:"extra"          orm:"extra"           description:"扩展属性，如模板、自定义字段等，避免频繁修改表结构"`  // 扩展属性，如模板、自定义字段等，避免频繁修改表结构
	CreatedAt      *gtime.Time `json:"createdAt"      orm:"created_at"      description:"创建时间"`                       // 创建时间
	UpdatedAt      *gtime.Time `json:"updatedAt"      orm:"updated_at"      description:"更新时间"`                       // 更新时间
}
