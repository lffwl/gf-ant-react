package auth

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

// 获取用户ID
func GetUserId(ctx context.Context) uint64 {

	r := ghttp.RequestFromCtx(ctx)

	return r.GetCtxVar(g.Cfg("auth").MustGet(r.Context(), "CtxUserKey").String()).Uint64()
}
