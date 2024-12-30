import React, { useCallback } from 'react';
import { View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List, Switch } from 'react-native-paper';

import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { selectDevMode, toggleDevMode } from '@/src/redux/slices/devMode';
import ListLRProps from '@/src/types/paperListItem';

const DevSwitchItem = () => {
  const dispatch = useAppDispatch();
  const isDev = useAppSelector(selectDevMode);

  const renderDevIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="code-tags" />
  ), []);

  const renderSwitch = useCallback((props: ListLRProps) => (
    <View pointerEvents="none" {...props}>
      <Switch value={isDev} />
    </View>
  ), [isDev]);

  const onPressSwitch = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
    dispatch(toggleDevMode());
  }, [dispatch]);

  return (
    <List.Item
      title="Developer Mode"
      description="Enable to access additional features"
      left={renderDevIcon}
      right={renderSwitch}
      onPress={onPressSwitch}
    />
  );
};

export default DevSwitchItem;
