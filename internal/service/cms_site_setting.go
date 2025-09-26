package service

import (
	"context"

	"gf-ant-react/internal/dao"
	"gf-ant-react/internal/model/entity"

	"github.com/gogf/gf/v2/util/gconv"
)

type CmsSiteSetting struct{}

var CmsSiteSettingService = &CmsSiteSetting{}

// CreateSiteSetting 保存网站设置到数据库
func (s *CmsSiteSetting) CreateSiteSetting(ctx context.Context, setting *entity.CmsSiteSetting) (*entity.CmsSiteSetting, error) {
	// 插入数据库
	id, err := dao.CmsSiteSetting.Ctx(ctx).InsertAndGetId(setting)
	if err != nil {
		return nil, err
	}

	setting.Id = gconv.Uint64(id)
	return setting, nil
}

// UpdateSiteSetting 更新网站设置
func (s *CmsSiteSetting) UpdateSiteSetting(ctx context.Context, setting *entity.CmsSiteSetting) error {
	_, err := dao.CmsSiteSetting.Ctx(ctx).
		Where(dao.CmsSiteSetting.Columns().Id, setting.Id).
		Update(setting)
	return err
}

// DeleteSiteSetting 从数据库中删除网站设置
func (s *CmsSiteSetting) DeleteSiteSetting(ctx context.Context, id uint64) error {
	_, err := dao.CmsSiteSetting.Ctx(ctx).
		Where(dao.CmsSiteSetting.Columns().Id, id).
		Delete()
	return err
}

// GetSiteSettingById 根据ID获取网站设置
func (s *CmsSiteSetting) GetSiteSettingById(ctx context.Context, id uint64) (*entity.CmsSiteSetting, error) {
	var setting *entity.CmsSiteSetting
	err := dao.CmsSiteSetting.Ctx(ctx).
		Where(dao.CmsSiteSetting.Columns().Id, id).
		Scan(&setting)
	return setting, err
}

// GetSiteSettingList 获取网站设置列表
func (s *CmsSiteSetting) GetSiteSettingList(ctx context.Context, group string) ([]*entity.CmsSiteSetting, int, error) {
	var settings []*entity.CmsSiteSetting
	model := dao.CmsSiteSetting.Ctx(ctx)
	if group != "" {
		model = model.Where(dao.CmsSiteSetting.Columns().Group, group)
	}

	// 获取总数
	total, err := model.Count()
	if err != nil {
		return nil, 0, err
	}

	err = model.OrderAsc(dao.CmsSiteSetting.Columns().Id).Scan(&settings)
	return settings, total, err
}

// CheckSettingKeyExists 检查设置键是否已存在
func (s *CmsSiteSetting) CheckSettingKeyExists(ctx context.Context, settingKey string, excludeId uint64) (bool, error) {
	var count int
	model := dao.CmsSiteSetting.Ctx(ctx).Where(dao.CmsSiteSetting.Columns().SettingKey, settingKey)
	if excludeId > 0 {
		model = model.WhereNot(dao.CmsSiteSetting.Columns().Id, excludeId)
	}
	count, err := model.Count()
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// 分组获取网站设置列表
func (s *CmsSiteSetting) GetSiteSettingGroups(ctx context.Context) ([]string, error) {
	groups, err := dao.CmsSiteSetting.Ctx(ctx).
		Distinct().
		Fields(dao.CmsSiteSetting.Columns().Group).
		Array()
	return gconv.Strings(groups), err
}
