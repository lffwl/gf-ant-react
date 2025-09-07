package admin

// sys_user Status 状态: 0=禁用, 1=正常, 2=锁定
const (
	StatusLocked = 2 // 锁定
)

var (
	UserStatusMap = map[int]string{
		StatusDisabled: "禁用",
		StatusEnabled:  "正常",
		StatusLocked:   "锁定",
	}
)
