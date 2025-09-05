// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysDepartments is the golang structure of table sys_departments for DAO operations like Where/Data.
type SysDepartments struct {
	g.Meta    `orm:"table:sys_departments, do:true"`
	Id        any         // 部门ID
	ParentId  any         // 上级部门ID，NULL表示顶级部门
	Name      any         // 部门名称
	Sort      any         // 排序
	Status    any         // 状态: 0=禁用, 1=启用
	CreatedAt *gtime.Time //
	UpdatedAt *gtime.Time //
	DeletedAt *gtime.Time // 软删除时间 (NULL=未删除)
}
