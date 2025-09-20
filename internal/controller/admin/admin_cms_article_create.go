package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleCreate(ctx context.Context, req *cms.ArticleCreateReq) (res *cms.ArticleCreateRes, err error) {
	err = admin.CmsArticleLogic.CreateArticle(ctx, req)
	return &cms.ArticleCreateRes{}, err
}
