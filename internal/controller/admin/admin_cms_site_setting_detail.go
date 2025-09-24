package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) SiteSettingDetail(ctx context.Context, req *cms.SiteSettingDetailReq) (res *cms.SiteSettingDetailRes, err error) {
	// 调用业务层获取网站设置详情
	setting, err := admin.CmsSiteSettingLogic.GetSiteSettingDetail(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &cms.SiteSettingDetailRes{
		CmsSiteSetting: setting,
	},
		nil
}
