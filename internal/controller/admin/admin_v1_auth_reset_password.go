package admin

import (
	"context"
	"errors"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
	"gf-ant-react/utility/auth"
)

func (c *ControllerV1) AuthResetPassword(ctx context.Context, req *v1.AuthResetPasswordReq) (res *v1.AuthResetPasswordRes, err error) {

	userId := auth.GetUserId(ctx)
	if userId == 0 {
		return nil, errors.New("用户不存在")
	}

	// 重置密码
	err = admin.AuthLogic.ResetPassword(ctx, &adminModel.ResetPasswordReq{
		Id:           userId,
		PasswordHash: req.Password,
	})
	if err != nil {
		return nil, err
	}

	return nil, nil
}
