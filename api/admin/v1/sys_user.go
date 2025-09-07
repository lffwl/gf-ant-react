package v1

import (
	"gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

// SysUserCreateReq 创建用户请求参数
type SysUserCreateReq struct {
	g.Meta       `path:"/sys/user/create" tags:"SysUser" method:"post" summary:"创建用户"`
	Username     string   `json:"username" v:"required|length:3,50#用户名不能为空|用户名长度必须在3-50个字符之间" description:"用户名"`
	PasswordHash string   `json:"passwordHash" v:"required|length:6,100#密码哈希不能为空|密码哈希长度必须在6-100个字符之间" description:"密码哈希"`
	Email        string   `json:"email" v:"email#邮箱格式不正确" description:"邮箱"`
	Mobile       string   `json:"mobile" v:"length:0,20#手机号长度不能超过20个字符" description:"手机号"`
	DepartmentId uint64   `json:"departmentId" v:"integer#部门ID必须为整数" description:"所属部门ID"`
	Status       int      `json:"status" v:"in:0,1,2#状态值必须是0,1,2中的一个" description:"状态：0=禁用，1=正常，2=锁定"`
	RoleIds      []uint64 `json:"roleIds" description:"角色ID列表"`
}

// SysUserCreateRes 创建用户响应参数
type SysUserCreateRes struct {
	g.Meta `mime:"application/json"`
	Id     uint64 `json:"id" description:"创建成功的用户ID"`
}

// SysUserUpdateReq 更新用户请求参数
type SysUserUpdateReq struct {
	g.Meta       `path:"/sys/user/update/:id" tags:"SysUser" method:"put" summary:"更新用户"`
	Id           uint64   `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
	Username     string   `json:"username" v:"required|length:3,50#用户名不能为空|用户名长度必须在3-50个字符之间" description:"用户名"`
	Email        string   `json:"email" v:"email#邮箱格式不正确" description:"邮箱"`
	Mobile       string   `json:"mobile" v:"length:0,20#手机号长度不能超过20个字符" description:"手机号"`
	DepartmentId uint64   `json:"departmentId" v:"integer#部门ID必须为整数" description:"所属部门ID"`
	Status       int      `json:"status" v:"in:0,1,2#状态值必须是0,1,2中的一个" description:"状态：0=禁用，1=正常，2=锁定"`
	RoleIds      []uint64 `json:"roleIds" description:"角色ID列表"`
}

// SysUserUpdateRes 更新用户响应参数
type SysUserUpdateRes struct {
	g.Meta `mime:"application/json"`
}

// SysUserDeleteReq 删除用户请求参数
type SysUserDeleteReq struct {
	g.Meta `path:"/sys/user/delete/:id" tags:"SysUser" method:"delete" summary:"删除用户"`
	Id     uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
}

// SysUserDeleteRes 删除用户响应参数
type SysUserDeleteRes struct {
	g.Meta `mime:"application/json"`
}

// SysUserListReq 获取用户列表请求参数
type SysUserListReq struct {
	g.Meta       `path:"/sys/user/list" tags:"SysUser" method:"get" summary:"获取用户列表"`
	Page         int    `json:"page" v:"integer#页码必须为整数" description:"页码"`
	Size         int    `json:"size" v:"integer#每页大小必须为整数" description:"每页大小"`
	Username     string `json:"username" v:"length:0,50#用户名长度不能超过50个字符" description:"用户名"`
	DepartmentId uint64 `json:"departmentId" v:"integer#部门ID必须为整数" description:"部门ID"`
	Status       *int   `json:"status" v:"in:0,1,2#状态值必须是0,1,2中的一个" description:"状态：0=禁用，1=正常，2=锁定"`
}

// SysUserListRes 获取用户列表响应参数
type SysUserListRes struct {
	g.Meta `mime:"application/json"`
	List   []*admin.SysUserListResultItem `json:"list" description:"用户列表"`
	Total  int                            `json:"total" description:"总数"`
	// 角色列表
	RoleList []*entity.SysRoles `json:"roleList" description:"角色列表"`
	// 部门列表
	DepartmentList []*entity.SysDepartments `json:"departmentList" description:"部门列表"`
}

// SysUserDetailReq 获取用户详情请求参数
type SysUserDetailReq struct {
	g.Meta `path:"/sys/user/detail/:id" tags:"SysUser" method:"get" summary:"获取用户详情"`
	Id     uint64 `path:"id" v:"required|integer#ID不能为空|ID必须为整数" description:"主键"`
}

// SysUserDetailRes 获取用户详情响应参数
type SysUserDetailRes struct {
	g.Meta `mime:"application/json"`
	*entity.SysUsers
	RoleIds []uint64 `json:"roleIds" description:"角色ID列表"`
}
