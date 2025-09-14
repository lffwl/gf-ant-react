package error

import (
	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
)

const (
	CodeNoLogin = 10 // 没有登录
	CodeNoAuth  = 20 // 没有权限
)

const (
	ErrorUserDisabledCode = 1
	ErrorUserLockedCode   = 2
)

var (
	ErrorUserDisabled = gerror.NewCode(gcode.New(ErrorUserDisabledCode, "用户已禁用", nil))
	ErrorUserLocked   = gerror.NewCode(gcode.New(ErrorUserLockedCode, "用户已被锁定", nil))
)
