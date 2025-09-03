// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysApis is the golang structure of table sys_apis for DAO operations like Where/Data.
type SysApis struct {
	g.Meta         `orm:"table:sys_apis, do:true"`
	Id             any         // 主键
	ParentId       any         // 上级ID，NULL表示根节点
	Name           any         // 名称，如：用户管理、查询用户
	PermissionCode any         // 权限唯一标识，如：system:user:list
	Url            any         // 接口URL，支持通配符
	Method         any         // 请求方法
	Sort           any         // 排序
	Status         any         // 状态：0=禁用，1=启用
	IsMenu         any         // 是否为菜单：0=否，1=是
	Description    any         // 描述
	CreatedAt      *gtime.Time //
	UpdatedAt      *gtime.Time //
	DeletedAt      *gtime.Time //
}
