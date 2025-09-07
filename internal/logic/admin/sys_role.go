package admin

import (
	"context"

	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
)

type sSysRoleLogic struct{}

var SysRoleLogic = &sSysRoleLogic{}

func (s *sSysRoleLogic) Create(ctx context.Context, data *admin.SysRoleCreateParam) (uint64, error) {
	return service.SysRoleService.Create(ctx, data)
}

func (s *sSysRoleLogic) Update(ctx context.Context, data *admin.SysRoleUpdateParam) error {
	return service.SysRoleService.Update(ctx, data)
}

func (s *sSysRoleLogic) Delete(ctx context.Context, id uint64) error {
	return service.SysRoleService.Delete(ctx, id)
}

func (s *sSysRoleLogic) GetList(ctx context.Context, page, size int, name string, status *bool) ([]*service.SysRoleItem, int, error) {
	return service.SysRoleService.GetList(ctx, page, size, name, status)
}

func (s *sSysRoleLogic) GetById(ctx context.Context, id uint64) (*entity.SysRoles, []uint64, error) {
	return service.SysRoleService.GetById(ctx, id)
}