import Clipboard from '@react-native-clipboard/clipboard';
import * as FileSystem from 'expo-file-system';
import { Stack } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Caption,
  Dialog,
  FAB,
  IconButton,
  Portal,
  Text,
  useTheme
} from 'react-native-paper';
import { v7 as uuid } from 'uuid';

import packageData from '@/package.json';
import haptics from '@/src/utils/haptics';
import { logFilePath, rootLog } from '@/src/utils/logger';

const LogLine = ({ item }: { item: string }) => {
  const { t } = useTranslation();

  const copyToClipboard = useCallback(() => {
    haptics.heavy();
    Clipboard.setString(item);

    ToastAndroid.showWithGravity(
      t('action.copied'),
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  }, [item, t]);

  return (
    <TouchableOpacity
      onLongPress={copyToClipboard}
    >
      <Caption>
        {item}
      </Caption>
    </TouchableOpacity>
  )
};

const Logcat = () => {
  const logsRef = useRef<FlatList>(null);
  const appTheme = useTheme();
  const { t } = useTranslation();

  const [isLoaded, setIsLoaded] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [keyword, setKeyword] = useState('');

  const saveLogs = useCallback(async () => {
    const savePath = `${FileSystem.documentDirectory
      }/${packageData.name}_${uuid().slice(0, 8)}.log`;

    await FileSystem.writeAsStringAsync(
      savePath, logContent
    );
    ToastAndroid.showWithGravity(
      `Logs saved successfully to ${savePath}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  }, [logContent]);

  const renderHeaderRight = useCallback(() => (
    <View style={{ flexDirection: 'row' }}>
      <IconButton
        icon="content-save-outline"
        disabled={!logContent}
        onPress={saveLogs}
      />

      <IconButton
        icon="delete-forever-outline"
        iconColor={appTheme.colors.error}
        disabled={!logContent}
        onPress={() => {
          haptics.warning();
          setDialogVisible(true);
        }}
      />
    </View>
  ), [appTheme.colors.error, logContent, saveLogs]);

  useEffect(() => {
    try {
      const readLog = async () => {
        const log = await FileSystem.readAsStringAsync(
          logFilePath, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        setLogContent(log);
      };

      if (!isLoaded) {
        readLog().then(() => {
          setIsLoaded(true);
        });
      }
    } catch (e) {
      rootLog.error(e);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  const clearLogs = async () => {
    await FileSystem.writeAsStringAsync(logFilePath, '');
    setIsLoaded(false);
  }

  const renderItem = useCallback(({ item }: { item: string }) => (
    <LogLine item={item} />
  ), []);

  const renderEmpty = () => (
    <Text style={styles.loading}>
      {t('common.loading')}
    </Text>
  );

  const filteredLogLines = useMemo(() => {
    if (!keyword) {
      return logContent.split('\n');
    }

    return (
      logContent
        .split('\n')
        .filter((line) => (
          line
            .toLowerCase()
            .includes(keyword.toLowerCase())
        ))
    );
  }, [keyword, logContent]);

  return (
    <Portal.Host>
      <Stack.Screen options={{
        headerRight: renderHeaderRight,
        headerSearchBarOptions: {
          placeholder: 'Search log',
          onChangeText(e) {
            const text = e.nativeEvent.text;
            setKeyword(text);
          },
          onClose: () => {
            setKeyword('');
          },
        }
      }} />

      <FlatList
        ref={logsRef}
        data={filteredLogLines}
        style={styles.root}
        contentContainerStyle={styles.content}
        renderItem={renderItem}
        onRefresh={() => { setIsLoaded(false); }}
        refreshing={!isLoaded}
        initialNumToRender={33}
        refreshControl={
          <RefreshControl
            refreshing={!isLoaded}
            onRefresh={() => { setIsLoaded(false); }}
            colors={[appTheme.colors.primary]}
            progressBackgroundColor={appTheme.colors.elevation.level2}
          />
        }
        ListEmptyComponent={renderEmpty}
        indicatorStyle={appTheme.dark ? 'white' : 'black'}
        persistentScrollbar
      />

      <Portal>
        <FAB
          icon="arrow-down"
          variant="surface"
          style={styles.fab}
          onPress={() => {
            if (logsRef.current) {
              haptics.light();
              logsRef.current.scrollToEnd();
            }
          }}
        />
      </Portal>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon
            icon="alert"
            color={appTheme.colors.error}
            size={40}
          />
          <Dialog.Title>{t('dev.clearLogs')}</Dialog.Title>
          <Dialog.Content>
            <Text>
              {t('error.clearLogsConfirm')}
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              textColor={appTheme.colors.error}
              onPress={() => {
                clearLogs();
                setDialogVisible(false);
              }}
            >
              {t('common.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Portal.Host>
  );
};

export default Logcat;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: '4%',
  },
  loading: {
    marginTop: '50%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
});
