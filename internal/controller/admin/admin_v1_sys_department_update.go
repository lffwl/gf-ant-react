package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysDepartmentUpdate(ctx context.Context, req *v1.SysDepartmentUpdateReq) (res *v1.SysDepartmentUpdateRes, err error) {
	data := &adminModel.SysDepartmentUpdateParam{
		Id:       req.Id,
		ParentId: req.ParentId,
		Name:     req.Name,
		Sort:     req.Sort,
		Status:   req.Status,
	}
	
	err = admin.SysDepartmentLogic.Update(ctx, data)
	if err != nil {
		return nil, err
	}
	
	return &v1.SysDepartmentUpdateRes{}, nil
}
