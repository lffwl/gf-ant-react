package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	"gf-ant-react/internal/model/entity"
)

func (c *ControllerV1) SysRoleCreate(ctx context.Context, req *v1.SysRoleCreateReq) (res *v1.SysRoleCreateRes, err error) {
	// 构建角色实体
	role := &entity.SysRoles{
		Name:        req.Name,
		Description: req.Description,
		DataScope:   req.DataScope,
		Sort:        req.Sort,
		Status:      req.Status,
	}

	// 调用业务层创建角色
	roleId, err := admin.SysRoleLogic.Create(ctx, role, req.ApiIds)
	if err != nil {
		return nil, err
	}

	return &v1.SysRoleCreateRes{Id: roleId}, nil
}
