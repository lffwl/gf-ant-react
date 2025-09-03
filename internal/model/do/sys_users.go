// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysUsers is the golang structure of table sys_users for DAO operations like Where/Data.
type SysUsers struct {
	g.Meta        `orm:"table:sys_users, do:true"`
	Id            any         //
	Username      any         // 用户名
	PasswordHash  any         // 密码哈希
	Email         any         // 邮箱
	Mobile        any         // 手机号
	Status        any         // 状态: 0=禁用, 1=正常, 2=锁定
	LastLoginAt   *gtime.Time // 最后登录时间
	LastLoginIp   any         // 最后登录IP
	LoginAttempts any         // 登录失败次数
	LockedUntil   *gtime.Time // 锁定到期时间
	CreatedAt     *gtime.Time //
	UpdatedAt     *gtime.Time //
	DeletedAt     *gtime.Time // 软删除时间 (NULL=未删除)
}
