package v1

import (
	"gf-ant-react/internal/model/admin"

	"github.com/gogf/gf/v2/frame/g"
)

// SysDepartmentCreateReq 创建部门请求参数
type SysDepartmentCreateReq struct {
	g.Meta   `path:"/sys/department/create" tags:"SysDepartment" method:"post" summary:"创建部门"`
	ParentId uint64 `json:"parentId" v:"integer#上级ID必须为整数" description:"上级部门ID，NULL表示顶级部门"`
	Name     string `json:"name" v:"required|length:1,50#名称不能为空|名称长度必须在1-50个字符之间" description:"部门名称"`
	Sort     int    `json:"sort" v:"integer#排序必须为整数" description:"排序"`
	Status   bool   `json:"status" v:"required#状态不能为空" description:"状态：false=禁用，true=启用"`
}

// SysDepartmentCreateRes 创建部门响应参数
type SysDepartmentCreateRes struct {
	g.Meta `mime:"application/json"`
	Id     uint64 `json:"id" description:"创建成功的部门ID"`
}

// SysDepartmentUpdateReq 更新部门请求参数
type SysDepartmentUpdateReq struct {
	g.Meta   `path:"/sys/department/update/:id" tags:"SysDepartment" method:"put" summary:"更新部门"`
	Id       uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
	ParentId uint64 `json:"parentId" v:"integer#上级ID必须为整数" description:"上级部门ID，NULL表示顶级部门"`
	Name     string `json:"name" v:"required|length:1,50#名称不能为空|名称长度必须在1-50个字符之间" description:"部门名称"`
	Sort     int    `json:"sort" v:"integer#排序必须为整数" description:"排序"`
	Status   bool   `json:"status" v:"required#状态不能为空" description:"状态：false=禁用，true=启用"`
}

// SysDepartmentUpdateRes 更新部门响应参数
type SysDepartmentUpdateRes struct {
	g.Meta `mime:"application/json"`
}

// SysDepartmentDeleteReq 删除部门请求参数
type SysDepartmentDeleteReq struct {
	g.Meta `path:"/sys/department/delete/:id" tags:"SysDepartment" method:"delete" summary:"删除部门"`
	Id     uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
}

// SysDepartmentDeleteRes 删除部门响应参数
type SysDepartmentDeleteRes struct {
	g.Meta `mime:"application/json"`
}

// SysDepartmentTreeReq 获取部门树形结构请求参数
type SysDepartmentTreeReq struct {
	g.Meta `path:"/sys/department/tree" tags:"SysDepartment" method:"get" summary:"获取部门树形结构"`
}

// SysDepartmentTreeRes 获取部门树形结构响应参数
type SysDepartmentTreeRes struct {
	g.Meta `mime:"application/json"`
	List   []*admin.SysDepartmentTree `json:"list" description:"部门树形结构"`
}
