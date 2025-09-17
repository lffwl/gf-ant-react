package admin

import (
	"context"
	"errors"

	v1 "gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

// Upload 实现文件上传功能
func (c *ControllerV1) Upload(ctx context.Context, req *v1.UploadReq) (res *v1.UploadRes, err error) {
	// 检查文件是否为空
	if req.File == nil {
		return nil, errors.New("请上传文件")
	}

	// 调用逻辑层进行文件上传
	fileInfo, err := admin.SysFileUploadLogic.UploadFile(ctx, req.File, req.BizType)
	if err != nil {
		return nil, err
	}

	// 构建响应
	res = &v1.UploadRes{
		SysFileUpload: fileInfo,
	}

	return res, nil
}
