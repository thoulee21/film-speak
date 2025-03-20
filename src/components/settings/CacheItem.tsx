import * as FileSystem from 'expo-file-system';
import { File } from "expo-file-system/next";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Avatar, List } from "react-native-paper";

import { formatDataSize } from "@/src/utils/formatDataSize";
import haptics from '@/src/utils/haptics';

export default function CacheItem() {
  const [cacheSize, setCacheSize] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
      setIsLoaded(false);

      const size = await getCacheSize();
      setCacheSize(size);
    };

    if (!isLoaded) {
      fetchCacheSize().then(() => {
        setIsLoaded(true);
      });
    }
  }, [getCacheSize, isLoaded]);

  return (
    <List.Item
      title='媒体缓存'
      description={formatDataSize(cacheSize)}
      left={({ style }) => (
        isLoaded ? (
          <Avatar.Icon
            style={[style, { backgroundColor: 'hotpink' }]}
            size={40}
            color='white'
            icon='cached'
          />
        ) : (
          <ActivityIndicator
            style={style}
            size={40}
            color='hotpink'
          />
        )
      )}
      onPress={() => {
        setIsLoaded(false);
        haptics.light();
      }}
    />
  );
}