import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, type ListRenderItemInfo } from 'react-native';
import { Divider, List } from 'react-native-paper';

import type ListLRProps from '@/src/types/paperListItem';

export default function CacheScreen() {
  const [cacheItems, setCacheItems] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (FileSystem.cacheDirectory) {
        const files = await FileSystem.readDirectoryAsync(
          FileSystem.cacheDirectory
        );
        //按字母顺序排序，先小写后大写
        setCacheItems(files.sort(
          (a, b) => a.localeCompare(b)
        ));
      }
    })();
  }, []);

  const renderIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="file-document-outline" />
  ), []);

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<string>) => (
    <List.Item
      title={item}
      titleNumberOfLines={2}
      left={renderIcon}
    />
  ), [renderIcon]);

  return (
    <FlatList
      data={cacheItems}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
    />
  )
};