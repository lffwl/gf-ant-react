package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleDelete(ctx context.Context, req *cms.ArticleDeleteReq) (res *cms.ArticleDeleteRes, err error) {
	err = admin.CmsArticleLogic.DeleteArticle(ctx, req.Id)
	return &cms.ArticleDeleteRes{}, err
}
