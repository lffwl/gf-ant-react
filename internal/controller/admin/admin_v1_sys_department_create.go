package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	"gf-ant-react/internal/model/entity"
)

func (c *ControllerV1) SysDepartmentCreate(ctx context.Context, req *v1.SysDepartmentCreateReq) (res *v1.SysDepartmentCreateRes, err error) {
	data := &entity.SysDepartments{
		ParentId: req.ParentId,
		Name:     req.Name,
		Sort:     req.Sort,
		Status:   req.Status,
	}
	
	id, err := admin.SysDepartmentLogic.Create(ctx, data)
	if err != nil {
		return nil, err
	}
	
	return &v1.SysDepartmentCreateRes{Id: id}, nil
}
