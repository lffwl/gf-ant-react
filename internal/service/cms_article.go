package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/util/gconv"
)

type CmsArticle struct{}

var CmsArticleService = &CmsArticle{}

// CreateArticle 保存文章信息到数据库
func (s *CmsArticle) CreateArticle(ctx context.Context, article *entity.CmsArticle) (*entity.CmsArticle, error) {
	// 插入数据库
	if article.Extra == "" {
		article.Extra = "{}"
	}
	id, err := dao.CmsArticle.Ctx(ctx).InsertAndGetId(article)
	if err != nil {
		return nil, err
	}

	article.Id = gconv.Uint64(id)
	return article, nil
}

// UpdateArticle 更新文章信息
func (s *CmsArticle) UpdateArticle(ctx context.Context, article *entity.CmsArticle) error {
	if article.Extra == "" {
		article.Extra = "{}"
	}
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, article.Id).
		Update(article)
	return err
}

// DeleteArticle 从数据库中删除文章（软删除）
func (s *CmsArticle) DeleteArticle(ctx context.Context, id uint64) error {
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Delete()
	return err
}

// GetArticleById 根据ID获取文章信息
func (s *CmsArticle) GetArticleById(ctx context.Context, id uint64) (*entity.CmsArticle, error) {
	var article *entity.CmsArticle
	err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Scan(&article)
	return article, err
}

// GetArticleList 获取文章列表
func (s *CmsArticle) GetArticleList(ctx context.Context, page, size int, filters map[string]interface{}) ([]*entity.CmsArticle, int, error) {
	model := dao.CmsArticle.Ctx(ctx)

	// 应用筛选条件
	if title, ok := filters["title"]; ok && title != "" {
		model = model.WhereLike(dao.CmsArticle.Columns().Title, "%"+gconv.String(title)+"%")
	}
	if categoryId, ok := filters["categoryId"]; ok && categoryId != "" && categoryId != "0" {
		model = model.Where(dao.CmsArticle.Columns().CategoryId, categoryId)
	}
	if status, ok := filters["status"]; ok && status != "" && status != "all" {
		model = model.Where(dao.CmsArticle.Columns().Status, status)
	}
	if articleType, ok := filters["articleType"]; ok && articleType != "" && articleType != "all" {
		model = model.Where(dao.CmsArticle.Columns().ArticleType, articleType)
	}
	if isTop, ok := filters["isTop"]; ok && isTop != "" && isTop != "all" {
		model = model.Where(dao.CmsArticle.Columns().IsTop, isTop)
	}
	if isHot, ok := filters["isHot"]; ok && isHot != "" && isHot != "all" {
		model = model.Where(dao.CmsArticle.Columns().IsHot, isHot)
	}
	if isRecommend, ok := filters["isRecommend"]; ok && isRecommend != "" && isRecommend != "all" {
		model = model.Where(dao.CmsArticle.Columns().IsRecommend, isRecommend)
	}

	// 获取总数
	total, err := model.Count()
	if err != nil {
		return nil, 0, err
	}

	// 获取分页数据
	var articles []*entity.CmsArticle
	err = model.
		OrderDesc(dao.CmsArticle.Columns().IsTop).
		OrderDesc(dao.CmsArticle.Columns().PublishAt).
		OrderDesc(dao.CmsArticle.Columns().CreatedAt).
		Limit((page-1)*size, size).
		Scan(&articles)

	return articles, total, err
}

// UpdateArticleStatus 更新文章发布状态
func (s *CmsArticle) UpdateArticleStatus(ctx context.Context, id uint64, status bool) error {
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Data(g.Map{
			dao.CmsArticle.Columns().Status: status,
		}).
		Update()
	return err
}

// UpdateArticleTopStatus 更新文章置顶状态
func (s *CmsArticle) UpdateArticleTopStatus(ctx context.Context, id uint64, isTop bool) error {
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Data(g.Map{
			dao.CmsArticle.Columns().IsTop: isTop,
		}).
		Update()
	return err
}

// UpdateArticleHotStatus 更新文章热门状态
func (s *CmsArticle) UpdateArticleHotStatus(ctx context.Context, id uint64, isHot bool) error {
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Data(g.Map{
			dao.CmsArticle.Columns().IsHot: isHot,
		}).
		Update()
	return err
}

// UpdateArticleRecommendStatus 更新文章推荐状态
func (s *CmsArticle) UpdateArticleRecommendStatus(ctx context.Context, id uint64, isRecommend bool) error {
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Data(g.Map{
			dao.CmsArticle.Columns().IsRecommend: isRecommend,
		}).
		Update()
	return err
}

// IncreaseViewCount 增加文章浏览次数
func (s *CmsArticle) IncreaseViewCount(ctx context.Context, id uint64) error {
	_, err := dao.CmsArticle.Ctx(ctx).
		Where(dao.CmsArticle.Columns().Id, id).
		Increment(dao.CmsArticle.Columns().ViewCount, 1)
	return err
}

// CheckTitleExists 检查文章标题是否已存在
func (s *CmsArticle) CheckTitleExists(ctx context.Context, title string, excludeId uint64) (bool, error) {
	var count int
	model := dao.CmsArticle.Ctx(ctx).Where(dao.CmsArticle.Columns().Title, title)
	if excludeId > 0 {
		model = model.WhereNot(dao.CmsArticle.Columns().Id, excludeId)
	}
	count, err := model.Count()
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
