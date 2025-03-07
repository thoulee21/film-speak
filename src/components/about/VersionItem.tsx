import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { List, Portal, Snackbar } from 'react-native-paper';

import { version } from '@/package.json';
import PlatformIcon from '@/src/components/about/PlatformIcon';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { selectDevMode, setDevMode } from '@/src/store/slices/devMode';
import ListLRProps from '@/src/types/paperListItem';
import haptics from '@/src/utils/haptics';
import upperFirst from '@/src/utils/upperFirst';

const VersionItem = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const devModeEnabled = useAppSelector(selectDevMode);
  const setHitCount = useState(0)[1];
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const versionText = useMemo(() => (
    `${upperFirst(Platform.OS)} v${version}`
  ), []);

  const hideSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  const renderVersionIcon = useCallback(({ color, style }: ListLRProps) => (
    <PlatformIcon color={color} style={style} />
  ), []);

  const onVersionPress = useCallback(() => {
    setHitCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 7) {
        haptics.success();
        dispatch(setDevMode(true));
        setSnackbarVisible(true);
        return 0;
      }

      if (newCount >= 3) {
        haptics.light();
      }

      return newCount;
    });
  }, [dispatch, setHitCount]);

  return (
    <>
      <List.Item
        title={t('about.version')}
        description={versionText}
        descriptionNumberOfLines={1}
        left={renderVersionIcon}
        onPress={onVersionPress}
      />

      <Portal>
        <Snackbar
          visible={snackbarVisible && devModeEnabled}
          onDismiss={hideSnackbar}
          action={{
            label: t('common.ok'),
            onPress: () => router.push('/dev')
          }}
        >
          {t('settings.developMode')}
        </Snackbar>
      </Portal>
    </>
  );
};

export default VersionItem;
