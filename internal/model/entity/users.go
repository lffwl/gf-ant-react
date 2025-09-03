// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Users is the golang structure for table users.
type Users struct {
	Id            uint64      `json:"id"            orm:"id"             description:""`                     //
	Username      string      `json:"username"      orm:"username"       description:"用户名"`                  // 用户名
	PasswordHash  string      `json:"passwordHash"  orm:"password_hash"  description:"密码哈希"`                 // 密码哈希
	Email         string      `json:"email"         orm:"email"          description:"邮箱"`                   // 邮箱
	Mobile        string      `json:"mobile"        orm:"mobile"         description:"手机号"`                  // 手机号
	Status        int         `json:"status"        orm:"status"         description:"状态: 0=禁用, 1=正常, 2=锁定"` // 状态: 0=禁用, 1=正常, 2=锁定
	LastLoginAt   *gtime.Time `json:"lastLoginAt"   orm:"last_login_at"  description:"最后登录时间"`               // 最后登录时间
	LastLoginIp   string      `json:"lastLoginIp"   orm:"last_login_ip"  description:"最后登录IP"`               // 最后登录IP
	LoginAttempts uint        `json:"loginAttempts" orm:"login_attempts" description:"登录失败次数"`               // 登录失败次数
	LockedUntil   *gtime.Time `json:"lockedUntil"   orm:"locked_until"   description:"锁定到期时间"`               // 锁定到期时间
	CreatedAt     *gtime.Time `json:"createdAt"     orm:"created_at"     description:""`                     //
	UpdatedAt     *gtime.Time `json:"updatedAt"     orm:"updated_at"     description:""`                     //
	DeletedAt     *gtime.Time `json:"deletedAt"     orm:"deleted_at"     description:"软删除时间 (NULL=未删除)"`     // 软删除时间 (NULL=未删除)
}
