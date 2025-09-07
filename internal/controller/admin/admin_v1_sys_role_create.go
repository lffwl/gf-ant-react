package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysRoleCreate(ctx context.Context, req *v1.SysRoleCreateReq) (res *v1.SysRoleCreateRes, err error) {
	// 构建角色参数
	roleParam := &adminModel.SysRoleCreateParam{
		Name:        req.Name,
		Description: req.Description,
		DataScope:   req.DataScope,
		Sort:        req.Sort,
		Status:      req.Status,
		ApiIds:      req.ApiIds,
	}

	// 调用业务层创建角色
	roleId, err := admin.SysRoleLogic.Create(ctx, roleParam)
	if err != nil {
		return nil, err
	}

	return &v1.SysRoleCreateRes{Id: roleId}, nil
}
