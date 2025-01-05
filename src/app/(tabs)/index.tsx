import { router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { OrientationLock } from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
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
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { FAB, Portal } from 'react-native-paper';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ShareMenu, {
  type ShareCallback
} from 'react-native-share-menu';
import type { VideoRef } from 'react-native-video';
import VideoPlayer from 'react-native-video';
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
import { selectVolume } from '@/src/redux/slices/volume';
import {
  selectVolumeFactor,
} from '@/src/redux/slices/volumeFactor';
import handleInputVideo from '@/src/utils/handleInputVideo';

export default function VideoScreen() {
  const dispatch = useAppDispatch();
  const playerRef = useRef<VideoRef>(null);
  const insets = useSafeAreaInsets();

  const volume = useAppSelector(selectVolume);
  const volumeFactor = useAppSelector(selectVolumeFactor);
  const source = useAppSelector(selectVideoSource);
  const [clip, setClip] = useState<Line>();

  const handleShare: ShareCallback = useCallback(async (
    item
  ) => {
    console.debug('Shared item:', item);
    if (!item) { return; }

    const shareSource = Array.isArray(item.data) ? item.data[0] : item.data;
    const onComplete = (dest: string) => dispatch(setVideoSource(dest))

    ToastAndroid.show(`Processing video in background ...`, ToastAndroid.LONG);
    await handleInputVideo(shareSource, volumeFactor, onComplete);
  }, [dispatch, volumeFactor]);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    ShareMenu.getInitialShare(handleShare);

    return () => {
      listener.remove();
    };
  }, [handleShare]);

  return (
    <Portal.Host>
      <View style={[
        styles.root,
        { paddingTop: insets.top }
      ]}>
        <VideoPlayer
          ref={playerRef}
          source={{ uri: source }}
          style={{
            height: '35%',
            width: '100%',
            backgroundColor: 'black'
          }}
          showNotificationControls
          onLayout={async () => {
            playerRef.current?.pause();
            await SplashScreen.hideAsync();
          }}
          onProgress={({
            currentTime
          }) => {
            if (!clip) { return; }

            //在片段的开始和结束之间循环播放
            if (
              currentTime >= clip.startSeconds &&
              currentTime <= clip.endSeconds
            ) { return; }

            playerRef.current?.seek(clip.startSeconds);
          }}
          debug={{ enable: __DEV__, thread: __DEV__ }}
          enterPictureInPictureOnLeave
          fullscreenOrientation='landscape'
          fullscreenAutorotate
          onFullscreenPlayerWillPresent={() => {
            ScreenOrientation.lockAsync(
              OrientationLock.LANDSCAPE_RIGHT
            );
          }}
          onFullscreenPlayerWillDismiss={() => {
            ScreenOrientation.lockAsync(
              OrientationLock.PORTRAIT_UP
            );
          }}
          shutterColor="transparent"
          onError={({
            error
          }) => {
            ToastAndroid.showWithGravity(
              'Video error: ' + error.errorException,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
            console.error(
              'Video error:',
              error
            );

            ToastAndroid.showWithGravity(
              'Resetting video source ...',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
            dispatch(resetVideoSource());
          }}
          // if volume is unset(-1), play at original volume
          volume={volume === -1 ? (1 / volumeFactor) : volume}
          controls={!clip}
          controlsStyles={{
            hidePrevious: true,
            hideNext: true,
            hideSettingButton: false
          }}
        />

        <Subtitle
          onItemPress={(item) => {
            setClip(item);
            playerRef.current?.resume();
          }}
        />

        <Portal>
          <FAB
            icon="subtitles-outline"
            style={styles.fab}
            onPress={() => {
              HapticFeedback.trigger(
                HapticFeedbackTypes.effectDoubleClick,
              );
              router.push('/subtitles');
            }}
          />
        </Portal>
      </View>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
});
