package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysUserUpdatePassword(ctx context.Context, req *v1.SysUserUpdatePasswordReq) (res *v1.SysUserUpdatePasswordRes, err error) {

	if err := admin.SysUserLogic.UpdatePassword(ctx, &adminModel.SysUserUpdatePasswordParam{
		Id:           req.Id,
		PasswordHash: req.Password,
	}); err != nil {
		return nil, err
	}

	return nil, nil
}
