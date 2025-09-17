package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) CategoryDetail(ctx context.Context, req *cms.CategoryDetailReq) (res *cms.CategoryDetailRes, err error) {
	// 调用业务层获取分类详情
	category, err := admin.CmsCategoryLogic.GetCategoryDetail(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &cms.CategoryDetailRes{
		CmsCategory: category,
	}, nil
}
