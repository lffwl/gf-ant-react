package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) SiteSettingDelete(ctx context.Context, req *cms.SiteSettingDeleteReq) (res *cms.SiteSettingDeleteRes, err error) {
	// 调用业务层删除网站设置
	if err = admin.CmsSiteSettingLogic.DeleteSiteSetting(ctx, req.Id); err != nil {
		return nil, err
	}

	return &cms.SiteSettingDeleteRes{}, nil
}
