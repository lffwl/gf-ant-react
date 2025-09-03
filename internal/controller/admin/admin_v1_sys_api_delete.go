package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysApiDelete(ctx context.Context, req *v1.SysApiDeleteReq) (res *v1.SysApiDeleteRes, err error) {
	err = admin.SysApiLogic.Delete(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &v1.SysApiDeleteRes{}, nil
}
