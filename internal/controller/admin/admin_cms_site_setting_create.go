package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) SiteSettingCreate(ctx context.Context, req *cms.SiteSettingCreateReq) (res *cms.SiteSettingCreateRes, err error) {

	// 调用业务层创建网站设置
	if err = admin.CmsSiteSettingLogic.CreateSiteSetting(ctx, req); err != nil {
		return nil, err
	}

	return &cms.SiteSettingCreateRes{}, nil
}
