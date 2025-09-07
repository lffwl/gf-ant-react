package admin

import (
	"gf-ant-react/internal/model/entity"
)

// SysApiCreateParam 创建API参数
type SysApiCreateParam struct {
	ParentId       uint64 `json:"parentId"`
	Name           string `json:"name"`
	PermissionCode string `json:"permissionCode"`
	Url            string `json:"url"`
	Method         string `json:"method"`
	Sort           int    `json:"sort"`
	Status         int    `json:"status"`
	IsMenu         int    `json:"isMenu"`
	Description    string `json:"description"`
}

// SysApiUpdateParam 更新API参数
type SysApiUpdateParam struct {
	Id             uint64 `json:"id"`
	ParentId       uint64 `json:"parentId"`
	Name           string `json:"name"`
	PermissionCode string `json:"permissionCode"`
	Url            string `json:"url"`
	Method         string `json:"method"`
	Sort           int    `json:"sort"`
	Status         int    `json:"status"`
	IsMenu         int    `json:"isMenu"`
	Description    string `json:"description"`
}

// SysApiListParam API列表查询参数
type SysApiListParam struct {
	Page int `json:"page"`
	Size int `json:"size"`
}

// SysApiTreeResult API树形结构结果
type SysApiTreeResult struct {
	List   []*SysApiTreeResultItem `json:"list"`
	Config map[string]interface{}  `json:"config"`
}

type SysApiTreeResultItem struct {
	*entity.SysApis
	Children []*SysApiTreeResultItem `json:"children,omitempty"`
}
