package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysUserDetail(ctx context.Context, req *v1.SysUserDetailReq) (res *v1.SysUserDetailRes, err error) {
	detail, roleIds, err := admin.SysUserLogic.GetById(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &v1.SysUserDetailRes{
		SysUsers: detail,
		RoleIds:  roleIds,
	}, nil
}
