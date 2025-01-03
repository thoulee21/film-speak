import * as Updates from 'expo-updates';
import React, {
  useCallback,
  useState
} from 'react';
import {
  Alert,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Button,
  Chip,
  Dialog,
  List,
  Portal,
  useTheme
} from 'react-native-paper';
import RNRestart from 'react-native-restart';

import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/redux/slices/devMode';

const UpdateChecker = () => {
  const appTheme = useTheme();

  const isDev = useAppSelector(selectDevMode);
  const [
    dialogVisible,
    setDialogVisible,
  ] = useState(false);

  const {
    currentlyRunning,
    isUpdatePending,
    isChecking,
    isDownloading,
    lastCheckForUpdateTimeSinceRestart: lastCheck,
    availableUpdate,
  } = Updates.useUpdates();

  const showUpdateDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const showCurrent = useCallback(() => {
    if (isDev) {
      HapticFeedback.trigger(
        HapticFeedbackTypes.effectClick
      );

      if (availableUpdate) {
        Alert.alert(
          'Update available',
          JSON.stringify(
            availableUpdate, null, 2
          )
        );
      } else {
        Alert.alert(
          'Currently running',
          JSON.stringify(
            currentlyRunning, null, 2
          )
        );
      }
    }
  }, [availableUpdate, currentlyRunning, isDev]);

  const fetchUpdateAndRestart = async () => {
    setDialogVisible(false);
    try {
      await Updates.fetchUpdateAsync();
      RNRestart.Restart();
    } catch (err) {
      console.error(err);
      ToastAndroid.show(
        JSON.stringify(err),
        ToastAndroid.LONG
      );
    }
  };

  const checkForUpdate = async () => {
    try {
      const updateCheckRes = await Updates.checkForUpdateAsync();

      if (updateCheckRes.isAvailable) {
        showUpdateDialog();
      } else {
        ToastAndroid.show(
          'No updates available',
          ToastAndroid.SHORT
        );
      }
    } catch (err) {
      console.error(err);
      ToastAndroid.show(
        JSON.stringify(err),
        ToastAndroid.SHORT
      );
    }
  };

  const handleUpdatePress =
    isUpdatePending ? showUpdateDialog : checkForUpdate

  const description = isDownloading
    ? 'Downloading update...'
    : isUpdatePending
      ? 'Update pending...'
      : isChecking
        ? 'Checking for updates...'
        : 'Last check: ' + lastCheck?.toLocaleString() || 'Never checked';

  const renderUpdateIcon = useCallback((props: any) => {
    const updateIcon = isUpdatePending
      ? 'progress-download'
      : 'cloud-download-outline';

    return (
      <List.Icon
        {...props}
        icon={updateIcon}
        color={isUpdatePending
          ? appTheme.colors.primary
          : props.color}
      />
    );
  }, [appTheme.colors.primary, isUpdatePending]);

  const isProcessing = isChecking || isDownloading;
  const renderActivityIndicator = useCallback((props: any) => (
    isProcessing ? <ActivityIndicator {...props} /> : null
  ), [isProcessing]);

  return (
    <>
      <List.Item
        title="Check for updates"
        description={description}
        onPress={handleUpdatePress}
        onLongPress={showCurrent}
        disabled={isProcessing}
        left={renderUpdateIcon}
        right={renderActivityIndicator}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon icon="information" size={40} />
          <Dialog.Title>
            New update available
          </Dialog.Title>

          <Dialog.Content>
            {true && (
              <View style={styles.row}>
                <Chip
                  icon="calendar"
                  compact
                  mode="outlined"
                  style={styles.chip}
                >
                  {/* {availableUpdate.createdAt.toLocaleDateString()} */}
                  date
                </Chip>
                <Chip
                  icon="clock-outline"
                  compact
                  mode="outlined"
                  style={styles.chip}
                >
                  {/* {availableUpdate.createdAt.toLocaleTimeString()} */}
                  time
                </Chip>
              </View>
            )}
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >
              Cancel
            </Button>

            <Button
              onPress={isUpdatePending
                ? () => RNRestart.Restart()
                : fetchUpdateAndRestart}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default UpdateChecker;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  chip: {
    marginRight: 4,
  }
});
