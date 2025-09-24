package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) SiteSettingUpdate(ctx context.Context, req *cms.SiteSettingUpdateReq) (res *cms.SiteSettingUpdateRes, err error) {
	// 调用业务层更新网站设置
	if err = admin.CmsSiteSettingLogic.UpdateSiteSetting(ctx, req); err != nil {
		return nil, err
	}

	return &cms.SiteSettingUpdateRes{}, nil
}
