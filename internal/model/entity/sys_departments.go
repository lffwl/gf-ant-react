// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysDepartments is the golang structure for table sys_departments.
type SysDepartments struct {
	Id        uint64      `json:"id"        orm:"id"         description:"部门ID"`              // 部门ID
	ParentId  uint64      `json:"parentId"  orm:"parent_id"  description:"上级部门ID，NULL表示顶级部门"` // 上级部门ID，NULL表示顶级部门
	Name      string      `json:"name"      orm:"name"       description:"部门名称"`              // 部门名称
	Sort      int         `json:"sort"      orm:"sort"       description:"排序"`                // 排序
	Status    bool        `json:"status"    orm:"status"     description:"状态: 0=禁用, 1=启用"`    // 状态: 0=禁用, 1=启用
	CreatedAt *gtime.Time `json:"createdAt" orm:"created_at" description:""`                  //
	UpdatedAt *gtime.Time `json:"updatedAt" orm:"updated_at" description:""`                  //
	DeletedAt *gtime.Time `json:"deletedAt" orm:"deleted_at" description:"软删除时间 (NULL=未删除)"`  // 软删除时间 (NULL=未删除)
}
