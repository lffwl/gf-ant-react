package v1

import (
	"time"

	"github.com/gogf/gf/v2/frame/g"
)

// AuthLoginReq 登录接口定义
type AuthLoginReq struct {
	g.Meta   `path:"/auth/login" tags:"Auth" method:"post" summary:"登录"`
	Username string `json:"username" v:"required#请输入用户名"`
	Password string `json:"password" v:"required#请输入密码"`
	Code     string `json:"code" v:"required#请输入验证码"`
}

// AuthLoginRes 登录接口返回
type AuthLoginRes struct {
	g.Meta `mime:"application/json"`
	Token  string    `json:"token" dc:"token"`
	Expire time.Time `json:"expire" dc:"过期时间"`
}
