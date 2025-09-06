package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/entity"
)

type SysRole struct{}

var SysRoleService = &SysRole{}

// SysRoleItem 角色列表项
type SysRoleItem struct {
	*entity.SysRoles
	ApiCount int `json:"apiCount" description:"关联API数量"`
}

func (s *SysRole) Create(ctx context.Context, data *entity.SysRoles, apiIds []uint64) (uint64, error) {
	// 开启事务
	tx, err := dao.SysRoles.DB().Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// 创建角色
	result, err := tx.Model(dao.SysRoles.Table()).Ctx(ctx).FieldsEx(dao.SysRoles.Columns().DeletedAt).Save(data)
	if err != nil {
		return 0, err
	}
	roleId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	// 创建角色API关联
	if len(apiIds) > 0 {
		var roleApis []map[string]interface{}
		for _, apiId := range apiIds {
			// 获取API的权限码
			api, err := SysApiService.GetById(ctx, apiId)
			if err != nil {
				return 0, err
			}
			roleApis = append(roleApis, map[string]interface{}{
				"role_id":         roleId,
				"permission_code": api.PermissionCode,
			})
		}

		_, err = tx.Model(dao.SysRoleApis.Table()).Ctx(ctx).Save(roleApis)
		if err != nil {
			return 0, err
		}
	}

	// 提交事务
	if err := tx.Commit(); err != nil {
		return 0, err
	}

	return uint64(roleId), nil
}

func (s *SysRole) Update(ctx context.Context, data *entity.SysRoles, apiIds []uint64) error {
	// 开启事务
	tx, err := dao.SysRoles.DB().Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 更新角色
	_, err = tx.Model(dao.SysRoles.Table()).Ctx(ctx).
		FieldsEx(dao.SysRoles.Columns().CreatedAt, dao.SysRoles.Columns().DeletedAt).
		Where(dao.SysRoles.Columns().Id, data.Id).Update(data)
	if err != nil {
		return err
	}

	// 删除原有的角色API关联
	_, err = tx.Model(dao.SysRoleApis.Table()).Ctx(ctx).
		Where(dao.SysRoleApis.Columns().RoleId, data.Id).Delete()
	if err != nil {
		return err
	}

	// 创建新的角色API关联
	if len(apiIds) > 0 {
		var roleApis []map[string]interface{}
		for _, apiId := range apiIds {
			// 获取API的权限码
			api, err := SysApiService.GetById(ctx, apiId)
			if err != nil {
				return err
			}
			roleApis = append(roleApis, map[string]interface{}{
				"role_id":         data.Id,
				"permission_code": api.PermissionCode,
			})
		}

		_, err = tx.Model(dao.SysRoleApis.Table()).Ctx(ctx).Insert(roleApis)
		if err != nil {
			return err
		}
	}

	// 提交事务
	return tx.Commit()
}

func (s *SysRole) Delete(ctx context.Context, id uint64) error {
	// 开启事务
	tx, err := dao.SysRoles.DB().Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 删除角色API关联
	_, err = tx.Model(dao.SysRoleApis.Table()).Ctx(ctx).
		Where(dao.SysRoleApis.Columns().RoleId, id).Delete()
	if err != nil {
		return err
	}

	// 删除角色
	_, err = tx.Model(dao.SysRoles.Table()).Ctx(ctx).
		Where(dao.SysRoles.Columns().Id, id).Delete()
	if err != nil {
		return err
	}

	// 提交事务
	return tx.Commit()
}

func (s *SysRole) GetList(ctx context.Context, page, size int, name string, status *bool) ([]*SysRoleItem, int, error) {
	var roles []*entity.SysRoles
	model := dao.SysRoles.Ctx(ctx)

	if name != "" {
		model = model.WhereLike(dao.SysRoles.Columns().Name, "%"+name+"%")
	}
	if status != nil {
		model = model.Where(dao.SysRoles.Columns().Status, *status)
	}

	// 获取总数
	total, err := model.Count()
	if err != nil {
		return nil, 0, err
	}

	// 获取分页数据
	err = model.Page(page, size).Order("sort DESC, id DESC").Scan(&roles)
	if err != nil {
		return nil, 0, err
	}

	// 构建返回结果
	var result []*SysRoleItem
	for _, role := range roles {
		// 获取关联API数量
		apiCount, err := dao.SysRoleApis.Ctx(ctx).
			Where(dao.SysRoleApis.Columns().RoleId, role.Id).Count()
		if err != nil {
			return nil, 0, err
		}

		result = append(result, &SysRoleItem{
			SysRoles: role,
			ApiCount: apiCount,
		})
	}

	return result, total, nil
}

func (s *SysRole) GetById(ctx context.Context, id uint64) (*entity.SysRoles, []uint64, error) {
	// 获取角色信息
	var role *entity.SysRoles
	err := dao.SysRoles.Ctx(ctx).Where(dao.SysRoles.Columns().Id, id).Scan(&role)
	if err != nil {
		return nil, nil, err
	}

	// 获取关联的API ID列表
	var apiIds []uint64
	var roleApis []*entity.SysRoleApis
	err = dao.SysRoleApis.Ctx(ctx).Where(dao.SysRoleApis.Columns().RoleId, id).Scan(&roleApis)
	if err != nil {
		return nil, nil, err
	}

	// 通过权限码获取API ID
	for _, roleApi := range roleApis {
		api, err := SysApiService.GetByPermissionCode(ctx, roleApi.PermissionCode)
		if err != nil {
			return nil, nil, err
		}
		apiIds = append(apiIds, api.Id)
	}

	return role, apiIds, nil
}
