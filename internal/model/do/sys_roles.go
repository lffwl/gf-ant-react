// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysRoles is the golang structure of table sys_roles for DAO operations like Where/Data.
type SysRoles struct {
	g.Meta      `orm:"table:sys_roles, do:true"`
	Id          any         // 角色ID
	Name        any         // 角色名称 (兼具标识作用)
	Description any         // 描述
	DataScope   any         // 数据权限范围: 1=全部, 2=本部门, 3=本部门及子部门, 4=仅本人, 5=自定义
	Sort        any         // 排序
	Status      any         // 状态: 0=禁用, 1=启用
	CreatedAt   *gtime.Time //
	UpdatedAt   *gtime.Time //
	DeletedAt   *gtime.Time //
}
