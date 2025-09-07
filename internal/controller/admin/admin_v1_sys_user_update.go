package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysUserUpdate(ctx context.Context, req *v1.SysUserUpdateReq) (res *v1.SysUserUpdateRes, err error) {
	param := &adminModel.SysUserUpdateParam{
		Id:           req.Id,
		Username:     req.Username,
		Email:        req.Email,
		Mobile:       req.Mobile,
		DepartmentId: req.DepartmentId,
		Status:       req.Status,
		RoleIds:      req.RoleIds,
	}

	err = admin.SysUserLogic.Update(ctx, param)
	if err != nil {
		return nil, err
	}

	return &v1.SysUserUpdateRes{}, nil
}
