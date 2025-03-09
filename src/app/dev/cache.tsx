import type {
  NativeStackHeaderLeftProps
} from '@react-navigation/native-stack/src/types';
import { Directory, File, Paths } from 'expo-file-system/next';
import { router, Stack, useGlobalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import {
  BackHandler,
  FlatList,
  useWindowDimensions,
  View,
  type ListRenderItemInfo
} from 'react-native';
import {
  Button,
  Caption,
  Divider,
  IconButton,
  List,
  useTheme
} from 'react-native-paper';

import LottieAnimation from '@/src/components/LottieAnimation';
import { formatDataSize } from '@/src/utils/formatDataSize';

type Content = File | Directory;

const ROOT_DIR = Paths.cache.parentDirectory;

export default function CacheScreen() {
  const { height } = useWindowDimensions();
  const appTheme = useTheme();

  const { path: rawPath } = useGlobalSearchParams<{ path?: string }>();
  const path = new Directory(rawPath || Paths.cache);

  // 处理 Android 返回键
  useEffect(() => {
    const backAction = () => {
      if (path.uri !== ROOT_DIR.uri) {
        router.push({
          pathname: '/dev/cache',
          params: { path: path.parentDirectory.uri }
        });
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [path.parentDirectory.uri, path.uri]);

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
      onPress={() => {
        if (item instanceof Directory) {
          router.push({
            pathname: '/dev/cache',
            params: { path: item.uri }
          });
        }
      }}
    />
  ), []);

  const renderBackButton = useCallback(({
    canGoBack, label, tintColor
  }: NativeStackHeaderLeftProps) => {
    const isRootDir = path.uri === ROOT_DIR.uri;
    return (
      <Button
        icon="arrow-left"
        textColor={isRootDir ? tintColor : undefined}
        onPress={() => {
          if (isRootDir) {
            canGoBack && router.back();
          } else {
            router.push({
              pathname: '/dev/cache',
              params: { path: path.parentDirectory.uri }
            })
          }
        }}
      >
        {isRootDir ? label : path.parentDirectory.name}
      </Button>
    )
  }, [path.parentDirectory.name, path.parentDirectory.uri, path.uri]);

  const renderHomeButton = useCallback(() => {
    return (
      <IconButton
        icon="home-outline"
        disabled={path.uri === ROOT_DIR.uri}
        onPress={() => {
          router.dismissAll();
        }}
      />
    )
  }, [path.uri]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: path.name,
          headerLeft: renderBackButton,
          headerRight: renderHomeButton
        }}
      />

      <FlatList
        data={path.list().sort(sortContent)}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListHeaderComponent={() =>
          <Caption>
            {path.uri}
          </Caption>
        }
        ListHeaderComponentStyle={{
          paddingHorizontal: 16,
          backgroundColor: appTheme.colors.background
        }}
        stickyHeaderHiddenOnScroll={false}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <LottieAnimation
            animation="teapot"
            style={{ height: height - 100 }}
            caption="No files or directories"
          >
            <View style={{ alignItems: 'center' }}>
              {renderBackButton({
                canGoBack: false,
                label: 'Go Back',
                tintColor: appTheme.colors.tertiary
              })}
            </View>
          </LottieAnimation>
        }
      />
    </>
  )
};