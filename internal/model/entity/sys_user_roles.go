// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysUserRoles is the golang structure for table sys_user_roles.
type SysUserRoles struct {
	Id        uint64      `json:"id"        orm:"id"         description:"ID"`   // ID
	UserId    uint64      `json:"userId"    orm:"user_id"    description:"用户ID"` // 用户ID
	RoleId    uint64      `json:"roleId"    orm:"role_id"    description:"角色ID"` // 角色ID
	CreatedAt *gtime.Time `json:"createdAt" orm:"created_at" description:""`     //
}
