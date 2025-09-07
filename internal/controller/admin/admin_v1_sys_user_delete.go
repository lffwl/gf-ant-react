package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysUserDelete(ctx context.Context, req *v1.SysUserDeleteReq) (res *v1.SysUserDeleteRes, err error) {
	err = admin.SysUserLogic.Delete(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &v1.SysUserDeleteRes{}, nil
}