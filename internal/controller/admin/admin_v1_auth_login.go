package admin

import (
	"context"
	"errors"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
	"gf-ant-react/utility/captcha"
)

func (c *ControllerV1) AuthLogin(ctx context.Context, req *v1.AuthLoginReq) (res *v1.AuthLoginRes, err error) {

	// 验证验证码
	if !captcha.CaptchaUtility.VerifyCaptchaHandler(req.CaptchaId, req.CaptchaCode) {
		return nil, errors.New("验证码错误")
	}

	// 登录
	data, err := admin.AuthLogic.Login(ctx, &adminModel.LoginReq{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		return nil, err
	}

	return &v1.AuthLoginRes{
		LoginRes: data,
	}, nil
}
