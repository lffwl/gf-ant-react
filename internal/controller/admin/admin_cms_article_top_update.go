package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerCms) ArticleTopUpdate(ctx context.Context, req *cms.ArticleTopUpdateReq) (res *cms.ArticleTopUpdateRes, err error) {
	err = admin.CmsArticleLogic.UpdateArticleTopStatus(ctx, req.Id, req.IsTop)
	return &cms.ArticleTopUpdateRes{}, err
}
