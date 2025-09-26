package admin

type GetSiteSettingListReq struct {
	Page  int    `p:"page" d:"1" v:"required|integer#分页页码不能为空|分页页码必须为整数" description:"分页页码"`
	Size  int    `p:"size" d:"10" v:"required|integer#分页数量不能为空|分页数量必须为整数" description:"分页数量"`
	Group string `p:"group" description:"配置分组，如 general, seo, email, social, security"`
	Key   string `p:"key" description:"配置项键名"`
}
