// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// CmsSiteSetting is the golang structure for table cms_site_setting.
type CmsSiteSetting struct {
	Id           uint64      `json:"id"           orm:"id"            description:"主键ID"`                                              // 主键ID
	SettingKey   string      `json:"settingKey"   orm:"setting_key"   description:"配置项键名，如 site_name, contact_email, enable_register"` // 配置项键名，如 site_name, contact_email, enable_register
	SettingValue string      `json:"settingValue" orm:"setting_value" description:"配置项值，可为字符串、JSON 或其他序列化格式"`                          // 配置项值，可为字符串、JSON 或其他序列化格式
	ValueType    string      `json:"valueType"    orm:"value_type"    description:"值类型"`                                               // 值类型
	Group        string      `json:"group"        orm:"group"         description:"配置分组，如 general, seo, email, social, security"`      // 配置分组，如 general, seo, email, social, security
	Description  string      `json:"description"  orm:"description"   description:"配置项说明"`                                             // 配置项说明
	CreatedBy    uint64      `json:"createdBy"    orm:"created_by"    description:"创建人ID（如管理员用户ID）"`                                   // 创建人ID（如管理员用户ID）
	UpdatedBy    uint64      `json:"updatedBy"    orm:"updated_by"    description:"最后更新人ID"`                                           // 最后更新人ID
	CreatedAt    *gtime.Time `json:"createdAt"    orm:"created_at"    description:"创建时间"`                                              // 创建时间
	UpdatedAt    *gtime.Time `json:"updatedAt"    orm:"updated_at"    description:"最后更新时间"`                                            // 最后更新时间
	DeletedAt    *gtime.Time `json:"deletedAt"    orm:"deleted_at"    description:"软删除时间，NULL表示未删除"`                                   // 软删除时间，NULL表示未删除
}
