package v1

import (
	"gf-ant-react/internal/service"

	"github.com/gogf/gf/v2/frame/g"
)

// SysRoleCreateReq 创建角色请求参数
type SysRoleCreateReq struct {
	g.Meta      `path:"/sys/role/create" tags:"SysRole" method:"post" summary:"创建角色"`
	Name        string   `json:"name" v:"required|length:1,50#角色名称不能为空|角色名称长度必须在1-50个字符之间" description:"角色名称"`
	Description string   `json:"description" v:"length:0,500#描述长度不能超过500个字符" description:"描述"`
	DataScope   int      `json:"dataScope" v:"required|in:1,2,3,4,5#数据权限范围不能为空|数据权限范围必须是1,2,3,4,5中的一个" description:"数据权限范围: 1=全部, 2=本部门, 3=本部门及子部门, 4=仅本人, 5=自定义"`
	Sort        int      `json:"sort" v:"integer#排序必须为整数" description:"排序"`
	Status      bool     `json:"status" description:"状态: false=禁用, true=启用"`
	ApiIds      []uint64 `json:"apiIds" description:"关联的API权限ID列表"`
}

// SysRoleCreateRes 创建角色响应参数
type SysRoleCreateRes struct {
	g.Meta `mime:"application/json"`
	Id     uint64 `json:"id" description:"创建成功的角色ID"`
}

// SysRoleUpdateReq 更新角色请求参数
type SysRoleUpdateReq struct {
	g.Meta      `path:"/sys/role/update/:id" tags:"SysRole" method:"put" summary:"更新角色"`
	Id          uint64   `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
	Name        string   `json:"name" v:"required|length:1,50#角色名称不能为空|角色名称长度必须在1-50个字符之间" description:"角色名称"`
	Description string   `json:"description" v:"length:0,500#描述长度不能超过500个字符" description:"描述"`
	DataScope   int      `json:"dataScope" v:"required|in:1,2,3,4,5#数据权限范围不能为空|数据权限范围必须是1,2,3,4,5中的一个" description:"数据权限范围: 1=全部, 2=本部门, 3=本部门及子部门, 4=仅本人, 5=自定义"`
	Sort        int      `json:"sort" v:"integer#排序必须为整数" description:"排序"`
	Status      bool     `json:"status" description:"状态: false=禁用, true=启用"`
	ApiIds      []uint64 `json:"apiIds" description:"关联的API权限ID列表"`
}

// SysRoleUpdateRes 更新角色响应参数
type SysRoleUpdateRes struct {
	g.Meta `mime:"application/json"`
}

// SysRoleDeleteReq 删除角色请求参数
type SysRoleDeleteReq struct {
	g.Meta `path:"/sys/role/delete/:id" tags:"SysRole" method:"delete" summary:"删除角色"`
	Id     uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
}

// SysRoleDeleteRes 删除角色响应参数
type SysRoleDeleteRes struct {
	g.Meta `mime:"application/json"`
}

// SysRoleListReq 获取角色列表请求参数
type SysRoleListReq struct {
	g.Meta `path:"/sys/role/list" tags:"SysRole" method:"get" summary:"获取角色列表"`
	Page   int    `json:"page" d:"1" v:"min:1#页码不能小于1" description:"页码"`
	Size   int    `json:"size" d:"10" v:"min:1|max:100#每页数量不能小于1|每页数量不能大于100" description:"每页数量"`
	Name   string `json:"name" description:"角色名称（模糊查询）"`
	Status *bool  `json:"status" description:"状态"`
}

// SysRoleListRes 获取角色列表响应参数
type SysRoleListRes struct {
	g.Meta `mime:"application/json"`
	List   []*service.SysRoleItem `json:"list" description:"角色列表"`
	Total  int                    `json:"total" description:"总数量"`
}

// SysRoleDetailReq 获取角色详情请求参数
type SysRoleDetailReq struct {
	g.Meta `path:"/sys/role/detail/:id" tags:"SysRole" method:"get" summary:"获取角色详情"`
	Id     uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
}

// SysRoleDetailRes 获取角色详情响应参数
type SysRoleDetailRes struct {
	g.Meta      `mime:"application/json"`
	Id          uint64   `json:"id" description:"角色ID"`
	Name        string   `json:"name" description:"角色名称"`
	Description string   `json:"description" description:"描述"`
	DataScope   int      `json:"dataScope" description:"数据权限范围"`
	Sort        int      `json:"sort" description:"排序"`
	Status      bool     `json:"status" description:"状态"`
	ApiIds      []uint64 `json:"apiIds" description:"关联的API权限ID列表"`
	CreatedAt   string   `json:"createdAt" description:"创建时间"`
	UpdatedAt   string   `json:"updatedAt" description:"更新时间"`
}
