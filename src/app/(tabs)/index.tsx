import * as FileSystem from 'expo-file-system';
import { useNavigation } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { OrientationLock } from 'expo-screen-orientation';
import {
  FFmpegKit,
  FFmpegKitConfig,
  type FFmpegSessionCompleteCallback,
} from 'ffmpeg-kit-react-native';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-media-console';
import {
  Button,
  IconButton,
  TextInput,
  useTheme,
} from 'react-native-paper';
import ShareMenu, {
  type ShareCallback,
  type ShareData,
} from 'react-native-share-menu';
import { type VideoRef } from 'react-native-video';
import type { Line } from 'srt-parser-2';

import Subtitle from '@/src/components/Subtitle';

const VIDEO_SOURCE = 'https://media.w3.org/2010/05/sintel/trailer.mp4';
const AUDIO_URI = `${FileSystem.cacheDirectory}audio.wav`;

const extractAudioFromVideo = async (
  videoUri: string,
  onComplete: FFmpegSessionCompleteCallback
) => {
  // 如果 videoUri 是 content:// URI，则将其转换为 file:// URI
  if (videoUri.startsWith('content://')) {
    const safUri = await FFmpegKitConfig.getSafParameterForRead(videoUri);
    videoUri = safUri;

    console.debug('Selected video URI:', videoUri);
  }

  await FFmpegKit.executeAsync(
    `-i ${videoUri} -vn -c:a pcm_s16le -ar 16000 -ac 1 ${AUDIO_URI}`,
    onComplete,
  );
};

export default function VideoScreen() {
  const navigation = useNavigation();
  const player = useRef<VideoRef>(null);
  const appTheme = useTheme();

  const [sharedItem, setSharedItem] = useState<ShareData>();
  const [clip, setClip] = useState<Line>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [generateSubtitle, setGenerateSubtitle] = useState(false);

  const [videoSource, setVideoSource] = useState(VIDEO_SOURCE);
  const [audioFileUri, setAudioFileUri] = useState<string>();

  const source = useMemo(() => (
    sharedItem
      ? Array.isArray(sharedItem.data)
        ? sharedItem.data[0]
        : sharedItem.data
      : videoSource
  ), [sharedItem, videoSource]);

  const renderHeaderRight = useCallback(() => {
    const toggleGenerateSubtitle = () => {
      setGenerateSubtitle(prev => {
        const newValue = !prev;

        if (newValue === true) {
          extractAudioFromVideo(
            source,
            () => {
              setAudioFileUri(AUDIO_URI);
            }
          );
        }

        return newValue;
      });
    };

    return (
      <IconButton
        icon={generateSubtitle ? 'subtitles' : 'subtitles-outline'}
        selected={generateSubtitle}
        onPress={toggleGenerateSubtitle}
      />
    );
  }, [generateSubtitle, source]);

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
      <TextInput
        label='Video Source'
        onChangeText={setVideoSource}
        value={videoSource}
        textContentType='URL'
        selectTextOnFocus
        placeholder='Enter video source URL'
        underlineStyle={{ display: 'none' }}
        dense
      />

      <View style={styles.video}>
        <Video
          videoRef={player}
          source={{ uri: source }}
          seekColor={appTheme.colors.secondary}
          shutterColor={appTheme.colors.secondaryContainer}
          showNotificationControls
          fullscreenOrientation='landscape'
          fullscreenAutorotate
          automaticallyWaitsToMinimizeStalling
          // onLoad={() => { player.current?.pause(); }}
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
          isFullscreen={isFullscreen}
          onEnterFullscreen={async () => {
            setIsFullscreen(true);
            navigation.setOptions({ headerShown: false })
            await ScreenOrientation.lockAsync(
              OrientationLock.LANDSCAPE_RIGHT
            );
          }}
          onExitFullscreen={async () => {
            await ScreenOrientation.lockAsync(
              OrientationLock.PORTRAIT_UP
            );
            setIsFullscreen(false);
            navigation.setOptions({ headerShown: true });
          }}
          onError={(error) => {
            console.error('Video error:', error);
          }}
        />
      </View>

      {audioFileUri ? (
        <Subtitle
          fileUri={audioFileUri}
          onItemPress={(item) => {
            setClip(item);
            player.current?.resume();
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Button
            icon='subtitles'
            loading={generateSubtitle}
          >
            {!generateSubtitle
              ? "Subtitle will be generated here"
              : "Extracting audio from video..."}
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
  video: {
    width: "100%",
    height: 220,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
