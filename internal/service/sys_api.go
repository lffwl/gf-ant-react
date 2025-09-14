package service

import (
	"context"
	"errors"

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

// GetApisByRoleIds 根据角色ID数组获取所有API（去重）
func (s *SysApi) GetApisByRoleIds(ctx context.Context, roleIds []uint64) ([]*entity.SysApis, error) {
	// 查询与这些角色关联的所有API ID
	var roleApis []*entity.SysRoleApis
	err := dao.SysRoleApis.Ctx(ctx).
		Distinct().
		Where(dao.SysRoleApis.Columns().RoleId, roleIds).
		Fields(dao.SysRoleApis.Columns().ApiId).
		Scan(&roleApis)
	if err != nil {
		return nil, err
	}

	var uniqueApiIds []uint64
	for _, roleApi := range roleApis {
		uniqueApiIds = append(uniqueApiIds, roleApi.ApiId)
	}

	// 根据去重后的API ID查询完整的API信息
	if len(uniqueApiIds) == 0 {
		return []*entity.SysApis{}, nil
	}

	return s.GetByIds(ctx, uniqueApiIds)
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

// 根据请求类型和路径获取权限code
func (s *SysApi) GetPermissionCode(ctx context.Context, method, url string) (string, error) {

	var api *entity.SysApis
	if err := dao.SysApis.Ctx(ctx).Fields(dao.SysApis.Columns().PermissionCode).Where(dao.SysApis.Columns().Url, url).Where(dao.SysApis.Columns().Method, method).Scan(&api); err != nil {
		return "", err
	}
	if api == nil {
		return "", errors.New("接口不存在")
	}

	return api.PermissionCode, nil
}
