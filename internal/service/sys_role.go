package service

import (
	"context"
	"errors"
	"fmt"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"
)

type SysRole struct{}

var SysRoleService = &SysRole{}

// SysRoleItem 角色列表项
type SysRoleItem struct {
	*entity.SysRoles
	ApiCount int `json:"apiCount" description:"关联API数量"`
}

func (s *SysRole) Create(ctx context.Context, data *admin.SysRoleCreateParam) (uint64, error) {
	// 开启事务
	tx, err := dao.SysRoles.DB().Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// 创建角色
	roleId, err := tx.Model(dao.SysRoles.Table()).Ctx(ctx).InsertAndGetId(data)
	if err != nil {
		return 0, err
	}

	// 创建角色API关联
	if len(data.ApiIds) > 0 {
		// 批量获取API的权限码
		apis, err := SysApiService.GetByIds(ctx, data.ApiIds)
		if err != nil {
			return 0, err
		}

		// 创建权限码映射表
		permissionCodeMap := make(map[uint64]string)
		for _, api := range apis {
			permissionCodeMap[api.Id] = api.PermissionCode
		}

		var roleApis []entity.SysRoleApis
		for _, apiId := range data.ApiIds {
			if permissionCode, exists := permissionCodeMap[apiId]; exists {
				roleApis = append(roleApis, entity.SysRoleApis{
					RoleId:         uint64(roleId),
					PermissionCode: permissionCode,
					ApiId:          apiId,
				})
			}
		}

		_, err = tx.Model(dao.SysRoleApis.Table()).Ctx(ctx).FieldsEx(dao.SysRoleApis.Columns().CreatedAt).Save(roleApis)
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

func (s *SysRole) Update(ctx context.Context, data *admin.SysRoleUpdateParam) error {
	// 开启事务
	tx, err := dao.SysRoles.DB().Begin(ctx)
	if err != nil {
		return err
	}

	// 使用defer在函数返回时检查事务状态，如果未提交则回滚
	defer func() {
		if tx != nil {
			tx.Rollback()
		}
	}()

	// 更新角色
	_, err = tx.Model(dao.SysRoles.Table()).Ctx(ctx).
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
	if len(data.ApiIds) > 0 {
		var apis []*entity.SysApis
		// 批量获取API的权限码
		apis, err = SysApiService.GetByIds(ctx, data.ApiIds)
		if err != nil {
			return err
		}

		// 创建权限码映射表
		permissionCodeMap := make(map[uint64]string)
		for _, api := range apis {
			permissionCodeMap[api.Id] = api.PermissionCode
		}

		var roleApis []entity.SysRoleApis
		for _, apiId := range data.ApiIds {
			if permissionCode, exists := permissionCodeMap[apiId]; exists {
				roleApis = append(roleApis, entity.SysRoleApis{
					RoleId:         data.Id,
					PermissionCode: permissionCode,
					ApiId:          apiId,
				})
			}
		}

		_, err = tx.Model(dao.SysRoleApis.Table()).Ctx(ctx).FieldsEx(dao.SysRoleApis.Columns().CreatedAt).Save(roleApis)
		if err != nil {
			return err
		}
	}

	// 提交事务
	err = tx.Commit()
	if err == nil {
		tx = nil // 提交成功后将tx置为nil，避免defer执行回滚
	}
	return err
}

func (s *SysRole) Delete(ctx context.Context, id uint64) error {
	// 开启事务
	tx, err := dao.SysRoles.DB().Begin(ctx)
	if err != nil {
		return err
	}

	// 使用defer在函数返回时检查事务状态，如果未提交则回滚
	defer func() {
		if tx != nil {
			tx.Rollback()
		}
	}()

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
	err = tx.Commit()
	if err == nil {
		tx = nil // 提交成功后将tx置为nil，避免defer执行回滚
	}
	return err
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

	// 获取所有角色的API数量（分组查询）
	var apiCounts []struct {
		RoleId   uint64 `json:"role_id"`
		ApiCount int    `json:"api_count"`
	}

	// 提取角色ID列表
	roleIds := make([]uint64, len(roles))
	for i, role := range roles {
		roleIds[i] = role.Id
	}

	// 执行分组查询
	err = dao.SysRoleApis.Ctx(ctx).
		Fields(fmt.Sprintf("%s, count(*) as api_count", dao.SysRoleApis.Columns().RoleId)).
		WhereIn(dao.SysRoleApis.Columns().RoleId, roleIds).
		Group(dao.SysRoleApis.Columns().RoleId).
		Scan(&apiCounts)
	if err != nil {
		return nil, 0, err
	}

	// 创建API数量映射表
	apiCountMap := make(map[uint64]int)
	for _, item := range apiCounts {
		apiCountMap[item.RoleId] = item.ApiCount
	}

	// 构建返回结果
	var result []*SysRoleItem
	for _, role := range roles {
		result = append(result, &SysRoleItem{
			SysRoles: role,
			ApiCount: apiCountMap[role.Id],
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
	err = dao.SysRoleApis.Ctx(ctx).Fields(dao.SysRoleApis.Columns().ApiId).Where(dao.SysRoleApis.Columns().RoleId, id).Scan(&roleApis)
	if err != nil {
		return nil, nil, err
	}

	// 通过权限码获取API ID
	for _, roleApi := range roleApis {
		apiIds = append(apiIds, roleApi.ApiId)
	}

	return role, apiIds, nil
}

// GetAll 获取所有角色
func (s *SysRole) GetAll(ctx context.Context) ([]*entity.SysRoles, error) {
	var roles []*entity.SysRoles
	err := dao.SysRoles.Ctx(ctx).Scan(&roles)
	if err != nil {
		return nil, err
	}
	return roles, nil
}

// GetUserRoles 获取用户角色及权限信息
func (s *SysRole) GetUserRoles(ctx context.Context, userId uint64) ([]*entity.SysRoles, error) {
	var roles []*entity.SysRoles
	// 通过 sys_user_roles 表关联用户和角色，并获取完整的角色信息
	err := dao.SysRoles.Ctx(ctx).Fields(fmt.Sprintf("%s.*", dao.SysRoles.Table())).
		InnerJoin(dao.SysUserRoles.Table(), fmt.Sprintf("%s.%s = %s.%s", dao.SysRoles.Table(), dao.SysRoles.Columns().Id, dao.SysUserRoles.Table(), dao.SysUserRoles.Columns().RoleId)).
		Where(fmt.Sprintf("%s.%s", dao.SysUserRoles.Table(), dao.SysUserRoles.Columns().UserId), userId).
		Scan(&roles)
	if err != nil {
		return nil, err
	}
	return roles, nil
}

// 检查角色集合是否可以访问权限
func (s *SysRole) CheckPermission(ctx context.Context, roleIds []uint64, permissionCode string) (bool, error) {

	// 检查角色是否为空
	if len(roleIds) == 0 {
		return false, errors.New("角色不能为空")
	}

	// 检查角色是否有访问接口的权限
	count, err := dao.SysRoleApis.Ctx(ctx).Where(dao.SysRoleApis.Columns().RoleId, roleIds).Where(dao.SysRoleApis.Columns().PermissionCode, permissionCode).Count()
	if err != nil {
		return false, err
	}

	return count > 0, nil
}
