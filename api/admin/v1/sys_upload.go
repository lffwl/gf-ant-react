package v1

import (
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

// 文件上传接口
type UploadReq struct {
	g.Meta  `path:"/sys/upload" mime:"multipart/form-data" tags:"Upload" method:"post" summary:"文件上传"`
	File    *ghttp.UploadFile `p:"file" type:"file" dc:"文件"`
	BizType string            `p:"bizType" dc:"业务类型"`
}

// 文件上传接口
type UploadRes struct {
	g.Meta `mime:"application/json" example:"json"`
	*entity.SysFileUpload
}

// 文件列表接口
type UploadListReq struct {
	g.Meta   `path:"/sys/upload/list" tags:"Upload" method:"get" summary:"文件列表"`
	BizType  string `p:"bizType" dc:"业务类型"`
	FileName string `p:"fileName" dc:"文件名"`
	Page     int    `p:"page"  dc:"当前页码" default:"1"`
	PageSize int    `p:"pageSize" dc:"每页数量" default:"20"`
}

type UploadListRes struct {
	g.Meta `mime:"application/json" example:"json"`
	List   []*entity.SysFileUpload `json:"list"`
	Total  int                     `json:"total"`
}
