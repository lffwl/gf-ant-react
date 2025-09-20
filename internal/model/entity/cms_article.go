// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// CmsArticle is the golang structure for table cms_article.
type CmsArticle struct {
	Id             uint64      `json:"id"             orm:"id"              description:"主键ID"`                             // 主键ID
	Title          string      `json:"title"          orm:"title"           description:"文章标题"`                             // 文章标题
	Summary        string      `json:"summary"        orm:"summary"         description:"文章摘要/简介"`                          // 文章摘要/简介
	Content        string      `json:"content"        orm:"content"         description:"文章正文内容 (支持HTML/Markdown)"`         // 文章正文内容 (支持HTML/Markdown)
	ArticleType    string      `json:"articleType"    orm:"article_type"    description:"文章类型: normal-普通文章, external-外链文章"` // 文章类型: normal-普通文章, external-外链文章
	ExternalUrl    string      `json:"externalUrl"    orm:"external_url"    description:"外链地址，仅当文章类型为 external 时使用"`        // 外链地址，仅当文章类型为 external 时使用
	CategoryId     uint64      `json:"categoryId"     orm:"category_id"     description:"所属栏目ID，关联 cms_category.id"`        // 所属栏目ID，关联 cms_category.id
	AuthorId       string      `json:"authorId"       orm:"author_id"       description:"作者ID (如用户ID)"`                     // 作者ID (如用户ID)
	AuthorName     string      `json:"authorName"     orm:"author_name"     description:"作者显示名称"`                           // 作者显示名称
	CoverImage     string      `json:"coverImage"     orm:"cover_image"     description:"文章封面图片URL"`                        // 文章封面图片URL
	Status         bool        `json:"status"         orm:"status"          description:"发布状态: 1-已发布, 0-草稿/未发布"`            // 发布状态: 1-已发布, 0-草稿/未发布
	IsTop          bool        `json:"isTop"          orm:"is_top"          description:"是否置顶: 1-置顶, 0-不置顶"`                // 是否置顶: 1-置顶, 0-不置顶
	IsHot          bool        `json:"isHot"          orm:"is_hot"          description:"是否热门: 1-热门, 0-普通"`                 // 是否热门: 1-热门, 0-普通
	IsRecommend    bool        `json:"isRecommend"    orm:"is_recommend"    description:"是否推荐: 1-推荐, 0-不推荐"`                // 是否推荐: 1-推荐, 0-不推荐
	DeletedAt      *gtime.Time `json:"deletedAt"      orm:"deleted_at"      description:"软删除时间，NULL表示未删除"`                  // 软删除时间，NULL表示未删除
	PublishAt      *gtime.Time `json:"publishAt"      orm:"publish_at"      description:"计划发布时间，NULL表示立即发布或未计划"`            // 计划发布时间，NULL表示立即发布或未计划
	CreatedAt      *gtime.Time `json:"createdAt"      orm:"created_at"      description:"创建时间 (由应用层维护)"`                    // 创建时间 (由应用层维护)
	UpdatedAt      *gtime.Time `json:"updatedAt"      orm:"updated_at"      description:"更新时间 (由应用层维护)"`                    // 更新时间 (由应用层维护)
	SeoTitle       string      `json:"seoTitle"       orm:"seo_title"       description:"SEO标题"`                            // SEO标题
	SeoKeywords    string      `json:"seoKeywords"    orm:"seo_keywords"    description:"SEO关键词"`                           // SEO关键词
	SeoDescription string      `json:"seoDescription" orm:"seo_description" description:"SEO描述"`                            // SEO描述
	ViewCount      uint        `json:"viewCount"      orm:"view_count"      description:"浏览次数"`                             // 浏览次数
	Extra          string      `json:"extra"          orm:"extra"           description:"扩展属性，如来源、关联商品、自定义字段等"`             // 扩展属性，如来源、关联商品、自定义字段等
}
