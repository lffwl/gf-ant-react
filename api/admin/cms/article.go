package cms

import (
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// 文章创建接口
type ArticleCreateReq struct {
	g.Meta         `path:"/sys/cms/article" tags:"Article" method:"post" summary:"新增"`
	Title          string      `p:"title" v:"required|length:2,200#文章标题不能为空|文章标题长度必须在2-200个字符之间" description:"文章标题"`
	Summary        string      `p:"summary" v:"length:0,500#文章摘要长度不能超过500个字符" description:"文章摘要/简介"`
	Content        string      `p:"content" v:"length:1,65535#文章内容长度不能超过65535个字符" description:"文章正文内容 (支持HTML/Markdown)"`
	ArticleType    string      `p:"articleType" v:"required|in:normal,external#文章类型不能为空|文章类型必须是normal或external" description:"文章类型: normal-普通文章, external-外链文章"`
	ExternalUrl    string      `p:"externalUrl" v:"required-if:articleType,external|url#外链文章必须提供外链地址|外链地址格式不正确" description:"外链地址，仅当文章类型为 external 时使用"`
	CategoryId     uint64      `p:"categoryId" v:"required|integer#所属栏目不能为空|所属栏目ID必须为整数" description:"所属栏目ID，关联 cms_category.id"`
	AuthorName     string      `p:"authorName" v:"length:2,50#作者名称长度必须在2-50个字符之间" description:"作者显示名称"`
	CoverImage     string      `p:"coverImage" description:"文章封面图片URL"`
	Status         bool        `p:"status" description:"发布状态: 1-已发布, 0-草稿/未发布"`
	IsTop          bool        `p:"isTop" description:"是否置顶: 1-置顶, 0-不置顶"`
	IsHot          bool        `p:"isHot" description:"是否热门: 1-热门, 0-普通"`
	IsRecommend    bool        `p:"isRecommend" description:"是否推荐: 1-推荐, 0-不推荐"`
	PublishAt      *gtime.Time `p:"publishAt" description:"计划发布时间，NULL表示立即发布或未计划"`
	SeoTitle       string      `p:"seoTitle" v:"length:0,100#SEO标题长度不能超过100个字符" description:"SEO标题"`
	SeoKeywords    string      `p:"seoKeywords" v:"length:0,255#SEO关键词长度不能超过255个字符" description:"SEO关键词"`
	SeoDescription string      `p:"seoDescription" v:"length:0,300#SEO描述长度不能超过300个字符" description:"SEO描述"`
	Extra          string      `p:"extra" v:"length:0,1000#扩展属性长度不能超过1000个字符" description:"扩展属性，如来源、关联商品、自定义字段等"`
}

// 文章创建接口响应
type ArticleCreateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章更新接口
type ArticleUpdateReq struct {
	g.Meta         `path:"/sys/cms/article/:id" tags:"Article" method:"put" summary:"更新"`
	Id             uint64      `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	Title          string      `p:"title" v:"required|length:2,200#文章标题不能为空|文章标题长度必须在2-200个字符之间" description:"文章标题"`
	Summary        string      `p:"summary" v:"length:0,500#文章摘要长度不能超过500个字符" description:"文章摘要/简介"`
	Content        string      `p:"content" v:"length:1,65535#文章内容长度不能超过65535个字符" description:"文章正文内容 (支持HTML/Markdown)"`
	ArticleType    string      `p:"articleType" v:"required|in:normal,external#文章类型不能为空|文章类型必须是normal或external" description:"文章类型: normal-普通文章, external-外链文章"`
	ExternalUrl    string      `p:"externalUrl" v:"required-if:articleType,external|url#外链文章必须提供外链地址|外链地址格式不正确" description:"外链地址，仅当文章类型为 external 时使用"`
	CategoryId     uint64      `p:"categoryId" v:"required|integer#所属栏目不能为空|所属栏目ID必须为整数" description:"所属栏目ID，关联 cms_category.id"`
	AuthorName     string      `p:"authorName" v:"length:2,50#作者名称长度必须在2-50个字符之间" description:"作者显示名称"`
	CoverImage     string      `p:"coverImage" description:"文章封面图片URL"`
	Status         bool        `p:"status" description:"发布状态: 1-已发布, 0-草稿/未发布"`
	IsTop          bool        `p:"isTop" description:"是否置顶: 1-置顶, 0-不置顶"`
	IsHot          bool        `p:"isHot" description:"是否热门: 1-热门, 0-普通"`
	IsRecommend    bool        `p:"isRecommend" description:"是否推荐: 1-推荐, 0-不推荐"`
	PublishAt      *gtime.Time `p:"publishAt" description:"计划发布时间，NULL表示立即发布或未计划"`
	SeoTitle       string      `p:"seoTitle" v:"length:0,100#SEO标题长度不能超过100个字符" description:"SEO标题"`
	SeoKeywords    string      `p:"seoKeywords" v:"length:0,255#SEO关键词长度不能超过255个字符" description:"SEO关键词"`
	SeoDescription string      `p:"seoDescription" v:"length:0,300#SEO描述长度不能超过300个字符" description:"SEO描述"`
	Extra          string      `p:"extra" v:"length:0,1000#扩展属性长度不能超过1000个字符" description:"扩展属性，如来源、关联商品、自定义字段等"`
}

// 文章更新接口响应
type ArticleUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章删除接口
type ArticleDeleteReq struct {
	g.Meta `path:"/sys/cms/article/:id" tags:"Article" method:"delete" summary:"删除"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
}

// 文章删除接口响应
type ArticleDeleteRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章列表接口
type ArticleListReq struct {
	g.Meta      `path:"/sys/cms/article" tags:"Article" method:"get" summary:"列表"`
	Page        int    `p:"page" v:"min:1#页码必须大于0" description:"页码"`
	Size        int    `p:"size" v:"min:1|max:100#每页数量必须大于0|每页数量不能超过100" description:"每页数量"`
	Title       string `p:"title" description:"文章标题（模糊搜索）"`
	CategoryId  uint64 `p:"categoryId" v:"integer#栏目ID必须为整数" description:"栏目ID"`
	Status      string `p:"status" v:"in:0,1,all#状态必须是0、1或all" description:"状态: 0-草稿, 1-已发布, all-全部"`
	ArticleType string `p:"articleType" v:"in:normal,external,all#文章类型必须是normal、external或all" description:"文章类型: normal-普通, external-外链, all-全部"`
	IsTop       string `p:"isTop" v:"in:0,1,all#置顶状态必须是0、1或all" description:"是否置顶: 0-不置顶, 1-置顶, all-全部"`
	IsHot       string `p:"isHot" v:"in:0,1,all#热门状态必须是0、1或all" description:"是否热门: 0-普通, 1-热门, all-全部"`
	IsRecommend string `p:"isRecommend" v:"in:0,1,all#推荐状态必须是0、1或all" description:"是否推荐: 0-不推荐, 1-推荐, all-全部"`
}

// 文章列表接口响应
type ArticleListRes struct {
	g.Meta `mime:"application/json" example:"{}"`
	List   []*entity.CmsArticle `json:"list"`
	Total  int                  `json:"total"`
	Page   int                  `json:"page"`
	Size   int                  `json:"size"`
}

// 文章状态更新接口
type ArticleStatusUpdateReq struct {
	g.Meta `path:"/sys/cms/article/:id/status" tags:"Article" method:"patch" summary:"更新状态"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	Status bool   `p:"status" v:"required#状态不能为空" description:"发布状态: true-已发布, false-草稿/未发布"`
}

// 文章状态更新接口响应
type ArticleStatusUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章置顶状态更新接口
type ArticleTopUpdateReq struct {
	g.Meta `path:"/sys/cms/article/:id/top" tags:"Article" method:"patch" summary:"更新置顶状态"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	IsTop  bool   `p:"isTop" v:"required#置顶状态不能为空" description:"是否置顶: true-置顶, false-不置顶"`
}

// 文章置顶状态更新接口响应
type ArticleTopUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章热门状态更新接口
type ArticleHotUpdateReq struct {
	g.Meta `path:"/sys/cms/article/:id/hot" tags:"Article" method:"patch" summary:"更新热门状态"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	IsHot  bool   `p:"isHot" v:"required#热门状态不能为空" description:"是否热门: true-热门, false-普通"`
}

// 文章热门状态更新接口响应
type ArticleHotUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章推荐状态更新接口
type ArticleRecommendUpdateReq struct {
	g.Meta      `path:"/sys/cms/article/:id/recommend" tags:"Article" method:"patch" summary:"更新推荐状态"`
	Id          uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	IsRecommend bool   `p:"isRecommend" v:"required#推荐状态不能为空" description:"是否推荐: true-推荐, false-不推荐"`
}

// 文章推荐状态更新接口响应
type ArticleRecommendUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 文章详情接口
type ArticleDetailReq struct {
	g.Meta `path:"/sys/cms/article/:id" tags:"Article" method:"get" summary:"详情"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
}

// 文章详情接口响应
type ArticleDetailRes struct {
	g.Meta     `mime:"application/json" example:"{}"`
	CmsArticle *entity.CmsArticle `json:"cmsArticle"`
}
