package admin

// sys_user Status 状态: 0=禁用, 1=正常, 2=锁定
const (
	UserStatusDisabled = 0 // 禁用
	UserStatusEnabled  = 1 // 正常
	UserStatusLocked   = 2 // 锁定
)

var (
	UserStatusMap = map[int]string{
		UserStatusDisabled: "禁用",
		UserStatusEnabled:  "正常",
		UserStatusLocked:   "锁定",
	}
)
