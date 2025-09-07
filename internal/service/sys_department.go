package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
)

type SysDepartment struct{}

var SysDepartmentService = &SysDepartment{}

func (s *SysDepartment) Create(ctx context.Context, data *admin.SysDepartmentCreateParam) (uint64, error) {
	result, err := dao.SysDepartments.Ctx(ctx).InsertAndGetId(data)
	if err != nil {
		return 0, err
	}
	return uint64(result), nil
}

func (s *SysDepartment) Update(ctx context.Context, data *admin.SysDepartmentUpdateParam) error {

	_, err := dao.SysDepartments.Ctx(ctx).Where(dao.SysDepartments.Columns().Id, data.Id).Update(data)
	return err
}

func (s *SysDepartment) Delete(ctx context.Context, id uint64) error {
	_, err := dao.SysDepartments.Ctx(ctx).Where(dao.SysDepartments.Columns().Id, id).Delete()
	return err
}

func (s *SysDepartment) GetAll(ctx context.Context) ([]*entity.SysDepartments, error) {
	var departments []*entity.SysDepartments
	err := dao.SysDepartments.Ctx(ctx).Order("sort DESC").Scan(&departments)
	if err != nil {
		return nil, err
	}
	return departments, nil
}

func (s *SysDepartment) GetById(ctx context.Context, id uint64) (*entity.SysDepartments, error) {
	var department *entity.SysDepartments
	err := dao.SysDepartments.Ctx(ctx).Where(dao.SysDepartments.Columns().Id, id).Scan(&department)
	if err != nil {
		return nil, err
	}
	return department, nil
}
