package admin

import (
	"context"

	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
)

type sSysApiLogic struct{}

// SysApiTree 树形结构
type SysApiTree struct {
	*entity.SysApis
	Children []*SysApiTree `json:"children"`
}

var SysApiLogic = &sSysApiLogic{}

func (s *sSysApiLogic) Create(ctx context.Context, data *entity.SysApis) (uint64, error) {
	return service.SysApiService.Create(ctx, data)
}

func (s *sSysApiLogic) Update(ctx context.Context, data *entity.SysApis) error {
	return service.SysApiService.Update(ctx, data)
}

func (s *sSysApiLogic) Delete(ctx context.Context, id uint64) error {
	return service.SysApiService.Delete(ctx, id)
}

func (s *sSysApiLogic) GetTree(ctx context.Context) ([]*SysApiTree, error) {
	apis, err := service.SysApiService.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	// 构建树形结构
	return s.buildTree(apis, 0), nil
}

func (s *sSysApiLogic) buildTree(apis []*entity.SysApis, parentId uint64) []*SysApiTree {
	var tree []*SysApiTree
	for _, api := range apis {
		if api.ParentId == parentId {
			tree = append(tree, &SysApiTree{
				SysApis:  api,
				Children: s.buildTree(apis, api.Id),
			})
		}
	}
	return tree
}

func (s *sSysApiLogic) GetById(ctx context.Context, id uint64) (*entity.SysApis, error) {
	return service.SysApiService.GetById(ctx, id)
}
