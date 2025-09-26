package cms

import (
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

// 网站设置创建接口
type SiteSettingCreateReq struct {
	g.Meta       `path:"/sys/cms/site-setting" tags:"SiteSetting" method:"post" summary:"新增网站设置"`
	SettingKey   string `p:"settingKey" v:"required|length:2,100#配置项键名不能为空|配置项键名长度必须在2-100个字符之间" description:"配置项键名，如 site_name, contact_email, enable_register"`
	SettingValue string `p:"settingValue" v:"length:0,4000#配置项值长度不能超过4000个字符" description:"配置项值，可为字符串、JSON 或其他序列化格式"`
	ValueType    string `p:"valueType" v:"required|length:1,20#值类型不能为空|值类型长度必须在1-20个字符之间" description:"值类型"`
	Group        string `p:"group" v:"required|length:2,50#配置分组不能为空|配置分组长度必须在2-50个字符之间" description:"配置分组，如 general, seo, email, social, security"`
	Description  string `p:"description" v:"length:0,500#配置项说明长度不能超过500个字符" description:"配置项说明"`
}

// 网站设置创建接口响应
type SiteSettingCreateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 网站设置更新接口
type SiteSettingUpdateReq struct {
	g.Meta       `path:"/sys/cms/site-setting/:id" tags:"SiteSetting" method:"put" summary:"更新网站设置"`
	Id           uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
	SettingKey   string `p:"settingKey" v:"required|length:2,100#配置项键名不能为空|配置项键名长度必须在2-100个字符之间" description:"配置项键名，如 site_name, contact_email, enable_register"`
	SettingValue string `p:"settingValue" v:"length:0,4000#配置项值长度不能超过4000个字符" description:"配置项值，可为字符串、JSON 或其他序列化格式"`
	ValueType    string `p:"valueType" v:"required|length:1,20#值类型不能为空|值类型长度必须在1-20个字符之间" description:"值类型"`
	Group        string `p:"group" v:"required|length:2,50#配置分组不能为空|配置分组长度必须在2-50个字符之间" description:"配置分组，如 general, seo, email, social, security"`
	Description  string `p:"description" v:"length:0,500#配置项说明长度不能超过500个字符" description:"配置项说明"`
}

// 网站设置更新接口响应
type SiteSettingUpdateRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 网站设置删除接口
type SiteSettingDeleteReq struct {
	g.Meta `path:"/sys/cms/site-setting/:id" tags:"SiteSetting" method:"delete" summary:"删除网站设置"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
}

// 网站设置删除接口响应
type SiteSettingDeleteRes struct {
	g.Meta `mime:"application/json" example:"{}"`
}

// 网站设置详情接口
type SiteSettingDetailReq struct {
	g.Meta `path:"/sys/cms/site-setting/:id" tags:"SiteSetting" method:"get" summary:"网站设置详情"`
	Id     uint64 `p:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"ID"`
}

// 网站设置详情接口响应
type SiteSettingDetailRes struct {
	g.Meta `mime:"application/json" example:"{}"`
	*entity.CmsSiteSetting
}

// 网站设置列表接口
type SiteSettingListReq struct {
	g.Meta     `path:"/sys/cms/site-setting/list" tags:"SiteSetting" method:"get" summary:"网站设置列表"`
	Page       int    `p:"page" d:"1" v:"required|integer#分页页码不能为空|分页页码必须为整数" description:"分页页码"`
	Size       int    `p:"size" d:"10" v:"required|integer#分页数量不能为空|分页数量必须为整数" description:"分页数量"`
	Group      string `p:"group" description:"配置分组，如 general, seo, email, social, security"`
	SettingKey string `p:"settingKey" description:"配置项键名"`
}

// 网站设置列表接口响应
type SiteSettingListRes struct {
	g.Meta `mime:"application/json" example:"{}"`
	List   []*entity.CmsSiteSetting `json:"list"`
	Total  int                      `json:"total"`
	Config SiteSettingListResConfig `json:"config"`
}

type SiteSettingListResConfig struct {
	Groups []string `json:"groups"`
}
