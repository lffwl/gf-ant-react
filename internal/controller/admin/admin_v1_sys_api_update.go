package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	"gf-ant-react/internal/model/entity"
)

func (c *ControllerV1) SysApiUpdate(ctx context.Context, req *v1.SysApiUpdateReq) (res *v1.SysApiUpdateRes, err error) {
	api := &entity.SysApis{
		Id:             req.Id,
		ParentId:       req.ParentId,
		Name:           req.Name,
		PermissionCode: req.PermissionCode,
		Url:            req.Url,
		Method:         req.Method,
		Sort:           req.Sort,
		Status:         req.Status,
		IsMenu:         req.IsMenu,
		Description:    req.Description,
	}

	err = admin.SysApiLogic.Update(ctx, api)
	if err != nil {
		return nil, err
	}

	return &v1.SysApiUpdateRes{}, nil
}
