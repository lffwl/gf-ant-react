package admin

import (
	"gf-ant-react/internal/model/entity"
)

// SysUserCreateParam 创建用户参数
type SysUserCreateParam struct {
	Username     string   `json:"username"`
	PasswordHash string   `json:"passwordHash"`
	Email        string   `json:"email"`
	Mobile       string   `json:"mobile"`
	DepartmentId uint64   `json:"departmentId"`
	Status       int      `json:"status"`
	RoleIds      []uint64 `json:"roleIds"`
}

// SysUserUpdateParam 更新用户参数
type SysUserUpdateParam struct {
	Id           uint64   `json:"id"`
	Username     string   `json:"username"`
	Email        string   `json:"email"`
	Mobile       string   `json:"mobile"`
	DepartmentId uint64   `json:"departmentId"`
	Status       int      `json:"status"`
	RoleIds      []uint64 `json:"roleIds"`
}

// SysUserListParam 用户列表查询参数
type SysUserListParam struct {
	Page         int    `json:"page"`
	Size         int    `json:"size"`
	Username     string `json:"username"`
	DepartmentId uint64 `json:"departmentId"`
	Status       *int   `json:"status"`
}

// SysUserListResult 用户列表结果
type SysUserListResult struct {
	List           []*SysUserListResultItem `json:"list"`
	Total          int                      `json:"total"`
	RoleList       []*entity.SysRoles       `json:"roleList"`
	DepartmentList []*entity.SysDepartments `json:"departmentList"`
}

type SysUserListResultItem struct {
	User *entity.SysUsers `json:"user"`
	// 角色集合
	Roles []*entity.SysUserRoles `json:"roles"`
}
