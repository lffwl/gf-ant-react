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
func (c *Captcha) GenerateCaptchaHandler(width, height, length int) (string, string, error) {
	// 使用数字验证码驱动，v1.3.8版本的正确参数格式
	driver := base64Captcha.NewDriverDigit(height, width, length, 0.5, 10)

	// 创建存储
	store := base64Captcha.DefaultMemStore

	// 创建验证码实例
	captcha := base64Captcha.NewCaptcha(driver, store)

	// 生成验证码 - v1.3.8版本返回4个值
	id, b64s, _, err := captcha.Generate()
	if err != nil {
		return "", "", fmt.Errorf("生成验证码失败: %v", err)
	}

	return id, b64s, nil
}

// VerifyCaptchaHandler 验证验证码
// 返回: 是否验证通过
func (c *Captcha) VerifyCaptchaHandler(id, answer string) bool {
	// 检查ID和答案是否为空
	if id == "" || answer == "" {
		return false
	}
	return base64Captcha.DefaultMemStore.Verify(id, answer, true)
}
