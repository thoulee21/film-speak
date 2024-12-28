import { ExternalLink } from '@/components/ExternalLink';
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
  useUpdates,
} from 'expo-updates';
import { useCallback } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { List } from 'react-native-paper';

export default function TestScreen() {
  const { isUpdateAvailable } = useUpdates();

  const renderDocumentIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="file-document" />
  ), []);

  const renderUpdateIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="cloud-download" />
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
    } catch (error) {
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
        <ExternalLink href="https://docs.expo.dev">
          <List.Item
            title="Read the Expo documentation"
            left={renderDocumentIcon}
          />
        </ExternalLink>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
