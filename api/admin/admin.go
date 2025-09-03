// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
)

type IAdminV1 interface {
	SysApiCreate(ctx context.Context, req *v1.SysApiCreateReq) (res *v1.SysApiCreateRes, err error)
	SysApiUpdate(ctx context.Context, req *v1.SysApiUpdateReq) (res *v1.SysApiUpdateRes, err error)
	SysApiDelete(ctx context.Context, req *v1.SysApiDeleteReq) (res *v1.SysApiDeleteRes, err error)
	SysApiTree(ctx context.Context, req *v1.SysApiTreeReq) (res *v1.SysApiTreeRes, err error)
	SysUserCreate(ctx context.Context, req *v1.SysUserCreateReq) (res *v1.SysUserCreateRes, err error)
}
