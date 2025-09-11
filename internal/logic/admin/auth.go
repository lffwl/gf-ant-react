package admin

import (
	"context"
	"errors"
	"time"

	adminModel "gf-ant-react/internal/model/admin"
	"gf-ant-react/internal/service"
	"gf-ant-react/utility/captcha"
	"gf-ant-react/utility/jwt"
	"gf-ant-react/utility/password"
)

type sAuthLogic struct{}

var AuthLogic = &sAuthLogic{}

// 验证码
func (c *sAuthLogic) Captcha(ctx context.Context, req *adminModel.CaptchaReq) (res *adminModel.CaptchaRes, err error) {
	// 生成验证码
	id, b64s, err := captcha.CaptchaUtility.GenerateCaptchaHandler(req.Width, req.Height, req.Length)
	if err != nil {
		return nil, err
	}
	return &adminModel.CaptchaRes{
		Id:     id,
		Base64: b64s,
	}, nil
}

// 登录
func (c *sAuthLogic) Login(ctx context.Context, req *adminModel.LoginReq) (res *adminModel.LoginRes, err error) {

	res = &adminModel.LoginRes{}

	// 获取用户信息
	res.User, err = service.SysUserService.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, err
	}

	if res.User == nil {
		return nil, errors.New("用户名或者密码错误")
	}

	// 校验密码
	if !password.CheckPasswordHash(req.Password, res.User.PasswordHash) {
		return nil, errors.New("密码错误")
	}

	// 获取用户角色
	res.Roles, err = service.SysRoleService.GetUserRoles(ctx, res.User.Id)
	if err != nil {
		return nil, err
	}

	// 存在角色才查询
	if len(res.Roles) > 0 {
		// 转换角色ID数组
		for _, role := range res.Roles {
			res.RoleIds = append(res.RoleIds, role.Id)
		}

		// 获取用户角色关联的API
		res.Apis, err = service.SysApiService.GetApisByRoleIds(ctx, res.RoleIds)
		if err != nil {
			return nil, err
		}

		if len(res.Apis) > 0 {
			for _, api := range res.Apis {
				res.ApiCodes = append(res.ApiCodes, api.PermissionCode)
			}
		}
	}

	// 生成token
	res.Token, err = jwt.JwtUtility.GenerateToken(res.User.Id, res.User.Username)
	if err != nil {
		return nil, err
	}

	// 过期时间
	res.Expire = time.Now().Add(time.Duration(jwt.JwtUtility.Expire) * time.Second)

	// 刷新时间
	res.Refresh = res.Expire.Add(time.Duration(jwt.JwtUtility.RefreshExpire) * time.Second)

	return
}
