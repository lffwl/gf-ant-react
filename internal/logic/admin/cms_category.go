package admin

import (
	"context"
	"fmt"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
)

type sCmsCategoryLogic struct{}

var CmsCategoryLogic = &sCmsCategoryLogic{}

// CreateCategory 创建分类
func (s *sCmsCategoryLogic) CreateCategory(ctx context.Context, req *cms.CategoryCreateReq) error {

	if req.Slug != "" {
		// 检查slug是否已存在
		exists, err := service.CmsCategoryService.CheckSlugExists(ctx, req.Slug, 0)
		if err != nil {
			return err
		}
		if exists {
			return gerror.NewCode(gcode.CodeBusinessValidationFailed, "栏目别名已存在")
		}
	}

	// 创建分类实体
	category := &entity.CmsCategory{
		Name:           req.Name,
		Slug:           req.Slug,
		Description:    req.Description,
		ParentId:       req.ParentId,
		CType:          req.CType,
		LinkUrl:        req.LinkUrl,
		IsNav:          req.IsNav,
		SortOrder:      req.SortOrder,
		Status:         req.Status,
		CoverImage:     req.CoverImage,
		SeoTitle:       req.SeoTitle,
		SeoKeywords:    req.SeoKeywords,
		SeoDescription: req.SeoDescription,
		Extra:          req.Extra,
	}

	// 如果是子分类，设置层级和路径
	if req.ParentId > 0 {
		parentCategory, err := service.CmsCategoryService.GetCategoryById(ctx, req.ParentId)
		if err != nil {
			return err
		}
		if parentCategory == nil {
			return gerror.NewCode(gcode.CodeBusinessValidationFailed, "父级栏目不存在")
		}

		category.Level = parentCategory.Level + 1
		if parentCategory.Path != "" {
			category.Path = fmt.Sprintf("%s,%d", parentCategory.Path, req.ParentId)
		} else {
			category.Path = fmt.Sprintf("%d", req.ParentId)
		}
	} else {
		// 顶级分类
		category.Level = 0
		category.Path = ""
	}

	// 调用服务层保存分类
	_, err := service.CmsCategoryService.CreateCategory(ctx, category)
	return err
}

// UpdateCategory 更新分类
func (s *sCmsCategoryLogic) UpdateCategory(ctx context.Context, req *cms.CategoryUpdateReq) error {
	// 检查分类是否存在
	category, err := service.CmsCategoryService.GetCategoryById(ctx, req.Id)
	if err != nil {
		return err
	}
	if category == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "分类不存在")
	}

	if req.Slug != "" {
		// 检查slug是否已被其他分类使用
		exists, err := service.CmsCategoryService.CheckSlugExists(ctx, req.Slug, req.Id)
		if err != nil {
			return err
		}
		if exists {
			return gerror.NewCode(gcode.CodeBusinessValidationFailed, "栏目别名已存在")
		}
	}

	// 更新分类信息
	category.Name = req.Name
	category.Slug = req.Slug
	category.Description = req.Description
	category.CType = req.CType
	category.LinkUrl = req.LinkUrl
	category.IsNav = req.IsNav
	category.SortOrder = req.SortOrder
	category.Status = req.Status
	category.CoverImage = req.CoverImage
	category.SeoTitle = req.SeoTitle
	category.SeoKeywords = req.SeoKeywords
	category.SeoDescription = req.SeoDescription
	category.Extra = req.Extra

	// 调用服务层更新分类
	return service.CmsCategoryService.UpdateCategory(ctx, category)
}

// DeleteCategory 删除分类
func (s *sCmsCategoryLogic) DeleteCategory(ctx context.Context, id uint64) error {
	// 检查分类是否存在
	category, err := service.CmsCategoryService.GetCategoryById(ctx, id)
	if err != nil {
		return err
	}
	if category == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "分类不存在")
	}

	// 检查是否有子分类
	childCount, err := service.CmsCategoryService.GetChildCategoryCount(ctx, id)
	if err != nil {
		return err
	}
	if childCount > 0 {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "该分类下有子分类，无法删除")
	}

	// 调用服务层删除分类
	return service.CmsCategoryService.DeleteCategory(ctx, id)
}

// GetCategoryDetail 获取分类详情
func (s *sCmsCategoryLogic) GetCategoryDetail(ctx context.Context, id uint64) (*entity.CmsCategory, error) {
	// 调用服务层获取分类详情
	category, err := service.CmsCategoryService.GetCategoryById(ctx, id)
	if err != nil {
		return nil, err
	}
	if category == nil {
		return nil, gerror.NewCode(gcode.CodeBusinessValidationFailed, "分类不存在")
	}

	return category, nil
}

// GetCategoryTree 获取分类树
func (s *sCmsCategoryLogic) GetCategoryTree(ctx context.Context) ([]*entity.CmsCategory, error) {
	// 调用服务层获取分类列表
	categories, err := service.CmsCategoryService.GetCategoryTree(ctx)
	if err != nil {
		return nil, err
	}

	return categories, nil
}
