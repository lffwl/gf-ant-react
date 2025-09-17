package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) CategoryDelete(ctx context.Context, req *cms.CategoryDeleteReq) (res *cms.CategoryDeleteRes, err error) {
	// 调用业务层删除分类
	if err = admin.CmsCategoryLogic.DeleteCategory(ctx, req.Id); err != nil {
		return nil, err
	}

	return &cms.CategoryDeleteRes{}, nil
}
