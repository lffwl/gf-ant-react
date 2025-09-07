package admin

import (
	"context"
	"sort"

	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
)

type sSysApiLogic struct{}

var SysApiLogic = &sSysApiLogic{}

func (s *sSysApiLogic) Create(ctx context.Context, data *admin.SysApiCreateParam) (id uint64, err error) {
	return service.SysApiService.Create(ctx, data)
}

func (s *sSysApiLogic) Update(ctx context.Context, data *admin.SysApiUpdateParam) error {
	return service.SysApiService.Update(ctx, data)
}

func (s *sSysApiLogic) Delete(ctx context.Context, id uint64) error {
	return service.SysApiService.Delete(ctx, id)
}

func (s *sSysApiLogic) GetTree(ctx context.Context) (*admin.SysApiTreeResult, error) {
	apis, err := service.SysApiService.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	// 构建树形结构
	treeItems := buildApiTree(apis)

	return &admin.SysApiTreeResult{
		List: treeItems,
		Config: map[string]interface{}{
			"methodMap": admin.MethodMap,
			"isMenuMap": admin.IsMenuMap,
			"statusMap": admin.StatusMap,
		},
	}, nil
}

// buildApiTree 构建API树形结构（递归版本）
func buildApiTree(apis []*entity.SysApis) []*admin.SysApiTreeResultItem {
	// 创建所有节点映射
	itemMap := make(map[uint64]*admin.SysApiTreeResultItem)
	for _, api := range apis {
		itemMap[api.Id] = &admin.SysApiTreeResultItem{
			SysApis:  api,
			Children: []*admin.SysApiTreeResultItem{},
		}
	}

	// 构建树形结构并返回根节点
	return buildTreeRecursive(itemMap, 0)
}

// buildTreeRecursive 递归构建树形结构
func buildTreeRecursive(itemMap map[uint64]*admin.SysApiTreeResultItem, parentId uint64) []*admin.SysApiTreeResultItem {
	var nodes []*admin.SysApiTreeResultItem

	for _, item := range itemMap {
		if item.ParentId == parentId {
			// 递归构建子节点
			item.Children = buildTreeRecursive(itemMap, item.Id)
			nodes = append(nodes, item)
		}
	}

	// 对当前层级节点排序
	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].Sort > nodes[j].Sort
	})

	return nodes
}

func (s *sSysApiLogic) GetById(ctx context.Context, id uint64) (*entity.SysApis, error) {
	return service.SysApiService.GetById(ctx, id)
}
