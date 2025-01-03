import * as SplashScreen from 'expo-splash-screen';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-media-console';
import { useTheme } from 'react-native-paper';
import ShareMenu, {
  type ShareCallback,
  type ShareData,
} from 'react-native-share-menu';
import { type VideoRef } from 'react-native-video';
import type { Line } from 'srt-parser-2';

import Subtitle from '@/src/components/video/Subtitle';
import VIDEO_SOURCE from '@/src/constants/video-source';

export default function VideoScreen() {
  const player = useRef<VideoRef>(null);
  const appTheme = useTheme();

  const [sharedItem, setSharedItem] = useState<ShareData>();
  const [clip, setClip] = useState<Line>();

  const source = useMemo(() => (
    sharedItem
      ? Array.isArray(sharedItem.data)
        ? sharedItem.data[0]
        : sharedItem.data
      : VIDEO_SOURCE
  ), [sharedItem]);

  const handleShare: ShareCallback = useCallback(async (
    item
  ) => {
    if (!item) { return; }

    setSharedItem(item);
    console.debug('Shared item:', item);
  }, []);

  useEffect(() => {
    const shareListener = ShareMenu.addNewShareListener(handleShare);
    ShareMenu.getInitialShare(handleShare);

    return () => {
      shareListener.remove();
    };
  }, [handleShare]);

  return (
    <View style={styles.root}>
      <View style={styles.videoContainer}>
        <Video
          videoRef={player}
          source={{ uri: source }}
          seekColor={appTheme.colors.secondary}
          shutterColor={appTheme.colors.secondaryContainer}
          showNotificationControls
          automaticallyWaitsToMinimizeStalling
          onLoad={() => { player.current?.pause(); }}
          onProgress={({
            currentTime
          }) => {
            if (!clip) { return; }

            //在片段的开始和结束之间循环播放
            if (
              currentTime >= clip.startSeconds &&
              currentTime <= clip.endSeconds
            ) { return; }

            player.current?.seek(clip.startSeconds);
          }}
          showDuration
          showTimeRemaining
          disableBack
          disableFullscreen
          // fullscreenOrientation='landscape'
          // fullscreenAutorotate
          // isFullscreen={fullscreen}
          // onEnterFullscreen={async () => {
          //   setFullscreen(true);
          //   navigation.setOptions({ headerShown: false })

          //   await ScreenOrientation.lockAsync(
          //     OrientationLock.LANDSCAPE_RIGHT
          //   );
          // }}
          // onExitFullscreen={async () => {
          //   await ScreenOrientation.lockAsync(
          //     OrientationLock.PORTRAIT_UP
          //   );

          //   setFullscreen(false);
          //   navigation.setOptions({ headerShown: true });
          // }}
          onError={(error) => {
            console.error('Video error:', error);
          }}
          onLayout={SplashScreen.hideAsync}
        />
      </View>

      <Subtitle
        videoFileUri={source}
        onItemPress={(item) => {
          setClip(item);
          player.current?.resume();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  videoContainer: {
    width: "100%",
    height: 245,
  },
});
