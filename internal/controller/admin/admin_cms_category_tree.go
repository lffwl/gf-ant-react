package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
)

func (c *ControllerCms) CategoryTree(ctx context.Context, req *cms.CategoryTreeReq) (res *cms.CategoryTreeRes, err error) {
	// 调用业务层获取分类树
	categories, err := admin.CmsCategoryLogic.GetCategoryTree(ctx)
	if err != nil {
		return nil, err
	}

	return &cms.CategoryTreeRes{
		List: categories,
		Config: &cms.CategoryTreeResConfig{
			CategoryContentTypeMap: adminModel.CmsCategoryContentTypeMap,
		},
	}, nil
}
