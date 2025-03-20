import React from 'react';
import { Platform } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';

import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/store/slices/devMode';
import ListLRProps from '@/src/types/paperListItem';

const PlatformIcon = ({ style }: ListLRProps) => {
  const appTheme = useTheme();
  const devModeEnabled = useAppSelector(selectDevMode);

  return (
    <Avatar.Icon
      style={[style, {
        backgroundColor: 'tomato',
        borderRadius: devModeEnabled
          ? appTheme.roundness : 80,
      }]}
      color='white'
      size={40}
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
