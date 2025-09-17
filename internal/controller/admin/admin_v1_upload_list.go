package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
	"gf-ant-react/internal/logic/admin"
)

func (c *ControllerV1) UploadList(ctx context.Context, req *v1.UploadListReq) (res *v1.UploadListRes, err error) {
	// 调用业务层获取文件列表
	fileList, total, err := admin.SysFileUploadLogic.GetUploadList(ctx, req)
	if err != nil {
		return nil, err
	}

	// 构建响应
	res = &v1.UploadListRes{
		List:  fileList,
		Total: total,
	}

	return res, nil
}
