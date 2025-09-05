// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysUserRoles is the golang structure of table sys_user_roles for DAO operations like Where/Data.
type SysUserRoles struct {
	g.Meta    `orm:"table:sys_user_roles, do:true"`
	Id        any         // ID
	UserId    any         // 用户ID
	RoleId    any         // 角色ID
	CreatedAt *gtime.Time //
}
