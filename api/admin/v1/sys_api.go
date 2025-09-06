package v1

import (
	"gf-ant-react/internal/logic/admin"

	"github.com/gogf/gf/v2/frame/g"
)

// SysApiCreateReq 创建API请求参数
type SysApiCreateReq struct {
	g.Meta         `path:"/sys/api/create" tags:"SysApi" method:"post" summary:"创建API"`
	ParentId       uint64 `json:"parentId" v:"integer#上级ID必须为整数" description:"上级ID，NULL表示根节点"`
	Name           string `json:"name" v:"required|length:1,50#名称不能为空|名称长度必须在1-50个字符之间" description:"名称，如：用户管理、查询用户"`
	PermissionCode string `json:"permissionCode" v:"required|length:1,100#权限标识不能为空|权限标识长度必须在1-100个字符之间" description:"权限唯一标识，如：system:user:list"`
	Url            string `json:"url" v:"required|length:1,200#接口URL不能为空|接口URL长度必须在1-200个字符之间" description:"接口URL，支持通配符"`
	Method         string `json:"method" v:"required|in:GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD#请求方法不能为空|请求方法必须是GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD中的一个" description:"请求方法"`
	Sort           int    `json:"sort" v:"integer#排序必须为整数" description:"排序"`
	Status         int    `json:"status" v:"in:0,1#状态值必须是0,1中的一个" description:"状态：0=禁用，1=启用"`
	IsMenu         int    `json:"isMenu" v:"in:0,1#菜单标识必须是0,1中的一个" description:"是否为菜单：0=否，1=是"`
	Description    string `json:"description" v:"length:0,500#描述长度不能超过500个字符" description:"描述"`
}

// SysApiCreateRes 创建API响应参数
type SysApiCreateRes struct {
	g.Meta `mime:"application/json"`
	Id     uint64 `json:"id" description:"创建成功的API ID"`
}

// SysApiUpdateReq 更新API请求参数
type SysApiUpdateReq struct {
	g.Meta         `path:"/sys/api/update/:id" tags:"SysApi" method:"put" summary:"更新API"`
	Id             uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
	ParentId       uint64 `json:"parentId" v:"integer#上级ID必须为整数" description:"上级ID，NULL表示根节点"`
	Name           string `json:"name" v:"required|length:1,50#名称不能为空|名称长度必须在1-50个字符之间" description:"名称，如：用户管理、查询用户"`
	PermissionCode string `json:"permissionCode" v:"required|length:1,100#权限标识不能为空|权限标识长度必须在1-100个字符之间" description:"权限唯一标识，如：system:user:list"`
	Url            string `json:"url" v:"required|length:1,200#接口URL不能为空|接口URL长度必须在1-200个字符之间" description:"接口URL，支持通配符"`
	Method         string `json:"method" v:"required|in:GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD#请求方法不能为空|请求方法必须是GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD中的一个" description:"请求方法"`
	Sort           int    `json:"sort" v:"integer#排序必须为整数" description:"排序"`
	Status         int    `json:"status" v:"in:0,1#状态值必须是0,1中的一个" description:"状态：0=禁用，1=启用"`
	IsMenu         int    `json:"isMenu" v:"in:0,1#菜单标识必须是0,1中的一个" description:"是否为菜单：0=否，1=是"`
	Description    string `json:"description" v:"length:0,500#描述长度不能超过500个字符" description:"描述"`
}

// SysApiUpdateRes 更新API响应参数
type SysApiUpdateRes struct {
	g.Meta `mime:"application/json"`
}

// SysApiDeleteReq 删除API请求参数
type SysApiDeleteReq struct {
	g.Meta `path:"/sys/api/delete/:id" tags:"SysApi" method:"delete" summary:"删除API"`
	Id     uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
}

// SysApiDeleteRes 删除API响应参数
type SysApiDeleteRes struct {
	g.Meta `mime:"application/json"`
}

// SysApiTreeReq 获取API树形结构请求参数
type SysApiTreeReq struct {
	g.Meta `path:"/sys/api/tree" tags:"SysApi" method:"get" summary:"获取API树形结构"`
}

// SysApiTreeRes 获取API树形结构响应参数
type SysApiTreeRes struct {
	g.Meta `mime:"application/json"`
	List   []*admin.SysApiTree    `json:"list" description:"API树形结构"`
	Config map[string]interface{} `json:"config" description:"配置"`
}
