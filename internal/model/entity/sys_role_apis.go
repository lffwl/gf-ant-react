// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysRoleApis is the golang structure for table sys_role_apis.
type SysRoleApis struct {
	Id             uint64      `json:"id"             orm:"id"              description:"主键"`                                       // 主键
	RoleId         uint64      `json:"roleId"         orm:"role_id"         description:"角色ID"`                                     // 角色ID
	PermissionCode string      `json:"permissionCode" orm:"permission_code" description:"权限码 (关联 api_permissions.permission_code)"` // 权限码 (关联 api_permissions.permission_code)
	CreatedAt      *gtime.Time `json:"createdAt"      orm:"created_at"      description:""`                                         //
}
