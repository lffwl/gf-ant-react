package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) AuthResetPassword(ctx context.Context, req *v1.AuthResetPasswordReq) (res *v1.AuthResetPasswordRes, err error) {

	// 重置密码
	err = admin.AuthLogic.ResetPassword(ctx, &adminModel.ResetPasswordReq{
		Password: req.Password,
	})
	if err != nil {
		return nil, err
	}

	return nil, nil
}
