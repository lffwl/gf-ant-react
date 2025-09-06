package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysRoleList(ctx context.Context, req *v1.SysRoleListReq) (res *v1.SysRoleListRes, err error) {
	// 调用业务层获取角色列表
	list, total, err := admin.SysRoleLogic.GetList(ctx, req.Page, req.Size, req.Name, req.Status)
	if err != nil {
		return nil, err
	}

	return &v1.SysRoleListRes{
		List:  list,
		Total: total,
	}, nil
}
