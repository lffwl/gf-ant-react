package v1

import "github.com/gogf/gf/v2/frame/g"

type SysUserCreateReq struct {
	g.Meta       `path:"/sys/user/create" tags:"SysUser" method:"post" summary:"创建用户"`
	Username     string `json:"username" v:"required|length:3,20#用户名不能为空|用户名长度必须在3-20个字符之间" description:"用户名"`
	PasswordHash string `json:"passwordHash" v:"required|length:6,50#密码不能为空|密码长度必须在6-50个字符之间" description:"密码哈希"`
	Email        string `json:"email" v:"email#邮箱格式不正确" description:"邮箱"`
	Mobile       string `json:"mobile" v:"phone#手机号格式不正确" description:"手机号"`
	Status       int    `json:"status" v:"in:0,1,2#状态值必须是0,1,2中的一个" description:"状态: 0=禁用, 1=正常, 2=锁定"`
}

type SysUserCreateRes struct {
	g.Meta `mime:"application/json"`
}
