package admin

import (
	"gf-ant-react/internal/model/entity"
)

// SysDepartmentCreateParam 创建部门参数
type SysDepartmentCreateParam struct {
	ParentId uint64 `json:"parentId"`
	Name     string `json:"name"`
	Sort     int    `json:"sort"`
	Status   bool   `json:"status"`
}

// SysDepartmentUpdateParam 更新部门参数
type SysDepartmentUpdateParam struct {
	Id       uint64 `json:"id"`
	ParentId uint64 `json:"parentId"`
	Name     string `json:"name"`
	Sort     int    `json:"sort"`
	Status   bool   `json:"status"`
}

// SysDepartmentTree 部门树形结构
type SysDepartmentTree struct {
	*entity.SysDepartments
	Children []*SysDepartmentTree `json:"children"`
}

// SysDepartmentTreeResult 部门树形结构结果
type SysDepartmentTreeResult struct {
	List []*SysDepartmentTree `json:"list"`
}