package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleRecommendUpdate(ctx context.Context, req *cms.ArticleRecommendUpdateReq) (res *cms.ArticleRecommendUpdateRes, err error) {
	err = admin.CmsArticleLogic.UpdateArticleRecommendStatus(ctx, req.Id, req.IsRecommend)
	return &cms.ArticleRecommendUpdateRes{}, err
}
