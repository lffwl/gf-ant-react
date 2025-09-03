package main

import (
	_ "gf-ant-react/internal/packed"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"github.com/gogf/gf/v2/os/gctx"

	"gf-ant-react/internal/cmd"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
