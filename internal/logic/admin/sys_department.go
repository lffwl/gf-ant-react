package admin

import (
	"context"

	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
)

type sSysDepartmentLogic struct{}

var SysDepartmentLogic = &sSysDepartmentLogic{}

func (s *sSysDepartmentLogic) Create(ctx context.Context, data *admin.SysDepartmentCreateParam) (uint64, error) {
	return service.SysDepartmentService.Create(ctx, data)
}

func (s *sSysDepartmentLogic) Update(ctx context.Context, data *admin.SysDepartmentUpdateParam) error {
	return service.SysDepartmentService.Update(ctx, data)
}

func (s *sSysDepartmentLogic) Delete(ctx context.Context, id uint64) error {
	return service.SysDepartmentService.Delete(ctx, id)
}

func (s *sSysDepartmentLogic) GetTree(ctx context.Context) ([]*admin.SysDepartmentTree, error) {
	departments, err := service.SysDepartmentService.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	// 构建树形结构
	return s.buildTree(departments, 0), nil
}

func (s *sSysDepartmentLogic) buildTree(departments []*entity.SysDepartments, parentId uint64) []*admin.SysDepartmentTree {
	var tree []*admin.SysDepartmentTree
	for _, dept := range departments {
		if dept.ParentId == parentId {
			tree = append(tree, &admin.SysDepartmentTree{
				SysDepartments: dept,
				Children:       s.buildTree(departments, dept.Id),
			})
		}
	}
	return tree
}

func (s *sSysDepartmentLogic) GetById(ctx context.Context, id uint64) (*entity.SysDepartments, error) {
	return service.SysDepartmentService.GetById(ctx, id)
}
