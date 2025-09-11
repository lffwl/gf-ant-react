package admin

import (
	"gf-ant-react/internal/model/entity"
	"time"
)

type CaptchaReq struct {
	Width  int `json:"width"`
	Height int `json:"height"`
	Length int `json:"length"`
}

type CaptchaRes struct {
	Id     string `json:"id"`
	Base64 string `json:"base64"`
}

type LoginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginRes struct {
	User     *entity.SysUsers   `json:"user"`
	Roles    []*entity.SysRoles `json:"roles"`
	RoleIds  []uint64           `json:"roleIds"`
	Apis     []*entity.SysApis  `json:"apis"`
	ApiCodes []string           `json:"apiCodes"`
	Token    string             `json:"token"`
	Expire   time.Time          `json:"expire"`
	Refresh  time.Time          `json:"refresh"`
}
