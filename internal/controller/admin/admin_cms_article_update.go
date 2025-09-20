package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleUpdate(ctx context.Context, req *cms.ArticleUpdateReq) (res *cms.ArticleUpdateRes, err error) {
	err = admin.CmsArticleLogic.UpdateArticle(ctx, req)
	return &cms.ArticleUpdateRes{}, err
}
