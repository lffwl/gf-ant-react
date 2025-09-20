package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleHotUpdate(ctx context.Context, req *cms.ArticleHotUpdateReq) (res *cms.ArticleHotUpdateRes, err error) {
	err = admin.CmsArticleLogic.UpdateArticleHotStatus(ctx, req.Id, req.IsHot)
	return &cms.ArticleHotUpdateRes{}, err
}
