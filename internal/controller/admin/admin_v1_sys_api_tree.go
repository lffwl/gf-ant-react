package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	"gf-ant-react/internal/model/sys_api"
)

func (c *ControllerV1) SysApiTree(ctx context.Context, req *v1.SysApiTreeReq) (res *v1.SysApiTreeRes, err error) {
	apis, err := admin.SysApiLogic.GetTree(ctx)
	if err != nil {
		return nil, err
	}

	return &v1.SysApiTreeRes{List: apis, Config: map[string]interface{}{
		"methodMap": sys_api.MethodMap,
		"isMenuMap": sys_api.IsMenuMap,
		"statusMap": sys_api.StatusMap,
	}}, nil
}
