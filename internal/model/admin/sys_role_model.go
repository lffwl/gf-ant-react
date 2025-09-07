package admin

import (
	"gf-ant-react/internal/model/entity"
)

// SysRoleCreateParam 创建角色参数
type SysRoleCreateParam struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	DataScope   int      `json:"dataScope"`
	Sort        int      `json:"sort"`
	Status      bool     `json:"status"`
	ApiIds      []uint64 `json:"apiIds"`
}

// SysRoleUpdateParam 更新角色参数
type SysRoleUpdateParam struct {
	Id          uint64   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	DataScope   int      `json:"dataScope"`
	Sort        int      `json:"sort"`
	Status      bool     `json:"status"`
	ApiIds      []uint64 `json:"apiIds"`
}

// SysRoleListParam 角色列表查询参数
type SysRoleListParam struct {
	Page   int    `json:"page"`
	Size   int    `json:"size"`
	Name   string `json:"name"`
	Status *bool  `json:"status"`
}

// SysRoleItem 角色列表项
type SysRoleItem struct {
	*entity.SysRoles
	ApiCount int `json:"apiCount" description:"关联API数量"`
}

// SysRoleListResult 角色列表结果
type SysRoleListResult struct {
	List  []*SysRoleItem `json:"list"`
	Total int            `json:"total"`
}

// SysRoleDetailResult 角色详情结果
type SysRoleDetailResult struct {
	Id          uint64   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	DataScope   int      `json:"dataScope"`
	Sort        int      `json:"sort"`
	Status      bool     `json:"status"`
	ApiIds      []uint64 `json:"apiIds"`
	CreatedAt   string   `json:"createdAt"`
	UpdatedAt   string   `json:"updatedAt"`
}