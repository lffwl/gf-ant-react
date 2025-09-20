package admin

const (
	ArticleTypeNormal   = "normal"   // 普通文章
	ArticleTypeExternal = "external" // 外链文章
)

var articleTypeMap = map[string]string{
	ArticleTypeNormal:   "普通文章",
	ArticleTypeExternal: "外链",
}
