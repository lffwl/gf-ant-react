package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	"gf-ant-react/internal/model/entity"
)

func (c *ControllerV1) SysUserCreate(ctx context.Context, req *v1.SysUserCreateReq) (res *v1.SysUserCreateRes, err error) {
	user := &entity.SysUsers{
		Username:     req.Username,
		PasswordHash: req.PasswordHash,
		Email:        req.Email,
		Mobile:       req.Mobile,
		Status:       req.Status,
	}

	_, err = admin.SysUserLogic.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return &v1.SysUserCreateRes{}, nil
}
