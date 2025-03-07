import React from 'react';
import { List, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { selectShowSubtitle, setShowSubtitle } from '@/src/redux/slices/showSubtitle';
import haptics from '@/src/utils/haptics';

const ShowSubtitleSwitchItem = () => {
  const { t } = useTranslation();
  const showSubtitle = useAppSelector(selectShowSubtitle);
  const dispatch = useAppDispatch();

  const toggleSwitch = () => {
    haptics.selection();
    dispatch(setShowSubtitle(!showSubtitle));
  };

  return (
    <List.Item
      title={t('settings.showSubtitle')}
      left={props => <List.Icon {...props} icon="subtitles-outline" />}
      right={() => (
        <Switch
          value={showSubtitle}
          onValueChange={toggleSwitch}
        />
      )}
      onPress={toggleSwitch}
    />
  );
};

export default ShowSubtitleSwitchItem;
