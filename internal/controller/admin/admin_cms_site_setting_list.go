package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) SiteSettingList(ctx context.Context, req *cms.SiteSettingListReq) (res *cms.SiteSettingListRes, err error) {
	// 调用业务层获取网站设置列表
	list, total, err := admin.CmsSiteSettingLogic.GetSiteSettingList(ctx, req)
	if err != nil {
		return nil, err
	}
	// 调用业务层获取网站设置分组列表
	groups, err := admin.CmsSiteSettingLogic.GetSiteSettingGroups(ctx)
	if err != nil {
		return nil, err
	}

	return &cms.SiteSettingListRes{
		List:  list,
		Total: total,
		Config: cms.SiteSettingListResConfig{
			Groups: groups,
		},
	}, nil
}
