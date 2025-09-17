// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package admin

import (
	"context"

	"gf-ant-react/api/admin/v1"
)

type IAdminV1 interface {
	AuthCaptcha(ctx context.Context, req *v1.AuthCaptchaReq) (res *v1.AuthCaptchaRes, err error)
	AuthLogin(ctx context.Context, req *v1.AuthLoginReq) (res *v1.AuthLoginRes, err error)
	AuthResetPassword(ctx context.Context, req *v1.AuthResetPasswordReq) (res *v1.AuthResetPasswordRes, err error)
	AuthProfile(ctx context.Context, req *v1.AuthProfileReq) (res *v1.AuthProfileRes, err error)
	SysApiCreate(ctx context.Context, req *v1.SysApiCreateReq) (res *v1.SysApiCreateRes, err error)
	SysApiUpdate(ctx context.Context, req *v1.SysApiUpdateReq) (res *v1.SysApiUpdateRes, err error)
	SysApiDelete(ctx context.Context, req *v1.SysApiDeleteReq) (res *v1.SysApiDeleteRes, err error)
	SysApiTree(ctx context.Context, req *v1.SysApiTreeReq) (res *v1.SysApiTreeRes, err error)
	SysDepartmentCreate(ctx context.Context, req *v1.SysDepartmentCreateReq) (res *v1.SysDepartmentCreateRes, err error)
	SysDepartmentUpdate(ctx context.Context, req *v1.SysDepartmentUpdateReq) (res *v1.SysDepartmentUpdateRes, err error)
	SysDepartmentDelete(ctx context.Context, req *v1.SysDepartmentDeleteReq) (res *v1.SysDepartmentDeleteRes, err error)
	SysDepartmentTree(ctx context.Context, req *v1.SysDepartmentTreeReq) (res *v1.SysDepartmentTreeRes, err error)
	SysRoleCreate(ctx context.Context, req *v1.SysRoleCreateReq) (res *v1.SysRoleCreateRes, err error)
	SysRoleUpdate(ctx context.Context, req *v1.SysRoleUpdateReq) (res *v1.SysRoleUpdateRes, err error)
	SysRoleDelete(ctx context.Context, req *v1.SysRoleDeleteReq) (res *v1.SysRoleDeleteRes, err error)
	SysRoleList(ctx context.Context, req *v1.SysRoleListReq) (res *v1.SysRoleListRes, err error)
	SysRoleDetail(ctx context.Context, req *v1.SysRoleDetailReq) (res *v1.SysRoleDetailRes, err error)
	SysUserCreate(ctx context.Context, req *v1.SysUserCreateReq) (res *v1.SysUserCreateRes, err error)
	SysUserUpdate(ctx context.Context, req *v1.SysUserUpdateReq) (res *v1.SysUserUpdateRes, err error)
	SysUserDelete(ctx context.Context, req *v1.SysUserDeleteReq) (res *v1.SysUserDeleteRes, err error)
	SysUserList(ctx context.Context, req *v1.SysUserListReq) (res *v1.SysUserListRes, err error)
	SysUserDetail(ctx context.Context, req *v1.SysUserDetailReq) (res *v1.SysUserDetailRes, err error)
	SysUserUpdatePassword(ctx context.Context, req *v1.SysUserUpdatePasswordReq) (res *v1.SysUserUpdatePasswordRes, err error)
	Upload(ctx context.Context, req *v1.UploadReq) (res *v1.UploadRes, err error)
}
