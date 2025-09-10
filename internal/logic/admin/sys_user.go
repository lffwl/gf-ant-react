package admin

import (
	"context"

	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
	"gf-ant-react/utility/password"
)

type sSysUserLogic struct{}

var SysUserLogic = &sSysUserLogic{}

func (s *sSysUserLogic) Create(ctx context.Context, data *admin.SysUserCreateParam) (uint64, error) {
	// 密码加密
	var err error
	data.PasswordHash, err = password.HashPassword(data.PasswordHash)
	if err != nil {
		return 0, err
	}
	return service.SysUserService.Create(ctx, data)
}

func (s *sSysUserLogic) Update(ctx context.Context, data *admin.SysUserUpdateParam) error {
	return service.SysUserService.Update(ctx, data)
}

func (s *sSysUserLogic) Delete(ctx context.Context, id uint64) error {
	return service.SysUserService.Delete(ctx, id)
}

// GetListWithParam 使用参数结构体获取用户列表
func (s *sSysUserLogic) GetList(ctx context.Context, param *admin.SysUserListParam) (*admin.SysUserListResult, error) {
	users, total, err := service.SysUserService.GetList(ctx, param)
	if err != nil {
		return nil, err
	}

	// 获取部门列表
	departmentList, err := service.SysDepartmentService.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	// 角色列表
	roleList, err := service.SysRoleService.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	return &admin.SysUserListResult{
		List:           users,
		Total:          total,
		RoleList:       roleList,
		DepartmentList: departmentList,
	}, nil
}

func (s *sSysUserLogic) GetById(ctx context.Context, id uint64) (*entity.SysUsers, []uint64, error) {
	return service.SysUserService.GetById(ctx, id)
}

// UpdatePassword 修改密码
func (s *sSysUserLogic) UpdatePassword(ctx context.Context, param *admin.SysUserUpdatePasswordParam) error {
	// 密码加密
	var err error
	param.PasswordHash, err = password.HashPassword(param.PasswordHash)
	if err != nil {
		return err
	}
	return service.SysUserService.Save(ctx, param)
}
