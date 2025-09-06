package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysRoleDetail(ctx context.Context, req *v1.SysRoleDetailReq) (res *v1.SysRoleDetailRes, err error) {
	// 调用业务层获取角色详情
	role, apiIds, err := admin.SysRoleLogic.GetById(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &v1.SysRoleDetailRes{
		Id:          role.Id,
		Name:        role.Name,
		Description: role.Description,
		DataScope:   role.DataScope,
		Sort:        role.Sort,
		Status:      role.Status,
		ApiIds:      apiIds,
		CreatedAt:   role.CreatedAt.String(),
		UpdatedAt:   role.UpdatedAt.String(),
	}, nil
}
