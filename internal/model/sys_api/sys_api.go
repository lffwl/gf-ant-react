package sys_api

// Status 状态：0=禁用，1=启用
const (
	StatusDisabled = 0 // 禁用
	StatusEnabled  = 1 // 启用
)

var (
	StatusMap = map[int]string{
		StatusDisabled: "禁用",
		StatusEnabled:  "启用",
	}
)

// Method 请求方法枚举
const (
	MethodGET     = "GET"     // GET
	MethodPOST    = "POST"    // POST
	MethodPUT     = "PUT"     // PUT
	MethodDELETE  = "DELETE"  // DELETE
	MethodPATCH   = "PATCH"   // PATCH
	MethodOPTIONS = "OPTIONS" // OPTIONS
	MethodHEAD    = "HEAD"    // HEAD
)

var (
	MethodMap = map[string]string{
		MethodGET:     "GET",
		MethodPOST:    "POST",
		MethodPUT:     "PUT",
		MethodDELETE:  "DELETE",
		MethodPATCH:   "PATCH",
		MethodOPTIONS: "OPTIONS",
		MethodHEAD:    "HEAD",
	}
)

// IsMenu 是否为菜单：0=否，1=是
const (
	IsMenuNo  = 0 // 否
	IsMenuYes = 1 // 是
)

var (
	IsMenuMap = map[int]string{
		IsMenuNo:  "否",
		IsMenuYes: "是",
	}
)
