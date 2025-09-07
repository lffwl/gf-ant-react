package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysUserList(ctx context.Context, req *v1.SysUserListReq) (res *v1.SysUserListRes, err error) {
	param := &adminModel.SysUserListParam{
		Page:         req.Page,
		Size:         req.Size,
		Username:     req.Username,
		DepartmentId: req.DepartmentId,
		Status:       req.Status,
	}

	result, err := admin.SysUserLogic.GetList(ctx, param)
	if err != nil {
		return nil, err
	}

	return &v1.SysUserListRes{
		List:           result.List,
		Total:          result.Total,
		RoleList:       result.RoleList,
		DepartmentList: result.DepartmentList,
	}, nil
}
