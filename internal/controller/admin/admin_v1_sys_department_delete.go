package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) SysDepartmentDelete(ctx context.Context, req *v1.SysDepartmentDeleteReq) (res *v1.SysDepartmentDeleteRes, err error) {
	err = admin.SysDepartmentLogic.Delete(ctx, req.Id)
	if err != nil {
		return nil, err
	}
	
	return &v1.SysDepartmentDeleteRes{}, nil
}
