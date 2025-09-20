package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleStatusUpdate(ctx context.Context, req *cms.ArticleStatusUpdateReq) (res *cms.ArticleStatusUpdateRes, err error) {
	err = admin.CmsArticleLogic.UpdateArticleStatus(ctx, req.Id, req.Status)
	return &cms.ArticleStatusUpdateRes{}, err
}
