package cms

import (
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// 分类创建接口
type CategoryCreateReq struct {
	g.Meta         `path:"/sys/cms/category" tags:"Category" method:"post" summary:"新增"`
	Name           string      `p:"name" v:"required|length:2,50#栏目名称不能为空|栏目名称长度必须在2-50个字符之间" description:"栏目名称"`
	Slug           string      `p:"slug" v:"required|regex:^[a-zA-Z0-9_-]+$#栏目别名不能为空|栏目别名只能包含字母、数字、下划线和连字符" description:"栏目别名/URL标识"`
	Description    string      `p:"description" v:"length:0,255#栏目描述长度不能超过255个字符" description:"栏目描述"`
	ParentId       uint64      `p:"parentId" v:"integer#父级栏目ID必须为整数" description:"父级栏目ID"`
	ContentType    string      `p:"contentType" v:"required#关联的内容类型不能为空" description:"关联的内容类型"`
	IsNav          bool        `p:"isNav" description:"是否显示在主导航"`
	SortOrder      int         `p:"sortOrder" v:"integer#排序权重必须为整数" description:"排序权重"`
	Status         bool        `p:"status" description:"状态"`
	DeletedAt      *gtime.Time `p:"deletedAt" description:"软删除时间"`
	CoverImage     string      `p:"coverImage" v:"url#封面图片URL格式不正确" description:"栏目封面图片URL"`
	SeoTitle       string      `p:"seoTitle" v:"length:0,100#SEO标题长度不能超过100个字符" description:"SEO标题"`
	SeoKeywords    string      `p:"seoKeywords" v:"length:0,255#SEO关键词长度不能超过255个字符" description:"SEO关键词"`
	SeoDescription string      `p:"seoDescription" v:"length:0,255#SEO描述长度不能超过255个字符" description:"SEO描述"`
	Extra          string      `p:"extra" v:"length:0,1000#扩展属性长度不能超过1000个字符" description:"扩展属性"`
}

// 分类创建接口响应
type CategoryCreateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 分类创建接口
type CategoryUpdateReq struct {
	g.Meta         `path:"/sys/cms/category/:id" tags:"Category" method:"put" summary:"更新"`
	Id             uint64      `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	Name           string      `p:"name" v:"required|length:2,50#栏目名称不能为空|栏目名称长度必须在2-50个字符之间" description:"栏目名称"`
	Slug           string      `p:"slug" v:"required|regex:^[a-zA-Z0-9_-]+$#栏目别名不能为空|栏目别名只能包含字母、数字、下划线和连字符" description:"栏目别名/URL标识"`
	Description    string      `p:"description" v:"length:0,255#栏目描述长度不能超过255个字符" description:"栏目描述"`
	ParentId       uint64      `p:"parentId" v:"integer#父级栏目ID必须为整数" description:"父级栏目ID"`
	ContentType    string      `p:"contentType" v:"required#关联的内容类型不能为空" description:"关联的内容类型"`
	IsNav          bool        `p:"isNav" description:"是否显示在主导航"`
	SortOrder      int         `p:"sortOrder" v:"integer#排序权重必须为整数" description:"排序权重"`
	Status         bool        `p:"status" description:"状态"`
	DeletedAt      *gtime.Time `p:"deletedAt" description:"软删除时间"`
	CoverImage     string      `p:"coverImage" v:"url#封面图片URL格式不正确" description:"栏目封面图片URL"`
	SeoTitle       string      `p:"seoTitle" v:"length:0,100#SEO标题长度不能超过100个字符" description:"SEO标题"`
	SeoKeywords    string      `p:"seoKeywords" v:"length:0,255#SEO关键词长度不能超过255个字符" description:"SEO关键词"`
	SeoDescription string      `p:"seoDescription" v:"length:0,255#SEO描述长度不能超过255个字符" description:"SEO描述"`
	Extra          string      `p:"extra" v:"length:0,1000#扩展属性长度不能超过1000个字符" description:"扩展属性"`
}

// 分类更新接口响应
type CategoryUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 分类删除接口
type CategoryDeleteReq struct {
	g.Meta `path:"/sys/cms/category/:id" tags:"Category" method:"delete" summary:"删除"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
}

// 分类删除接口响应
type CategoryDeleteRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 分类详情接口
type CategoryDetailReq struct {
	g.Meta `path:"/sys/cms/category/:id" tags:"Category" method:"get" summary:"详情"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
}

// 分类详情接口响应
type CategoryDetailRes struct {
	g.Meta `mime:"application/json" example:"{}"`
	*entity.CmsCategory
}

// 分类列表接口
type CategoryTreeReq struct {
	g.Meta `path:"/sys/cms/category/tree" tags:"Category" method:"get" summary:"列表"`
}

// 分类列表接口响应
type CategoryTreeRes struct {
	g.Meta `mime:"application/json" example:"{}"`
	List   []*entity.CmsCategory `json:"list"`
}
