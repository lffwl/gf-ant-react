package v1

import (
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

// 文件上传接口
type UploadReq struct {
	g.Meta  `path:"/sys/upload" tags:"Upload" method:"post" summary:"文件上传"`
	File    *ghttp.UploadFile `p:"file" type:"file" dc:"文件"`
	BizType string            `p:"bizType" type:"string" dc:"业务类型"`
}

// 文件上传接口
type UploadRes struct {
	g.Meta `mime:"application/json" example:"json"`
	*entity.SysFileUpload
}
