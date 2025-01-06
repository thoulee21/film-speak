import * as Sentry from '@sentry/react-native';
import * as FileSystem from 'expo-file-system';
import { InteractionManager } from 'react-native';
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
  sentryTransport,
} from 'react-native-logs';

export const logFilePath = `${FileSystem.documentDirectory}log`;

const transports = [
  fileAsyncTransport,
  sentryTransport,
  consoleTransport,
];

export const log = logger.createLogger({
  transport: transports
    .filter((t) => {
      if (__DEV__) {
        return t !== sentryTransport;
      } else {
        return t !== consoleTransport;
      }
    }),
  transportOptions: {
    FS: {
      documentDirectory: FileSystem.documentDirectory,
      DocumentDirectoryPath: FileSystem.documentDirectory as never,
      writeAsStringAsync: FileSystem.writeAsStringAsync,
      readAsStringAsync: FileSystem.readAsStringAsync,
      getInfoAsync: FileSystem.getInfoAsync,
      appendFile: undefined,
    },
    SENTRY: {
      ...Sentry,
      addBreadcrumb: Sentry.addBreadcrumb as never,
    },
    // to avoid too many sentry logs
    errorLevels: 'error',
  },
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
});

export const rootLog = log.extend('root');
export const playerLog = log.extend('player');
