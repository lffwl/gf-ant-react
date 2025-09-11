import React from 'react';
// 权限工具函数集合

/**
 * 获取用户的apiCodes权限列表
 * @returns 用户的权限列表数组
 */
export const getUserApiCodes = (): string[] => {
  try {
    const apiCodesStr = localStorage.getItem('apiCodes');
    if (apiCodesStr) {
      return JSON.parse(apiCodesStr) as string[];
    }
  } catch (error) {
    console.error('解析apiCodes失败:', error);
  }
  return [];
};

/**
 * 检查用户是否有指定的权限
 * @param permission 要检查的权限码
 * @returns 用户是否有该权限
 */
export const hasPermission = (permission: string): boolean => {
  const apiCodes = getUserApiCodes();
  return apiCodes.includes(permission);
};

/**
 * 检查用户是否有指定的任一权限
 * @param permissions 要检查的权限码数组
 * @returns 用户是否有任一权限
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  const apiCodes = getUserApiCodes();
  return permissions.some(permission => apiCodes.includes(permission));
};

/**
 * 检查用户是否有指定的所有权限
 * @param permissions 要检查的权限码数组
 * @returns 用户是否有所有权限
 */
export const hasAllPermissions = (permissions: string[]): boolean => {
  const apiCodes = getUserApiCodes();
  return permissions.every(permission => apiCodes.includes(permission));
};

/**
 * React Hook - 检查用户是否有指定的权限
 * @param permission 要检查的权限码
 * @returns 用户是否有该权限
 */
export const usePermission = (permission: string): boolean => {
  // 由于权限数据从localStorage获取，这里不需要useState和useEffect
  // 组件重新渲染时会自动重新检查权限
  return hasPermission(permission);
};

/**
 * React Hook - 检查用户是否有指定的任一权限
 * @param permissions 要检查的权限码数组
 * @returns 用户是否有任一权限
 */
export const useAnyPermission = (permissions: string[]): boolean => {
  return hasAnyPermission(permissions);
};

/**
 * React Hook - 检查用户是否有指定的所有权限
 * @param permissions 要检查的权限码数组
 * @returns 用户是否有所有权限
 */
export const useAllPermissions = (permissions: string[]): boolean => {
  return hasAllPermissions(permissions);
};

/**
 * 权限控制的按钮组件接口
 */
export interface PermissionButtonProps {
  permission: string; // 所需权限码
  children: React.ReactNode; // 按钮内容
  fallback?: React.ReactNode; // 无权限时显示的内容，默认为null
  showMessage?: boolean; // 无权限时是否显示提示信息，默认为true
  messageText?: string; // 无权限时显示的提示信息，默认为'您没有权限执行此操作'
  onClick?: () => void; // 有权限时的点击事件处理函数
  [key: string]: any; // 其他传递给按钮的props
}

/**
 * 权限控制的按钮组件
 * 当用户没有指定权限时，按钮会被禁用或替换为fallback内容
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  children,
  fallback = null,
  showMessage = true,
  messageText = '您没有权限执行此操作',
  onClick,
  ...props
}) => {
  const hasPermission = usePermission(permission);

  // 如果用户没有权限，返回fallback内容或null
  if (!hasPermission) {
    // 如果有自定义的fallback内容，返回fallback
    if (fallback !== null) {
      return fallback;
    }
    
    // 否则返回null，不显示按钮
    return null;
  }

  // 如果用户有权限，返回原始按钮
  return React.cloneElement(children as React.ReactElement, {
    ...props,
    onClick: onClick,
  });
};

/**
 * 权限控制的操作按钮包装器
 * 用于表格操作列中的权限控制
 */
export const PermissionAction: React.FC<PermissionButtonProps> = (props) => {
  return <PermissionButton {...props} />;
};

/**
 * 权限控制的内容包装器
 * 根据权限决定是否渲染内容
 */
export interface PermissionGuardProps {
  permission: string; // 所需权限码
  children: React.ReactNode; // 要渲染的内容
  fallback?: React.ReactNode; // 无权限时显示的内容，默认为null
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const hasPermission = usePermission(permission);
  return hasPermission ? <>{children}</> : (fallback !== null ? fallback : null);
};