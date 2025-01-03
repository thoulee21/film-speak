import { Link } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';

import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/redux/slices/devMode';
import type ListLRProps from '@/src/types/paperListItem';

export default function Setting() {
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
    <View style={styles.container}>
      <List.Section>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
