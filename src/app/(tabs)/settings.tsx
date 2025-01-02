import { Link } from 'expo-router';
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
  useUpdates,
} from 'expo-updates';
import { useCallback } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { List } from 'react-native-paper';

import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/redux/slices/devMode';
import type ListLRProps from '@/src/types/paperListItem';

export default function Setting() {
  const devModeEnabled = useAppSelector(selectDevMode);
  const { isUpdateAvailable } = useUpdates();

  const renderUpdateIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="cloud-download-outline" />
  ), []);

  const renderDevIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="code-tags" />
  ), []);

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderAppIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="information-outline" />
  ), []);

  const renderCacheIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="folder-outline" />
  ), []);

  const checkForUpdate = useCallback(async () => {
    try {
      const update = await checkForUpdateAsync();
      if (update.isAvailable) {
        await fetchUpdateAsync();
        ToastAndroid.show(
          'Update downloaded',
          ToastAndroid.SHORT
        );
        await reloadAsync();
      } else {
        ToastAndroid.show(
          'No update available',
          ToastAndroid.SHORT
        );
      }
    } catch {
      ToastAndroid.show(
        'An error occurred while checking for updates',
        ToastAndroid.SHORT
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Item
          title="Check for updates"
          description={isUpdateAvailable ? 'Update available' : 'No update available'}
          left={renderUpdateIcon}
          onPress={checkForUpdate}
        />

        <Link href="/cache" asChild>
          <List.Item
            title="Cache"
            description="View cached files"
            left={renderCacheIcon}
            right={renderRightIcon}
          />
        </Link>

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
