package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/entity"
)

type SysUser struct{}

var SysUserService = &SysUser{}

func (s *SysUser) Create(ctx context.Context, data *entity.SysUsers) (uint64, error) {
	result, err := dao.SysUsers.Ctx(ctx).InsertAndGetId(data)
	if err != nil {
		return 0, err
	}
	return uint64(result), nil
}

func (s *SysUser) Update(ctx context.Context, data *entity.SysUsers) error {
	_, err := dao.SysUsers.Ctx(ctx).Where(dao.SysUsers.Columns().Id, data.Id).Update(data)
	return err
}

func (s *SysUser) Delete(ctx context.Context, id uint64) error {
	_, err := dao.SysUsers.Ctx(ctx).Where(dao.SysUsers.Columns().Id, id).Delete()
	return err
}

func (s *SysUser) GetAll(ctx context.Context) ([]*entity.SysUsers, error) {
	var users []*entity.SysUsers
	err := dao.SysUsers.Ctx(ctx).Where("deleted_at IS NULL").Scan(&users)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *SysUser) GetById(ctx context.Context, id uint64) (*entity.SysUsers, error) {
	var user *entity.SysUsers
	err := dao.SysUsers.Ctx(ctx).Where(dao.SysUsers.Columns().Id, id).Scan(&user)
	if err != nil {
		return nil, err
	}
	return user, nil
}