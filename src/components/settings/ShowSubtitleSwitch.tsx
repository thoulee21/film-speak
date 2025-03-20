import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Avatar, List, Switch } from 'react-native-paper';

import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import {
  selectShowSubtitle,
  setShowSubtitle,
} from '@/src/store/slices/showSubtitle';
import haptics from '@/src/utils/haptics';

const ShowSubtitleSwitchItem = () => {
  const { t } = useTranslation();

  const showSubtitle = useAppSelector(selectShowSubtitle);
  const dispatch = useAppDispatch();

  const toggleSwitch = () => {
    haptics.medium();
    dispatch(setShowSubtitle(!showSubtitle));
  };

  return (
    <List.Item
      title={t('settings.showSubtitle')}
      left={({ style }) => (
        <Avatar.Icon
          style={[style, { backgroundColor: 'blueviolet' }]}
          size={40}
          icon="subtitles"
        />
      )}
      right={({ style }) => (
        <View pointerEvents='none' style={style}>
          <Switch
            style={style}
            value={showSubtitle}
          />
        </View>
      )}
      onPress={toggleSwitch}
    />
  );
};

export default ShowSubtitleSwitchItem;
