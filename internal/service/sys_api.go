package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
)

type SysApi struct{}

var SysApiService = &SysApi{}

func (s *SysApi) Create(ctx context.Context, data *admin.SysApiCreateParam) (uint64, error) {
	id, err := dao.SysApis.Ctx(ctx).InsertAndGetId(data)
	if err != nil {
		return 0, err
	}
	return uint64(id), nil
}

func (s *SysApi) Update(ctx context.Context, data *admin.SysApiUpdateParam) error {
	_, err := dao.SysApis.Ctx(ctx).Where(dao.SysApis.Columns().Id, data.Id).Update(data)
	return err
}

func (s *SysApi) Delete(ctx context.Context, id uint64) error {
	_, err := dao.SysApis.Ctx(ctx).Where(dao.SysApis.Columns().Id, id).Delete()
	return err
}

func (s *SysApi) GetAll(ctx context.Context) ([]*entity.SysApis, error) {
	var apis []*entity.SysApis
	err := dao.SysApis.Ctx(ctx).Order("sort DESC, id DESC").Scan(&apis)
	if err != nil {
		return nil, err
	}
	return apis, nil
}

func (s *SysApi) GetById(ctx context.Context, id uint64) (*entity.SysApis, error) {
	var api *entity.SysApis
	err := dao.SysApis.Ctx(ctx).Where(dao.SysApis.Columns().Id, id).Scan(&api)
	if err != nil {
		return nil, err
	}
	return api, nil
}

func (s *SysApi) GetByPermissionCode(ctx context.Context, permissionCode string) (*entity.SysApis, error) {
	var api *entity.SysApis
	err := dao.SysApis.Ctx(ctx).Where(dao.SysApis.Columns().PermissionCode, permissionCode).Scan(&api)
	if err != nil {
		return nil, err
	}
	return api, nil
}

// GetByIds 批量获取API信息
func (s *SysApi) GetByIds(ctx context.Context, ids []uint64) ([]*entity.SysApis, error) {
	var apis []*entity.SysApis
	err := dao.SysApis.Ctx(ctx).Where(dao.SysApis.Columns().Id, ids).Scan(&apis)
	if err != nil {
		return nil, err
	}
	return apis, nil
}
