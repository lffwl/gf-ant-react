package admin

import (
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/os/gtime"
)

// ArticleSearchParams 文章搜索参数结构体
// 用于业务层和数据层之间传递搜索条件
// 从API层的ArticleListReq转换而来
// 去掉了分页参数，仅保留搜索条件
// 统一了参数类型和处理逻辑
// 方便在不同层之间传递和处理
// 支持文章标题、栏目ID、状态、类型、置顶、热门、推荐等条件筛选
// 支持扩展更多搜索条件
// 统一了参数验证和转换逻辑
// 提高了代码的可维护性和可读性
type ArticleSearchParams struct {
	Title       string `json:"title" description:"文章标题（模糊搜索）"`
	CategoryId  uint64 `json:"categoryId" description:"栏目ID"`
	Status      *int   `json:"status" description:"状态: 0-草稿, 1-已发布"`
	ArticleType string `json:"articleType" description:"文章类型: normal-普通, external-外链"`
	IsTop       *int   `json:"isTop" description:"是否置顶: 0-不置顶, 1-置顶"`
	IsHot       *int   `json:"isHot" description:"是否热门: 0-普通, 1-热门"`
	IsRecommend *int   `json:"isRecommend" description:"是否推荐: 0-不推荐, 1-推荐"`
}

// ArticleCreateParams 文章创建参数结构体
// 用于业务层和数据层之间传递创建文章的参数
// 从API层的ArticleCreateReq转换而来
// 统一了参数类型和处理逻辑
// 方便在不同层之间传递和处理
// 包含文章的所有创建字段
// 支持普通文章和外链文章
// 支持SEO相关字段
// 支持扩展属性
type ArticleCreateParams struct {
	Title          string      `json:"title" description:"文章标题"`
	Summary        string      `json:"summary" description:"文章摘要/简介"`
	Content        string      `json:"content" description:"文章正文内容"`
	ArticleType    string      `json:"articleType" description:"文章类型: normal-普通文章, external-外链文章"`
	ExternalUrl    string      `json:"externalUrl" description:"外链地址，仅当文章类型为 external 时使用"`
	CategoryId     uint64      `json:"categoryId" description:"所属栏目ID"`
	AuthorName     string      `json:"authorName" description:"作者显示名称"`
	CoverImage     string      `json:"coverImage" description:"文章封面图片URL"`
	Status         bool        `json:"status" description:"发布状态: 1-已发布, 0-草稿/未发布"`
	IsTop          bool        `json:"isTop" description:"是否置顶: 1-置顶, 0-不置顶"`
	IsHot          bool        `json:"isHot" description:"是否热门: 1-热门, 0-普通"`
	IsRecommend    bool        `json:"isRecommend" description:"是否推荐: 1-推荐, 0-不推荐"`
	PublishAt      *gtime.Time `json:"publishAt" description:"计划发布时间"`
	SeoTitle       string      `json:"seoTitle" description:"SEO标题"`
	SeoKeywords    string      `json:"seoKeywords" description:"SEO关键词"`
	SeoDescription string      `json:"seoDescription" description:"SEO描述"`
	Extra          string      `json:"extra" description:"扩展属性"`
}

// ArticleUpdateParams 文章更新参数结构体
// 用于业务层和数据层之间传递更新文章的参数
// 从API层的ArticleUpdateReq转换而来
// 统一了参数类型和处理逻辑
// 方便在不同层之间传递和处理
// 包含文章ID和所有可更新字段
// 支持普通文章和外链文章
// 支持SEO相关字段
// 支持扩展属性
type ArticleUpdateParams struct {
	Id             uint64      `json:"id" description:"文章ID"`
	Title          string      `json:"title" description:"文章标题"`
	Summary        string      `json:"summary" description:"文章摘要/简介"`
	Content        string      `json:"content" description:"文章正文内容"`
	ArticleType    string      `json:"articleType" description:"文章类型: normal-普通文章, external-外链文章"`
	ExternalUrl    string      `json:"externalUrl" description:"外链地址，仅当文章类型为 external 时使用"`
	CategoryId     uint64      `json:"categoryId" description:"所属栏目ID"`
	AuthorName     string      `json:"authorName" description:"作者显示名称"`
	CoverImage     string      `json:"coverImage" description:"文章封面图片URL"`
	Status         bool        `json:"status" description:"发布状态: 1-已发布, 0-草稿/未发布"`
	IsTop          bool        `json:"isTop" description:"是否置顶: 1-置顶, 0-不置顶"`
	IsHot          bool        `json:"isHot" description:"是否热门: 1-热门, 0-普通"`
	IsRecommend    bool        `json:"isRecommend" description:"是否推荐: 1-推荐, 0-不推荐"`
	PublishAt      *gtime.Time `json:"publishAt" description:"计划发布时间"`
	SeoTitle       string      `json:"seoTitle" description:"SEO标题"`
	SeoKeywords    string      `json:"seoKeywords" description:"SEO关键词"`
	SeoDescription string      `json:"seoDescription" description:"SEO描述"`
	Extra          string      `json:"extra" description:"扩展属性"`
}

// ArticleListResult 文章列表返回结果
// 用于业务层向API层返回文章列表数据
// 包含文章列表、总数、分页信息
// 方便统一处理和返回格式
// 提高代码的可维护性和可读性
type ArticleListResult struct {
	List  []*entity.CmsArticle `json:"list" description:"文章列表"`
	Total int                  `json:"total" description:"总条数"`
	Page  int                  `json:"page" description:"当前页码"`
	Size  int                  `json:"size" description:"每页条数"`
}
