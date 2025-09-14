package v1

import (
	"gf-ant-react/internal/model/admin"

	"github.com/gogf/gf/v2/frame/g"
)

// 获取验证码接口
type AuthCaptchaReq struct {
	g.Meta `path:"/auth/captcha" tags:"Auth" method:"get" summary:"获取验证码"`
	Width  int `json:"width" dc:"验证码宽度" default:"120"`
	Height int `json:"height" dc:"验证码高度" default:"40"`
}

// AuthCaptchaRes 获取验证码接口返回
type AuthCaptchaRes struct {
	g.Meta `mime:"application/json"`
	Id     string `json:"id" dc:"验证码ID"`
	Base64 string `json:"base64" dc:"base64编码后的验证码图片"`
}

// AuthLoginReq 登录接口定义
type AuthLoginReq struct {
	g.Meta      `path:"/auth/login" tags:"Auth" method:"post" summary:"登录"`
	Username    string `json:"username" v:"required#请输入用户名"`
	Password    string `json:"password" v:"required#请输入密码"`
	CaptchaCode string `json:"captchaCode" v:"required#请输入验证码"`
	CaptchaId   string `json:"captchaId" v:"required#请输入验证码ID"`
}

// AuthLoginRes 登录接口返回
type AuthLoginRes struct {
	g.Meta `mime:"application/json"`
	*admin.LoginRes
}

// 重置密码
type AuthResetPasswordReq struct {
	g.Meta   `path:"/auth/reset-password" tags:"Auth" method:"post" summary:"重置密码"`
	Password string `json:"password" v:"required#请输入密码"`
}

// 重置密码返回
type AuthResetPasswordRes struct {
	g.Meta `mime:"application/json"`
}
