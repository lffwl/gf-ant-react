package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) CategoryCreate(ctx context.Context, req *cms.CategoryCreateReq) (res *cms.CategoryCreateRes, err error) {
	// 调用业务层创建分类
	if err = admin.CmsCategoryLogic.CreateCategory(ctx, req); err != nil {
		return nil, err
	}

	return &cms.CategoryCreateRes{}, nil
}
