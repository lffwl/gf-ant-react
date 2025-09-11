package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/database/gdb"
)

type SysUser struct{}

var SysUserService = &SysUser{}

func (s *SysUser) Create(ctx context.Context, data *admin.SysUserCreateParam) (uint64, error) {
	// 开启事务
	tx, err := dao.SysUsers.DB().Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// 插入用户数据
	userId, err := tx.Model(dao.SysUsers.Table()).Ctx(ctx).InsertAndGetId(data)
	if err != nil {
		return 0, err
	}

	// 插入用户角色关联
	if len(data.RoleIds) > 0 {

		var userRoles []*entity.SysUserRoles
		for _, roleId := range data.RoleIds {
			userRoles = append(userRoles, &entity.SysUserRoles{
				UserId: uint64(userId),
				RoleId: roleId,
			})
		}

		_, err = tx.Model(dao.SysUserRoles.Table()).FieldsEx(dao.SysUserRoles.Columns().CreatedAt).Save(userRoles)
		if err != nil {
			return 0, err
		}
	}

	// 提交事务
	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return uint64(userId), nil
}

func (s *SysUser) Update(ctx context.Context, data *admin.SysUserUpdateParam) error {
	// 开启事务
	tx, err := dao.SysUsers.DB().Begin(ctx)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// 更新用户数据
	_, err = tx.Model(dao.SysUsers.Table()).Ctx(ctx).Where(dao.SysUsers.Columns().Id, data.Id).
		Update(data)
	if err != nil {
		return err
	}

	// 先删除旧的关联
	_, err = tx.Model(dao.SysUserRoles.Table()).Where(dao.SysUserRoles.Columns().UserId, data.Id).Delete()
	if err != nil {
		return err
	}

	// 插入用户角色关联
	if len(data.RoleIds) > 0 {
		var userRoles []*entity.SysUserRoles
		for _, roleId := range data.RoleIds {
			userRoles = append(userRoles, &entity.SysUserRoles{
				UserId: data.Id,
				RoleId: roleId,
			})
		}

		_, err = tx.Model(dao.SysUserRoles.Table()).FieldsEx(dao.SysUserRoles.Columns().CreatedAt).Save(userRoles)
		if err != nil {
			return err
		}
	}

	// 提交事务
	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func (s *SysUser) Delete(ctx context.Context, id uint64) error {
	_, err := dao.SysUsers.Ctx(ctx).Where(dao.SysUsers.Columns().Id, id).Delete()
	return err
}

func (s *SysUser) GetList(ctx context.Context, param *admin.SysUserListParam) ([]*admin.SysUserListResultItem, int, error) {
	var users []*admin.SysUserListResultItem
	model := dao.SysUsers.Ctx(ctx)

	if param.Username != "" {
		model = model.WhereLike(dao.SysUsers.Columns().Username, "%"+param.Username+"%")
	}
	if param.DepartmentId > 0 {
		model = model.Where(dao.SysUsers.Columns().DepartmentId, param.DepartmentId)
	}
	if param.Status != nil {
		model = model.Where(dao.SysUsers.Columns().Status, *param.Status)
	}

	// 获取总数
	total, err := model.Count()
	if err != nil {
		return nil, 0, err
	}

	// 获取分页数据
	err = model.Page(param.Page, param.Size).Order("id DESC").ScanList(&users, "User")
	if err != nil {
		return nil, 0, err
	}

	// 获取用户角色关联
	if total > 0 {
		if err := dao.SysUserRoles.Ctx(ctx).Where(dao.SysUserRoles.Columns().UserId, gdb.ListItemValuesUnique(users, "User", "Id")).ScanList(&users, "Roles", "User", dao.SysUserRoles.Columns().UserId+":Id"); err != nil {
			return nil, 0, err
		}
	}

	return users, total, nil
}

func (s *SysUser) GetById(ctx context.Context, id uint64) (*entity.SysUsers, []uint64, error) {
	var user *entity.SysUsers
	err := dao.SysUsers.Ctx(ctx).Where(dao.SysUsers.Columns().Id, id).Scan(&user)
	if err != nil {
		return nil, nil, err
	}

	// 获取用户角色ID列表
	var userRoles []*entity.SysUserRoles
	err = dao.SysUserRoles.Ctx(ctx).Fields(dao.SysUserRoles.Columns().RoleId).Where(dao.SysUserRoles.Columns().UserId, id).Scan(&userRoles)
	if err != nil {
		return nil, nil, err
	}

	var roleIds []uint64
	for _, userRole := range userRoles {
		roleIds = append(roleIds, userRole.RoleId)
	}

	return user, roleIds, nil
}

// UpdateColumns 更新
func (s *SysUser) UpdateColumns(ctx context.Context, id uint64, data interface{}) error {

	if _, err := dao.SysUsers.Ctx(ctx).FieldsEx(dao.SysUsers.Columns().Id).Where(dao.SysUsers.Columns().Id, id).Update(data); err != nil {
		return err
	}

	return nil
}

// 根据用户名获取用户信息
func (s *SysUser) GetByUsername(ctx context.Context, username string) (*entity.SysUsers, error) {
	var user *entity.SysUsers
	err := dao.SysUsers.Ctx(ctx).Where(dao.SysUsers.Columns().Username, username).Scan(&user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
