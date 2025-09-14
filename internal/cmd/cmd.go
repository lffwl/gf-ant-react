package cmd

import (
	"context"
	"strings"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"

	"gf-ant-react/internal/controller/admin"
	"gf-ant-react/internal/controller/hello"
	adminLogic "gf-ant-react/internal/logic/admin"
	adminModel "gf-ant-react/internal/model/admin"
	errorUtil "gf-ant-react/utility/error"
	"gf-ant-react/utility/jwt"
)

var (
	Main = gcmd.Command{
		Name:  "main",
		Usage: "main",
		Brief: "start http server",
		Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
			s := g.Server()
			s.Use(
				ghttp.MiddlewareCORS,
			)
			s.Group("/", func(group *ghttp.RouterGroup) {
				group.Middleware(
					ghttp.MiddlewareHandlerResponse,
					MiddlewareAuthAdmin,
				)
				group.Bind(
					hello.NewV1(),
					admin.NewV1(),
				)
			})
			s.Run()
			return nil
		},
	}
)

// MiddlewareAuthAdmin 验证用户中间件
func MiddlewareAuthAdmin(r *ghttp.Request) {

	// 是否是忽略的路由
	ignoreRoutes := g.Cfg("auth").MustGet(r.Context(), "ignoreRoutes").MapStrStr()
	method, ok := ignoreRoutes[r.Router.Uri]
	// 检查是否需要权限
	if !ok || method != strings.ToUpper(r.Request.Method) {

		// 从请求头中获取 token
		token := r.Header.Get(g.Cfg("auth").MustGet(r.Context(), "TokenHeader").String())
		if token == "" {
			JsonExit(r, errorUtil.CodeNoLogin, "没有登录")
			return
		}

		// 解析 token
		claims, err := jwt.JwtUtility.ParseToken(token)
		if err != nil {
			JsonExit(r, errorUtil.CodeNoLogin, err.Error())
			return
		}

		// 设置上下文用户ID
		r.SetCtxVar(g.Cfg("auth").MustGet(r.Context(), "CtxUserKey").String(), claims.UserID)

		// 只需要登录不需要权限的路由
		publicRoutes := g.Cfg("auth").MustGet(r.Context(), "publicRoutes").MapStrStr()
		method, publicOk := publicRoutes[r.Router.Uri]
		if !publicOk || method != strings.ToUpper(r.Request.Method) {

			// 验证权限
			ok, err := adminLogic.AuthLogic.CheckPermission(r.Context(), &adminModel.CheckPermissionReq{
				UserId: claims.UserID,
				Url:    r.Router.Uri,
				Method: strings.ToUpper(r.Request.Method),
			})
			if err != nil {
				JsonExit(r, errorUtil.CodeNoAuth, err.Error())
				return
			}

			// 没有权限
			if !ok {
				JsonExit(r, errorUtil.CodeNoAuth, "没有权限")
				return
			}

		}

	}

	r.Middleware.Next()
}

// JsonResponse 数据返回通用JSON数据结构
type JsonResponse struct {
	Code    int         `json:"code"`    // 错误码((0:成功, 1:失败, >1:错误码))
	Message string      `json:"message"` // 提示信息
	Data    interface{} `json:"data"`    // 返回数据(业务接口定义具体数据结构)
}

// Json 标准返回结果数据结构封装。
func Json(r *ghttp.Request, code int, message string, data ...interface{}) {
	responseData := interface{}(nil)
	if len(data) > 0 {
		responseData = data[0]
	}
	r.Response.WriteJson(JsonResponse{
		Code:    code,
		Message: message,
		Data:    responseData,
	})
}

// JsonExit 返回JSON数据并退出当前HTTP执行函数。
func JsonExit(r *ghttp.Request, err int, msg string, data ...interface{}) {
	Json(r, err, msg, data...)
	r.Exit()
}
