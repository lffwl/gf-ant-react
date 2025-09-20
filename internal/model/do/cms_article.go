// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// CmsArticle is the golang structure of table cms_article for DAO operations like Where/Data.
type CmsArticle struct {
	g.Meta         `orm:"table:cms_article, do:true"`
	Id             any         // 主键ID
	Title          any         // 文章标题
	Summary        any         // 文章摘要/简介
	Content        any         // 文章正文内容 (支持HTML/Markdown)
	ArticleType    any         // 文章类型: normal-普通文章, external-外链文章
	ExternalUrl    any         // 外链地址，仅当文章类型为 external 时使用
	CategoryId     any         // 所属栏目ID，关联 cms_category.id
	AuthorId       any         // 作者ID (如用户ID)
	AuthorName     any         // 作者显示名称
	CoverImage     any         // 文章封面图片URL
	Status         any         // 发布状态: 1-已发布, 0-草稿/未发布
	IsTop          any         // 是否置顶: 1-置顶, 0-不置顶
	IsHot          any         // 是否热门: 1-热门, 0-普通
	IsRecommend    any         // 是否推荐: 1-推荐, 0-不推荐
	DeletedAt      *gtime.Time // 软删除时间，NULL表示未删除
	PublishAt      *gtime.Time // 计划发布时间，NULL表示立即发布或未计划
	CreatedAt      *gtime.Time // 创建时间 (由应用层维护)
	UpdatedAt      *gtime.Time // 更新时间 (由应用层维护)
	SeoTitle       any         // SEO标题
	SeoKeywords    any         // SEO关键词
	SeoDescription any         // SEO描述
	ViewCount      any         // 浏览次数
	Extra          any         // 扩展属性，如来源、关联商品、自定义字段等
}
