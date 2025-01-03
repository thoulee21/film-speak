import { Link } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, List, useTheme } from 'react-native-paper';

import ShowSubtitleSwitchItem from '@/src/components/settings/ShowSubtitleSwitch';
import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/redux/slices/devMode';
import type ListLRProps from '@/src/types/paperListItem';

export default function Setting() {
  const appTheme = useTheme();
  const devModeEnabled = useAppSelector(selectDevMode);

  const renderDevIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="code-tags" />
  ), []);

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderAppIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="information-outline" />
  ), []);

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <ShowSubtitleSwitchItem />
        <Divider />
      </List.Section>

      <List.Section
        title="General"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        {devModeEnabled && (
          <Link href="/dev" asChild>
            <List.Item
              title="Developer Options"
              description="Enable to access additional features"
              left={renderDevIcon}
              right={renderRightIcon}
            />
          </Link>
        )}

        <Link href="/about" asChild>
          <List.Item
            title="About"
            description="Learn more about the app"
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
