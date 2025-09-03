// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysApis is the golang structure for table sys_apis.
type SysApis struct {
	Id             uint64      `json:"id"             orm:"id"              description:"主键"`                        // 主键
	ParentId       uint64      `json:"parentId"       orm:"parent_id"       description:"上级ID，NULL表示根节点"`            // 上级ID，NULL表示根节点
	Name           string      `json:"name"           orm:"name"            description:"名称，如：用户管理、查询用户"`            // 名称，如：用户管理、查询用户
	PermissionCode string      `json:"permissionCode" orm:"permission_code" description:"权限唯一标识，如：system:user:list"` // 权限唯一标识，如：system:user:list
	Url            string      `json:"url"            orm:"url"             description:"接口URL，支持通配符"`               // 接口URL，支持通配符
	Method         string      `json:"method"         orm:"method"          description:"请求方法"`                      // 请求方法
	Sort           int         `json:"sort"           orm:"sort"            description:"排序"`                        // 排序
	Status         int         `json:"status"         orm:"status"          description:"状态：0=禁用，1=启用"`              // 状态：0=禁用，1=启用
	IsMenu         int         `json:"isMenu"         orm:"is_menu"         description:"是否为菜单：0=否，1=是"`             // 是否为菜单：0=否，1=是
	Description    string      `json:"description"    orm:"description"     description:"描述"`                        // 描述
	CreatedAt      *gtime.Time `json:"createdAt"      orm:"created_at"      description:""`                          //
	UpdatedAt      *gtime.Time `json:"updatedAt"      orm:"updated_at"      description:""`                          //
	DeletedAt      *gtime.Time `json:"deletedAt"      orm:"deleted_at"      description:""`                          //
}
