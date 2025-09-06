package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysRoleDelete(ctx context.Context, req *v1.SysRoleDeleteReq) (res *v1.SysRoleDeleteRes, err error) {
	// 调用业务层删除角色
	err = admin.SysRoleLogic.Delete(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &v1.SysRoleDeleteRes{}, nil
}
