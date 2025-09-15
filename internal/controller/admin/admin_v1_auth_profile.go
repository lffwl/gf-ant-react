package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
	"gf-ant-react/utility/auth"
)

func (c *ControllerV1) AuthProfile(ctx context.Context, req *v1.AuthProfileReq) (res *v1.AuthProfileRes, err error) {

	res = &v1.AuthProfileRes{}

	// 个人中心
	res.ProfileRes, err = admin.AuthLogic.Profile(ctx, &adminModel.ProfileReq{
		UserId: auth.GetUserId(ctx),
	})
	if err != nil {
		return nil, err
	}

	return
}
