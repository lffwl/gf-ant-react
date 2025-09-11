package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) AuthCaptcha(ctx context.Context, req *v1.AuthCaptchaReq) (res *v1.AuthCaptchaRes, err error) {
	captchaRes, err := admin.AuthLogic.Captcha(ctx, &adminModel.CaptchaReq{
		Width:  req.Width,
		Height: req.Height,
		Length: 6,
	})
	if err != nil {
		return nil, err
	}
	return &v1.AuthCaptchaRes{
		Id:     captchaRes.Id,
		Base64: captchaRes.Base64,
	}, nil
}
