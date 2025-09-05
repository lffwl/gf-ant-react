// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysRoleApis is the golang structure of table sys_role_apis for DAO operations like Where/Data.
type SysRoleApis struct {
	g.Meta         `orm:"table:sys_role_apis, do:true"`
	Id             any         // 主键
	RoleId         any         // 角色ID
	PermissionCode any         // 权限码 (关联 api_permissions.permission_code)
	CreatedAt      *gtime.Time //
}
