package sys_user

// sys_user Status 状态: 0=禁用, 1=正常, 2=锁定
const (
	StatusDisabled = 0 // 禁用
	StatusEnabled  = 1 // 启用
	StatusLocked   = 2 // 锁定
)

var (
	StatusMap = map[int]string{
		StatusDisabled: "禁用",
		StatusEnabled:  "正常",
		StatusLocked:   "锁定",
	}
)
