// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// CmsSiteSetting is the golang structure of table cms_site_setting for DAO operations like Where/Data.
type CmsSiteSetting struct {
	g.Meta       `orm:"table:cms_site_setting, do:true"`
	Id           any         // 主键ID
	SettingKey   any         // 配置项键名，如 site_name, contact_email, enable_register
	SettingValue any         // 配置项值，可为字符串、JSON 或其他序列化格式
	ValueType    any         // 值类型
	Group        any         // 配置分组，如 general, seo, email, social, security
	Description  any         // 配置项说明
	CreatedBy    any         // 创建人ID（如管理员用户ID）
	UpdatedBy    any         // 最后更新人ID
	CreatedAt    *gtime.Time // 创建时间
	UpdatedAt    *gtime.Time // 最后更新时间
	DeletedAt    *gtime.Time // 软删除时间，NULL表示未删除
}
