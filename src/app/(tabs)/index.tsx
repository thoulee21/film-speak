import { Link, useNavigation } from 'expo-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import Video from 'react-native-media-console';
import {
  Button,
  IconButton,
  useTheme
} from 'react-native-paper';
import ShareMenu, {
  type ShareCallback,
  type ShareData,
} from 'react-native-share-menu';
import { type VideoRef } from 'react-native-video';
import type { Line } from 'srt-parser-2';

import Subtitle from '@/src/components/Subtitle';

const VIDEO_SOURCE = 'https://media.w3.org/2010/05/sintel/trailer.mp4';

export default function VideoScreen() {
  const navigation = useNavigation();
  const player = useRef<VideoRef>(null);
  const appTheme = useTheme();

  const [sharedItem, setSharedItem] = useState<ShareData>();
  const [clip, setClip] = useState<Line>();
  const [generateSubtitle, setGenerateSubtitle] = useState(false);

  const toggleGenerateSubtitle = useCallback(() => {
    setGenerateSubtitle(prev => !prev);
  }, []);

  const source = useMemo(() => (
    sharedItem
      ? Array.isArray(sharedItem.data)
        ? sharedItem.data[0]
        : sharedItem.data
      : VIDEO_SOURCE
  ), [sharedItem]);

  const renderHeaderRight = useCallback(({
    tintColor, style
  }: {
    tintColor: string,
    style: StyleProp<ViewStyle>
  }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Link href="/history" asChild>
          <IconButton
            icon="history"
            style={style}
            iconColor={tintColor}
          />
        </Link>

        <IconButton
          icon={generateSubtitle ? 'subtitles' : 'subtitles-outline'}
          selected={generateSubtitle}
          style={style}
          onPress={() => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
            toggleGenerateSubtitle();
          }}
        />
      </View>
    );
  }, [generateSubtitle, toggleGenerateSubtitle]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [generateSubtitle, navigation, renderHeaderRight, source])

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
        />
      </View>

      {generateSubtitle ? (
        <Subtitle
          videoFileUri={source}
          onItemPress={(item) => {
            setClip(item);
            player.current?.resume();
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Button icon='subtitles'>
            Subtitle will be generated here
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  videoContainer: {
    width: "100%",
    height: 260,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
