package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysRoleUpdate(ctx context.Context, req *v1.SysRoleUpdateReq) (res *v1.SysRoleUpdateRes, err error) {
	// 构建角色参数
	roleParam := &adminModel.SysRoleUpdateParam{
		Id:          req.Id,
		Name:        req.Name,
		Description: req.Description,
		DataScope:   req.DataScope,
		Sort:        req.Sort,
		Status:      req.Status,
		ApiIds:      req.ApiIds,
	}

	// 调用业务层更新角色
	err = admin.SysRoleLogic.Update(ctx, roleParam)
	if err != nil {
		return nil, err
	}

	return &v1.SysRoleUpdateRes{}, nil
}
