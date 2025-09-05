package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysDepartmentTree(ctx context.Context, req *v1.SysDepartmentTreeReq) (res *v1.SysDepartmentTreeRes, err error) {
	list, err := admin.SysDepartmentLogic.GetTree(ctx)
	if err != nil {
		return nil, err
	}
	
	return &v1.SysDepartmentTreeRes{
		List: list,
	}, nil
}
