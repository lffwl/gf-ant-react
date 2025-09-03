package admin

import (
	"context"

	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
)

type sSysUserLogic struct{}

var SysUserLogic = &sSysUserLogic{}

func (s *sSysUserLogic) Create(ctx context.Context, data *entity.SysUsers) (uint64, error) {
	return service.SysUserService.Create(ctx, data)
}

func (s *sSysUserLogic) Update(ctx context.Context, data *entity.SysUsers) error {
	return service.SysUserService.Update(ctx, data)
}

func (s *sSysUserLogic) Delete(ctx context.Context, id uint64) error {
	return service.SysUserService.Delete(ctx, id)
}

func (s *sSysUserLogic) GetAll(ctx context.Context) ([]*entity.SysUsers, error) {
	return service.SysUserService.GetAll(ctx)
}

func (s *sSysUserLogic) GetById(ctx context.Context, id uint64) (*entity.SysUsers, error) {
	return service.SysUserService.GetById(ctx, id)
}