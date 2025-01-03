import { Directory, File, Paths } from 'expo-file-system/next';
import { useCallback } from 'react';
import { FlatList, type ListRenderItemInfo } from 'react-native';
import { Caption, Divider, List } from 'react-native-paper';

import { formatDataSize } from '@/src/utils/formatDataSize';

type Content = File | Directory;

export default function CacheScreen() {
  // 排序内容。文件夹在前，文件在后，按名称排序
  const sortContent = useCallback((
    a: Content, b: Content
  ) => {
    if (a instanceof Directory && b instanceof File) {
      return -1;
    }

    if (a instanceof File && b instanceof Directory) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  }, []);

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<Content>) => (
    <List.Item
      title={item.name}
      titleNumberOfLines={3}
      description={item instanceof File && item.type}
      left={(props) =>
        item instanceof File ? (
          <List.Icon
            {...props}
            icon={
              item.type?.includes('audio')
                ? 'file-music-outline' : 'file-document-outline'
            }
          />
        ) : (
          <List.Icon {...props} icon="folder-outline" />
        )
      }
      right={(props) =>
        item instanceof File && (
          <Caption {...props}>
            {formatDataSize(item.size || 0)}
          </Caption>
        )
      }
    />
  ), []);

  return (
    <FlatList
      data={Paths.cache.list().sort(sortContent)}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
    />
  )
};