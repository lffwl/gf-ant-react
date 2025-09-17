package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/util/gconv"
)

type CmsCategory struct{}

var CmsCategoryService = &CmsCategory{}

// CreateCategory 保存分类信息到数据库
func (s *CmsCategory) CreateCategory(ctx context.Context, category *entity.CmsCategory) (*entity.CmsCategory, error) {
	// 插入数据库
	id, err := dao.CmsCategory.Ctx(ctx).InsertAndGetId(category)
	if err != nil {
		return nil, err
	}

	category.Id = gconv.Uint64(id)
	return category, nil
}

// UpdateCategory 更新分类信息
func (s *CmsCategory) UpdateCategory(ctx context.Context, category *entity.CmsCategory) error {
	_, err := dao.CmsCategory.Ctx(ctx).
		Where(dao.CmsCategory.Columns().Id, category.Id).
		Update(category)
	return err
}

// DeleteCategory 从数据库中删除分类
func (s *CmsCategory) DeleteCategory(ctx context.Context, id uint64) error {
	_, err := dao.CmsCategory.Ctx(ctx).
		Where(dao.CmsCategory.Columns().Id, id).
		Delete()
	return err
}

// GetCategoryById 根据ID获取分类信息
func (s *CmsCategory) GetCategoryById(ctx context.Context, id uint64) (*entity.CmsCategory, error) {
	var category *entity.CmsCategory
	err := dao.CmsCategory.Ctx(ctx).
		Where(dao.CmsCategory.Columns().Id, id).
		Scan(&category)
	return category, err
}

// GetCategoryTree 获取分类树结构
func (s *CmsCategory) GetCategoryTree(ctx context.Context) ([]*entity.CmsCategory, error) {
	var categories []*entity.CmsCategory
	err := dao.CmsCategory.Ctx(ctx).
		OrderAsc(dao.CmsCategory.Columns().SortOrder).
		OrderAsc(dao.CmsCategory.Columns().Id).
		Scan(&categories)
	return categories, err
}

// CheckSlugExists 检查slug是否已存在
func (s *CmsCategory) CheckSlugExists(ctx context.Context, slug string, excludeId uint64) (bool, error) {
	var count int
	model := dao.CmsCategory.Ctx(ctx).Where(dao.CmsCategory.Columns().Slug, slug)
	if excludeId > 0 {
		model = model.WhereNot(dao.CmsCategory.Columns().Id, excludeId)
	}
	count, err := model.Count()
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetChildCategoryCount 获取子分类数量
func (s *CmsCategory) GetChildCategoryCount(ctx context.Context, parentId uint64) (int, error) {
	count, err := dao.CmsCategory.Ctx(ctx).
		Where(dao.CmsCategory.Columns().ParentId, parentId).
		Count()
	return count, err
}