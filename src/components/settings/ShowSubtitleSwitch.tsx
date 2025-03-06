import React, { useCallback } from 'react';
import { View } from 'react-native';
import { List, Switch } from 'react-native-paper';

import {
  useAppDispatch,
  useAppSelector,
} from '@/src/hooks/redux';
import {
  selectShowSubtitle,
  toggleShowSubtitle,
} from '@/src/redux/slices/showSubtitle';
import ListLRProps from '@/src/types/paperListItem';
import haptics from '@/src/utils/haptics';

const ShowSubtitleSwitchItem = () => {
  const dispatch = useAppDispatch();
  const showSubtitle = useAppSelector(selectShowSubtitle);

  const renderSubtitleIcon = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="subtitles-outline" />
  ), []);

  const renderSwitch = useCallback((props: ListLRProps) => (
    <View pointerEvents="none" {...props}>
      <Switch value={showSubtitle} />
    </View>
  ), [showSubtitle]);

  const onPressSwitch = useCallback(() => {
    haptics.medium();
    dispatch(toggleShowSubtitle());
  }, [dispatch]);

  return (
    <List.Item
      title="Show Subtitle"
      description="Display subtitle when available"
      left={renderSubtitleIcon}
      right={renderSwitch}
      onPress={onPressSwitch}
    />
  );
};

export default ShowSubtitleSwitchItem;
