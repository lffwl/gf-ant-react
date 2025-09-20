package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/logic/admin"
	"gf-ant-react/internal/model/entity"
)

func (c *ControllerCms) ArticleList(ctx context.Context, req *cms.ArticleListReq) (res *cms.ArticleListRes, err error) {
	var articles []*entity.CmsArticle
	var total int
	
	articles, total, err = admin.CmsArticleLogic.GetArticleList(ctx, req)
	if err != nil {
		return nil, err
	}
	
	return &cms.ArticleListRes{
		List:  articles,
		Total: total,
		Page:  req.Page,
		Size:  req.Size,
	}, nil
}
