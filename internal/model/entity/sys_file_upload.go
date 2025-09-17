// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysFileUpload is the golang structure for table sys_file_upload.
type SysFileUpload struct {
	Id             uint64      `json:"id"             orm:"id"               description:"主键ID"`                             // 主键ID
	FileName       string      `json:"fileName"       orm:"file_name"        description:"原始文件名"`                            // 原始文件名
	FileNameStored string      `json:"fileNameStored" orm:"file_name_stored" description:"存储时的文件名 (可包含路径)"`                  // 存储时的文件名 (可包含路径)
	FileSize       uint64      `json:"fileSize"       orm:"file_size"        description:"文件大小 (字节)"`                        // 文件大小 (字节)
	FileType       string      `json:"fileType"       orm:"file_type"        description:"MIME类型 (如 image/jpeg)"`            // MIME类型 (如 image/jpeg)
	FileExt        string      `json:"fileExt"        orm:"file_ext"         description:"文件扩展名 (如 jpg, pdf)"`               // 文件扩展名 (如 jpg, pdf)
	StorageType    string      `json:"storageType"    orm:"storage_type"     description:"存储类型"`                             // 存储类型
	StoragePath    string      `json:"storagePath"    orm:"storage_path"     description:"文件在存储系统中的完整路径或URL"`                // 文件在存储系统中的完整路径或URL
	StorageBucket  string      `json:"storageBucket"  orm:"storage_bucket"   description:"存储桶名称 (用于云存储)"`                    // 存储桶名称 (用于云存储)
	BizType        string      `json:"bizType"        orm:"biz_type"         description:"业务类型 (如 avatar, document, image)"` // 业务类型 (如 avatar, document, image)
	UploaderId     uint64      `json:"uploaderId"     orm:"uploader_id"      description:"上传者ID"`                            // 上传者ID
	DeletedAt      *gtime.Time `json:"deletedAt"      orm:"deleted_at"       description:"软删除时间，NULL表示未删除"`                  // 软删除时间，NULL表示未删除
	IsPublic       int         `json:"isPublic"       orm:"is_public"        description:"是否公开: 0-私有, 1-公开"`                 // 是否公开: 0-私有, 1-公开
	Md5Hash        string      `json:"md5Hash"        orm:"md5_hash"         description:"文件MD5哈希值，用于去重和完整性校验"`              // 文件MD5哈希值，用于去重和完整性校验
	CreatedAt      *gtime.Time `json:"createdAt"      orm:"created_at"       description:"创建时间"`                             // 创建时间
	UpdatedAt      *gtime.Time `json:"updatedAt"      orm:"updated_at"       description:"更新时间"`                             // 更新时间
}
