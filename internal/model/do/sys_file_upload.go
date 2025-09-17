// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysFileUpload is the golang structure of table sys_file_upload for DAO operations like Where/Data.
type SysFileUpload struct {
	g.Meta         `orm:"table:sys_file_upload, do:true"`
	Id             any         // 主键ID
	FileName       any         // 原始文件名
	FileNameStored any         // 存储时的文件名 (可包含路径)
	FileSize       any         // 文件大小 (字节)
	FileType       any         // MIME类型 (如 image/jpeg)
	FileExt        any         // 文件扩展名 (如 jpg, pdf)
	StorageType    any         // 存储类型
	StoragePath    any         // 文件在存储系统中的完整路径或URL
	StorageBucket  any         // 存储桶名称 (用于云存储)
	BizType        any         // 业务类型 (如 avatar, document, image)
	UploaderId     any         // 上传者ID
	DeletedAt      *gtime.Time // 软删除时间，NULL表示未删除
	IsPublic       any         // 是否公开: 0-私有, 1-公开
	Md5Hash        any         // 文件MD5哈希值，用于去重和完整性校验
	CreatedAt      *gtime.Time // 创建时间
	UpdatedAt      *gtime.Time // 更新时间
}
