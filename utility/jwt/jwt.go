package jwt

import (
	"context"
	"errors"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/golang-jwt/jwt/v5"
)

var JwtUtility = &jwtUtility{
	Secret:        g.Cfg("jwt").MustGet(context.Background(), "secret").String(),
	Expire:        g.Cfg("jwt").MustGet(context.Background(), "expire").Int64(),
	RefreshExpire: g.Cfg("jwt").MustGet(context.Background(), "refresh_expire").Int64(),
	Issuer:        g.Cfg("jwt").MustGet(context.Background(), "issuer").String(),
}

// 定义一些错误常量
var (
	errorTokenInvalid        = errors.New("token is invalid")
	errorRefreshTokenExpired = errors.New("refresh token has expired")
)

type jwtUtility struct {
	Secret        string
	Expire        int64
	RefreshExpire int64
	Issuer        string
}

// Claims 自定义声明结构体
// 注意：这个结构体需要与项目中其他地方使用的 JWT Claims 兼容
type Claims struct {
	UserID      uint64    `json:"user_id"`
	Username    string    `json:"username"`
	RefreshTime time.Time `json:"refresh_time"` // 刷新时间
	jwt.RegisteredClaims
}

// GenerateToken 生成 JWT 令牌
// secret: 密钥
// expire: 过期时间（秒）
func (j *jwtUtility) GenerateToken(userID uint64, username string) (string, error) {

	// 设置令牌过期时间
	expirationTime := time.Now().Add(time.Duration(j.Expire) * time.Second)
	// 刷新令牌过期时间
	refreshExpirationTime := expirationTime.Add(time.Duration(j.RefreshExpire) * time.Second)

	// 创建声明
	claims := &Claims{
		UserID:      userID,
		Username:    username,
		RefreshTime: refreshExpirationTime,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    j.Issuer,
		},
	}

	// 创建令牌
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 签名并获取完整的编码后的字符串令牌
	tokenString, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// RefreshToken 刷新 JWT 令牌
// token: 当前令牌
// secret: 密钥
// expire: 新令牌的过期时间（秒）
func (j *jwtUtility) RefreshToken(tokenString string) (string, error) {

	// 解析令牌
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// 验证签名算法
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errorTokenInvalid
		}
		return []byte(j.Secret), nil
	})

	// 检查令牌是否有效
	if err != nil {

		// 如果令牌过期，这是正常的刷新情况
		if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenNotValidYet) {

			// 检查刷新时间
			if time.Now().After(claims.RefreshTime) {
				return "", errorRefreshTokenExpired
			}

			// 生成新令牌
			return j.GenerateToken(claims.UserID, claims.Username)
		}
		return "", err
	}

	// 如果令牌仍然有效，也可以刷新（可选）
	if token.Valid {
		return j.GenerateToken(claims.UserID, claims.Username)
	}

	return "", errorTokenInvalid
}

// ParseToken 解析 JWT 令牌
func (j *jwtUtility) ParseToken(tokenString string) (*Claims, error) {

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errorTokenInvalid
		}
		return []byte(j.Secret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errorTokenInvalid
	}

	return claims, nil
}
