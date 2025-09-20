package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleDetail(ctx context.Context, req *cms.ArticleDetailReq) (res *cms.ArticleDetailRes, err error) {
	article, err := admin.CmsArticleLogic.GetArticleDetail(ctx, req.Id)
	if err != nil {
		return nil, err
	}
	
	return &cms.ArticleDetailRes{
		CmsArticle: article,
	}, nil
}