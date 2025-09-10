package admin

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "gf-ant-react/api/admin/v1"
)

func (c *ControllerV1) AuthCaptcha(ctx context.Context, req *v1.AuthCaptchaReq) (res *v1.AuthCaptchaRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
