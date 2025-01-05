import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { Appbar, Banner, Button, Icon, useTheme } from "react-native-paper";
import Reanimated, { LinearTransition } from 'react-native-reanimated';

import LottieAnimation from "@/src/components/LottieAnimation";
import SubtitleItem from "@/src/components/subtitles/item";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { selectSubtitles, type Subtitle } from "@/src/redux/slices/subtitles";
import { setVideoSource } from '@/src/redux/slices/videoSource';
import { selectVolumeFactor } from '@/src/redux/slices/volumeFactor';
import handleInputVideo from '@/src/utils/handleInputVideo';

export default function Subtitles() {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const volumeFactor = useAppSelector(selectVolumeFactor);
  const subtitles = useAppSelector(selectSubtitles);

  const { inform } = useLocalSearchParams();
  const [bannerVisible, setBannerVisible] = useState(
    (subtitles.length > 1) && inform === '1'
  );

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<Subtitle>) => (
    <SubtitleItem item={item} />
  ), []);

  const selectFile = useCallback(async () => {
    const pickRes = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: false,
    });

    if (!pickRes.canceled) {
      console.debug(pickRes.assets[0]);
      ToastAndroid.showWithGravity(
        'Processing video file...',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );

      await handleInputVideo(
        pickRes.assets[0].uri,
        volumeFactor,
        (dest) => {
          dispatch(setVideoSource(dest));
        }
      );
    }
  }, [dispatch, volumeFactor]);

  return (
    <View style={styles.root}>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
      />
      <Appbar.Header
        statusBarHeight={0}
        elevated
      >
        <Appbar.Content title="Subtitles" />
        <Appbar.Action icon="drag" />
      </Appbar.Header>
      <Banner
        visible={bannerVisible}
        icon={(props) => (
          <Icon
            {...props}
            source="information-outline"
            color={appTheme.colors.secondary}
          />
        )}
        actions={[{
          label: 'OK',
          onPress: () => setBannerVisible(false),
        }]}
      >
        Remove history subtitles can delete cached files related to them
      </Banner>

      <Reanimated.FlatList
        data={subtitles}
        renderItem={renderItem}
        contentContainerStyle={styles.items}
        overScrollMode="never"
        ListEmptyComponent={
          <LottieAnimation
            animation="teapot"
            caption="No subtitles found"
          />
        }
        itemLayoutAnimation={LinearTransition}
        ListFooterComponent={
          <Button
            icon="file-video"
            mode="contained"
            style={styles.selectBtn}
            onPress={selectFile}
          >
            Select Video File
          </Button>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  items: {
    flexGrow: 1,
    marginHorizontal: 10,
    marginTop: 5,
  },
  selectBtn: {
    marginTop: 10,
    marginBottom: 25,
  }
})
