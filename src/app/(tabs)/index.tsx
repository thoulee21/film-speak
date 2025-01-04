import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as SplashScreen from 'expo-splash-screen';
import {
  FFmpegKit,
  FFmpegKitConfig,
} from 'ffmpeg-kit-react-native';
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import Video from 'react-native-media-console';
import { useTheme } from 'react-native-paper';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ShareMenu, {
  type ShareCallback
} from 'react-native-share-menu';
import { type VideoRef } from 'react-native-video';
import type { Line } from 'srt-parser-2';

import Subtitle from '@/src/components/video/Subtitle';
import {
  useAppDispatch,
  useAppSelector,
} from '@/src/hooks/redux';
import {
  resetVideoSource,
  selectVideoSource,
  setVideoSource,
} from '@/src/redux/slices/videoSource';
import {
  selectVolumeFactor,
} from '@/src/redux/slices/volumeFactor';

export default function VideoScreen() {
  const dispatch = useAppDispatch();
  const player = useRef<VideoRef>(null);
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const volumeFactor = useAppSelector(selectVolumeFactor);
  const source = useAppSelector(selectVideoSource);
  const [clip, setClip] = useState<Line>();

  const handleShare: ShareCallback = useCallback(async (
    item
  ) => {
    console.debug('Shared item:', item);
    if (!item) { return; }

    const shareSource = Array.isArray(item.data) ? item.data[0] : item.data;
    const fileUri = await FFmpegKitConfig.getSafParameterForRead(shareSource);

    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256, shareSource
    );
    const destination = `${FileSystem.cacheDirectory}${hash.slice(0, 6)}.mp4`;

    ToastAndroid.show(`Processing video in background ...`, ToastAndroid.LONG);
    await FFmpegKit.executeAsync(
      `-y -i ${fileUri} -af "volume=${volumeFactor}" -c:v copy -c:a aac ${destination}`,
      () => {
        dispatch(setVideoSource(destination));
      },
    );
  }, [dispatch, volumeFactor]);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    ShareMenu.getInitialShare(handleShare);

    return () => {
      listener.remove();
    };
  }, [handleShare]);

  return (
    <View style={[
      styles.root,
      { paddingTop: insets.top }
    ]}>
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
          onError={({ error }) => {
            ToastAndroid.showWithGravity(
              'Video error: ' + error.errorException,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
            console.error('Video error:', error);

            ToastAndroid.showWithGravity(
              'Resetting video source ...',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
            dispatch(resetVideoSource());
          }}
          onLayout={SplashScreen.hideAsync}
          disableOverlay
          paused
          volume={1 / volumeFactor}
        />
      </View>

      <Subtitle
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
    height: "35%",
  },
});
