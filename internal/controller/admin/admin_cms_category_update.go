package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) CategoryUpdate(ctx context.Context, req *cms.CategoryUpdateReq) (res *cms.CategoryUpdateRes, err error) {
	// 调用业务层更新分类
	if err = admin.CmsCategoryLogic.UpdateCategory(ctx, req); err != nil {
		return nil, err
	}

	return &cms.CategoryUpdateRes{}, nil
}
