import { Link } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, IconButton, List } from 'react-native-paper';

import TestSourceItem from '@/src/components/settings/TestSourceItem';
import CacheItem from '@/src/components/settings/CacheItem';
import ShowSubtitleSwitchItem from '@/src/components/settings/ShowSubtitleSwitch';
import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/store/slices/devMode';
import type ListLRProps from '@/src/types/paperListItem';

export default function Setting() {
  const { t } = useTranslation();
  const devModeEnabled = useAppSelector(selectDevMode);

  const renderRightIcon = useCallback(({ color, style }: ListLRProps) => (
    <IconButton
      icon="chevron-right"
      iconColor={color}
      style={style}
    />
  ), []);

  const renderDevIcon = useCallback(({ color, style }: ListLRProps) => (
    <List.Icon color={color} style={style} icon="developer-board" />
  ), []);

  const renderAppIcon = useCallback(({ color, style }: ListLRProps) => (
    <List.Icon color={color} style={style} icon="information-outline" />
  ), []);

  const renderVideoEnhanceIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="video-plus-outline" />
  ), []);

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <ShowSubtitleSwitchItem />

        <Link href="/lang" asChild>
          <List.Item
            title={t('settings.languageSelect')}
            left={({ color, style }) => (
              <List.Icon color={color} style={style} icon="translate" />
            )}
            right={renderRightIcon}
          />
        </Link>
      </List.Section>
      <Divider />

      <List.Section>
        <Link href="/videoEnhance" asChild>
          <List.Item
            title={t('videoEnhance.title')}
            description={t('videoEnhance.description')}
            left={renderVideoEnhanceIcon}
            right={renderRightIcon}
          />
        </Link>

        <TestSourceItem />
        <CacheItem />
      </List.Section>
      <Divider />

      <List.Section>
        {devModeEnabled && (
          <Link href="/dev" asChild>
            <List.Item
              title={t('navigation.devOptions')}
              description={t('settings.enableDev')}
              left={renderDevIcon}
              right={renderRightIcon}
            />
          </Link>
        )}

        <Link href="/about" asChild>
          <List.Item
            title={t('navigation.about')}
            description={t('settings.learnMore')}
            left={renderAppIcon}
            right={renderRightIcon}
          />
        </Link>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
