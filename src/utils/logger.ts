import * as FileSystem from 'expo-file-system';
import { InteractionManager } from 'react-native';
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
} from 'react-native-logs';

export const logFilePath = `${FileSystem.documentDirectory}log.txt`;

const transports = [
  fileAsyncTransport,
  consoleTransport,
];

export const log = logger.createLogger({
  transport: transports
    .filter((t) => {
      if (__DEV__) {
        return t !== consoleTransport;
      }
      return true;
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
  },
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
});

export const rootLog = log.extend('root');
export const playerLog = log.extend('player');
export const s2tLog = log.extend('speech2text');
