package admin

import (
	"context"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerV1) SysApiCreate(ctx context.Context, req *v1.SysApiCreateReq) (res *v1.SysApiCreateRes, err error) {
	apiParam := &adminModel.SysApiCreateParam{
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

	id, err := admin.SysApiLogic.Create(ctx, apiParam)
	if err != nil {
		return nil, err
	}

	return &v1.SysApiCreateRes{Id: id}, nil
}
