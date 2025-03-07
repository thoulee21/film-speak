import React from 'react';
import { Platform } from 'react-native';
import { List, useTheme } from 'react-native-paper';

import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/store/slices/devMode';
import ListLRProps from '@/src/types/paperListItem';

const PlatformIcon = ({ color, style }: ListLRProps) => {
  const appTheme = useTheme();
  const devModeEnabled = useAppSelector(selectDevMode);

  return (
    <List.Icon
      style={style}
      color={devModeEnabled ? appTheme.colors.primary : color}
      icon={Platform.select({
        android: 'android',
        ios: 'apple-ios',
        macos: 'desktop-mac',
        windows: 'microsoft-windows',
        web: 'web',
        native: 'information',
        default: 'information',
      })}
    />
  );
};

export default PlatformIcon;
