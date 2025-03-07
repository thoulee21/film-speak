import { Link, router } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, IconButton, List, useTheme } from 'react-native-paper';

import ShowSubtitleSwitchItem from '@/src/components/settings/ShowSubtitleSwitch';
import VolumeSlider from '@/src/components/settings/VolumeSlider';
import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/redux/slices/devMode';
import type ListLRProps from '@/src/types/paperListItem';

export default function Setting() {
  const { t } = useTranslation();
  const appTheme = useTheme();
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
        <List.Subheader
          style={{ color: appTheme.colors.primary }}
        >
          {t('navigation.settings')}
        </List.Subheader>

        <ShowSubtitleSwitchItem />
        <VolumeSlider />
        <Divider />

        <Link href="/lang" asChild>
          <List.Item
            title={t('settings.languageSelect')}
            left={({ color, style }) => (
              <List.Icon color={color} style={style} icon="translate" />
            )}
            right={renderRightIcon}
          />
        </Link>
        <Link href="/videoEnhance" asChild>
          <List.Item
            title="Video Enhancement"
            description="Adjust video enhancement factors"
            left={renderVideoEnhanceIcon}
            right={renderRightIcon}
          />
        </Link>
        <List.Item
          title={t('navigation.subtitles')}
          left={({ color, style }) => (
            <List.Icon color={color} style={style} icon="subtitles-outline" />
          )}
          right={renderRightIcon}
          onPress={() => {
            router.push('/subtitles?inform=1');
          }}
        />

        <Divider />
      </List.Section>

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
