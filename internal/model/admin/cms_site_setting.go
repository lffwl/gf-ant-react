package admin

type GetSiteSettingListReq struct {
	Page       int
	Size       int
	Group      string
	SettingKey string
}
