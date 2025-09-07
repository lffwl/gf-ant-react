package admin

import (
	"context"
	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysApiTree(ctx context.Context, req *v1.SysApiTreeReq) (res *v1.SysApiTreeRes, err error) {
	result, err := admin.SysApiLogic.GetTree(ctx)
	if err != nil {
		return nil, err
	}

	return &v1.SysApiTreeRes{List: result.List, Config: result.Config}, nil
}
