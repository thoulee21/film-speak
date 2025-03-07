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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const devModeEnabled = useAppSelector(selectDevMode);
  const [hitCount, setHitCount] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const versionText = useMemo(() => (
    `${upperFirst(Platform.OS)} v${version}`
  ), []);

  const hideSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  const showSnackbar = useCallback(() => {
    setSnackbarVisible(true);
  }, []);

  // 点击5次后开启开发者模式
  const handleDevMode = useCallback(() => {
    if (!devModeEnabled) {
      setHitCount(hitCount + 1);
      if (hitCount >= 5) {
        dispatch(setDevMode(true));
        haptics.heavy();
        showSnackbar();
      }
    }
  }, [devModeEnabled, dispatch, hitCount, showSnackbar]);

  const renderPlatformIcon = useCallback((props: ListLRProps) => (
    <PlatformIcon {...props} />
  ), []);

  return (
    <>
      <List.Item
        title={t('about.version')}
        description={versionText}
        left={renderPlatformIcon}
        onPress={handleDevMode}
      />

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={hideSnackbar}
          action={{
            label: 'Dev',
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
