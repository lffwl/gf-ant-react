package captcha

import (
	"fmt"

	"github.com/mojocn/base64Captcha"
)

var CaptchaUtility = &Captcha{}

type Captcha struct {
}

// GenerateCaptchaHandler 生成验证码
// 返回: (验证码ID, 验证码图片base64, 错误)
func (c *Captcha) GenerateCaptchaHandler(length int) (string, string, error) {
	// 配置验证码
	config := base64Captcha.ConfigCharacter{
		Height: 60,
		Width:  240,
		// 设置验证码长度
		Length: length,
		// 设置字体大小
		Fonts: []string{"wqy-microhei.ttc"},
		// 设置噪点
		MaxSkew:  0.7,
		DotCount: 80,
	}

	// 创建验证码实例
	captcha := base64Captcha.NewCaptcha(&config, base64Captcha.DefaultMemStore)

	// 生成验证码
	id, b64s, err := captcha.Generate()
	if err != nil {
		return "", "", fmt.Errorf("生成验证码失败: %v", err)
	}

	return id, b64s, nil
}

// VerifyCaptchaHandler 验证验证码
// 返回: 是否验证通过
func (c *Captcha) VerifyCaptchaHandler(id, answer string) bool {
	// 使用base64Captcha的默认存储进行验证
	// 注意：这里我们使用base64Captcha自己的存储，而不是我们定义的store
	// 因为base64Captcha的验证逻辑依赖于它自己的存储
	verifyResult := base64Captcha.DefaultMemStore.Verify(id, answer, true)

	return verifyResult
}
