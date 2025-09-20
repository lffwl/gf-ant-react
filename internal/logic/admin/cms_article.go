package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
)

type sCmsArticleLogic struct{}

var CmsArticleLogic = &sCmsArticleLogic{}

// CreateArticle 创建文章
func (s *sCmsArticleLogic) CreateArticle(ctx context.Context, req *cms.ArticleCreateReq) error {
	// 检查文章标题是否已存在
	exists, err := service.CmsArticleService.CheckTitleExists(ctx, req.Title, 0)
	if err != nil {
		return err
	}
	if exists {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章标题已存在")
	}

	// 创建文章实体
	article := &entity.CmsArticle{
		Title:          req.Title,
		Summary:        req.Summary,
		Content:        req.Content,
		ArticleType:    req.ArticleType,
		ExternalUrl:    req.ExternalUrl,
		CategoryId:     req.CategoryId,
		AuthorName:     req.AuthorName,
		CoverImage:     req.CoverImage,
		Status:         req.Status,
		IsTop:          req.IsTop,
		IsHot:          req.IsHot,
		IsRecommend:    req.IsRecommend,
		PublishAt:      req.PublishAt,
		SeoTitle:       req.SeoTitle,
		SeoKeywords:    req.SeoKeywords,
		SeoDescription: req.SeoDescription,
		Extra:          req.Extra,
	}

	// 调用服务层保存文章
	_, err = service.CmsArticleService.CreateArticle(ctx, article)
	return err
}

// UpdateArticle 更新文章
func (s *sCmsArticleLogic) UpdateArticle(ctx context.Context, req *cms.ArticleUpdateReq) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, req.Id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 检查文章标题是否已被其他文章使用
	exists, err := service.CmsArticleService.CheckTitleExists(ctx, req.Title, req.Id)
	if err != nil {
		return err
	}
	if exists {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章标题已存在")
	}

	// 更新文章信息
	article.Title = req.Title
	article.Summary = req.Summary
	article.Content = req.Content
	article.ArticleType = req.ArticleType
	article.ExternalUrl = req.ExternalUrl
	article.CategoryId = req.CategoryId
	article.AuthorName = req.AuthorName
	article.CoverImage = req.CoverImage
	article.Status = req.Status
	article.IsTop = req.IsTop
	article.IsHot = req.IsHot
	article.IsRecommend = req.IsRecommend
	article.PublishAt = req.PublishAt
	article.SeoTitle = req.SeoTitle
	article.SeoKeywords = req.SeoKeywords
	article.SeoDescription = req.SeoDescription
	article.Extra = req.Extra

	// 调用服务层更新文章
	return service.CmsArticleService.UpdateArticle(ctx, article)
}

// DeleteArticle 删除文章
func (s *sCmsArticleLogic) DeleteArticle(ctx context.Context, id uint64) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 调用服务层删除文章
	return service.CmsArticleService.DeleteArticle(ctx, id)
}

// GetArticleDetail 获取文章详情
func (s *sCmsArticleLogic) GetArticleDetail(ctx context.Context, id uint64) (*entity.CmsArticle, error) {
	// 调用服务层获取文章详情
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return nil, err
	}
	if article == nil {
		return nil, gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	return article, nil
}

// GetArticleList 获取文章列表
func (s *sCmsArticleLogic) GetArticleList(ctx context.Context, req *cms.ArticleListReq) ([]*entity.CmsArticle, int, error) {
	// 构建筛选条件
	filters := g.Map{
		"title":       req.Title,
		"categoryId":  req.CategoryId,
		"status":      req.Status,
		"articleType": req.ArticleType,
		"isTop":       req.IsTop,
		"isHot":       req.IsHot,
		"isRecommend": req.IsRecommend,
	}

	// 调用服务层获取文章列表
	articles, total, err := service.CmsArticleService.GetArticleList(ctx, req.Page, req.Size, filters)
	if err != nil {
		return nil, 0, err
	}

	return articles, total, nil
}

// UpdateArticleStatus 更新文章发布状态
func (s *sCmsArticleLogic) UpdateArticleStatus(ctx context.Context, id uint64, status bool) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 调用服务层更新状态
	return service.CmsArticleService.UpdateArticleStatus(ctx, id, status)
}

// UpdateArticleTopStatus 更新文章置顶状态
func (s *sCmsArticleLogic) UpdateArticleTopStatus(ctx context.Context, id uint64, isTop bool) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 调用服务层更新置顶状态
	return service.CmsArticleService.UpdateArticleTopStatus(ctx, id, isTop)
}

// UpdateArticleHotStatus 更新文章热门状态
func (s *sCmsArticleLogic) UpdateArticleHotStatus(ctx context.Context, id uint64, isHot bool) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 调用服务层更新热门状态
	return service.CmsArticleService.UpdateArticleHotStatus(ctx, id, isHot)
}

// UpdateArticleRecommendStatus 更新文章推荐状态
func (s *sCmsArticleLogic) UpdateArticleRecommendStatus(ctx context.Context, id uint64, isRecommend bool) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 调用服务层更新推荐状态
	return service.CmsArticleService.UpdateArticleRecommendStatus(ctx, id, isRecommend)
}

// IncreaseViewCount 增加文章浏览次数
func (s *sCmsArticleLogic) IncreaseViewCount(ctx context.Context, id uint64) error {
	// 检查文章是否存在
	article, err := service.CmsArticleService.GetArticleById(ctx, id)
	if err != nil {
		return err
	}
	if article == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "文章不存在")
	}

	// 调用服务层增加浏览次数
	return service.CmsArticleService.IncreaseViewCount(ctx, id)
}