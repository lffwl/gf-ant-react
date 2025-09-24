package admin

import (
	"context"

	"gf-ant-react/api/admin/cms"
	"gf-ant-react/internal/model/entity"
	"gf-ant-react/internal/service"
	"gf-ant-react/utility/auth"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
)

type sCmsSiteSettingLogic struct{}

var CmsSiteSettingLogic = &sCmsSiteSettingLogic{}

// CreateSiteSetting 创建网站设置
func (s *sCmsSiteSettingLogic) CreateSiteSetting(ctx context.Context, req *cms.SiteSettingCreateReq) error {
	// 检查设置键是否已存在
	exists, err := service.CmsSiteSettingService.CheckSettingKeyExists(ctx, req.SettingKey, 0)
	if err != nil {
		return err
	}
	if exists {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "配置项键名已存在")
	}

	// 创建网站设置实体
	setting := &entity.CmsSiteSetting{
		SettingKey:   req.SettingKey,
		SettingValue: req.SettingValue,
		ValueType:    req.ValueType,
		Group:        req.Group,
		Description:  req.Description,
		CreatedBy:    auth.GetUserId(ctx),
		UpdatedBy:    auth.GetUserId(ctx),
	}

	// 调用服务层保存网站设置
	_, err = service.CmsSiteSettingService.CreateSiteSetting(ctx, setting)
	return err
}

// UpdateSiteSetting 更新网站设置
func (s *sCmsSiteSettingLogic) UpdateSiteSetting(ctx context.Context, req *cms.SiteSettingUpdateReq) error {
	// 检查网站设置是否存在
	setting, err := service.CmsSiteSettingService.GetSiteSettingById(ctx, req.Id)
	if err != nil {
		return err
	}
	if setting == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "配置项不存在")
	}

	// 检查设置键是否已被其他配置项使用
	exists, err := service.CmsSiteSettingService.CheckSettingKeyExists(ctx, req.SettingKey, req.Id)
	if err != nil {
		return err
	}
	if exists {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "配置项键名已存在")
	}

	// 更新网站设置信息
	setting.SettingKey = req.SettingKey
	setting.SettingValue = req.SettingValue
	setting.ValueType = req.ValueType
	setting.Group = req.Group
	setting.Description = req.Description
	setting.UpdatedBy = auth.GetUserId(ctx)

	// 调用服务层更新网站设置
	return service.CmsSiteSettingService.UpdateSiteSetting(ctx, setting)
}

// DeleteSiteSetting 删除网站设置
func (s *sCmsSiteSettingLogic) DeleteSiteSetting(ctx context.Context, id uint64) error {
	// 检查网站设置是否存在
	setting, err := service.CmsSiteSettingService.GetSiteSettingById(ctx, id)
	if err != nil {
		return err
	}
	if setting == nil {
		return gerror.NewCode(gcode.CodeBusinessValidationFailed, "配置项不存在")
	}

	// 调用服务层删除网站设置
	return service.CmsSiteSettingService.DeleteSiteSetting(ctx, id)
}

// GetSiteSettingDetail 获取网站设置详情
func (s *sCmsSiteSettingLogic) GetSiteSettingDetail(ctx context.Context, id uint64) (*entity.CmsSiteSetting, error) {
	// 调用服务层获取网站设置详情
	setting, err := service.CmsSiteSettingService.GetSiteSettingById(ctx, id)
	if err != nil {
		return nil, err
	}
	if setting == nil {
		return nil, gerror.NewCode(gcode.CodeBusinessValidationFailed, "配置项不存在")
	}

	return setting, nil
}

// GetSiteSettingList 获取网站设置列表
func (s *sCmsSiteSettingLogic) GetSiteSettingList(ctx context.Context, req *cms.SiteSettingListReq) ([]*entity.CmsSiteSetting, error) {
	// 调用服务层获取网站设置列表
	return service.CmsSiteSettingService.GetSiteSettingList(ctx, req.Group)
}
