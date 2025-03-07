import * as FileSystem from 'expo-file-system';
import { File } from "expo-file-system/next";
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { IconButton, List } from "react-native-paper";

import { useAppSelector } from '@/src/hooks/redux';
import { selectDevMode } from '@/src/store/slices/devMode';
import type ListLRProps from '@/src/types/paperListItem';
import { formatDataSize } from "@/src/utils/formatDataSize";
import haptics from '@/src/utils/haptics';

export default function CacheItem() {
  const isDev = useAppSelector(selectDevMode);
  const [cacheSize, setCacheSize] = useState(0);

  // 统计Cache文件夹下所有.mp4,.wav,.jpg文件的大小
  const getCacheSize = useCallback(async () => {
    if (FileSystem.cacheDirectory) {
      let size = 0;
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory
      );

      for (const file of files) {
        if (
          file.endsWith('.mp4')
          || file.endsWith('.wav')
          || file.endsWith('.jpg')
        ) {
          const fileInfo = await FileSystem.getInfoAsync(
            FileSystem.cacheDirectory + file
          );
          const f = new File(fileInfo.uri);
          size += (f.size || 0);
        }
      }
      return size;
    }

    return 0;
  }, []);

  useEffect(() => {
    const fetchCacheSize = async () => {
      const size = await getCacheSize();
      setCacheSize(size);
    };

    fetchCacheSize();
  }, [getCacheSize]);

  const renderViewButton = useCallback((props: ListLRProps) => (
    <IconButton
      {...props}
      icon='eye-outline'
      mode='contained'
      onPress={() => {
        haptics.light();
        router.push(!isDev ? '/subtitles' : '/dev/cache');
      }}
    />
  ), [isDev]);

  return (
    <List.Item
      title='媒体缓存'
      description={formatDataSize(cacheSize)}
      left={(props) => (
        <List.Icon {...props} icon='cached' />
      )}
      right={renderViewButton}
    />
  );
}