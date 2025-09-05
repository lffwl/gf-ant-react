// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysRoles is the golang structure for table sys_roles.
type SysRoles struct {
	Id          uint64      `json:"id"          orm:"id"          description:"角色ID"`                                         // 角色ID
	Name        string      `json:"name"        orm:"name"        description:"角色名称 (兼具标识作用)"`                                // 角色名称 (兼具标识作用)
	Description string      `json:"description" orm:"description" description:"描述"`                                           // 描述
	DataScope   int         `json:"dataScope"   orm:"data_scope"  description:"数据权限范围: 1=全部, 2=本部门, 3=本部门及子部门, 4=仅本人, 5=自定义"` // 数据权限范围: 1=全部, 2=本部门, 3=本部门及子部门, 4=仅本人, 5=自定义
	Sort        int         `json:"sort"        orm:"sort"        description:"排序"`                                           // 排序
	Status      bool        `json:"status"      orm:"status"      description:"状态: 0=禁用, 1=启用"`                               // 状态: 0=禁用, 1=启用
	CreatedAt   *gtime.Time `json:"createdAt"   orm:"created_at"  description:""`                                             //
	UpdatedAt   *gtime.Time `json:"updatedAt"   orm:"updated_at"  description:""`                                             //
	DeletedAt   *gtime.Time `json:"deletedAt"   orm:"deleted_at"  description:""`                                             //
}
