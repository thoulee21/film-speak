import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { OrientationLock } from 'expo-screen-orientation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import ShareMenu, {
  type ShareCallback,
  type ShareData,
} from 'react-native-share-menu';
import Video, {
  SelectedTrackType,
  TextTrackType,
  type ISO639_1,
  type VideoRef,
} from 'react-native-video';

const VIDEO_SOURCE = 'https://media.w3.org/2010/05/sintel/trailer.mp4';

export default function VideoScreen() {
  const appTheme = useTheme();
  const player = useRef<VideoRef>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [sharedItem, setSharedItem] = useState<ShareData>();
  const [videoSource, setVideoSource] = useState(VIDEO_SOURCE);

  const handleShare: ShareCallback = useCallback(async (
    item
  ) => {
    if (!item) { return; }

    setSharedItem(item);
  }, []);

  useEffect(() => {
    const shareListener = ShareMenu.addNewShareListener(handleShare);
    ShareMenu.getInitialShare(handleShare);

    return () => {
      shareListener.remove();
    };
  }, []);

  const source = useMemo(() => (
    sharedItem ? sharedItem.data : videoSource
  ) as string, [sharedItem, videoSource]);

  return (
    <View style={styles.contentContainer}>
      <TextInput
        mode='outlined'
        label='Video Source'
        style={styles.input}
        onChangeText={setVideoSource}
        value={videoSource}
        textContentType='URL'
        placeholder='Enter video source URL'
      />
      <Video
        ref={player}
        source={{
          uri: source,
          textTracks: [{
            title: 'test',
            language: 'en' as ISO639_1,
            type: TextTrackType.VTT,
            uri: 'https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt',
          }],
        }}
        selectedTextTrack={{
          type: SelectedTrackType.INDEX,
          value: 0,
        }}
        onTextTrackDataChanged={(
          { subtitleTracks }
        ) => {
          console.debug(
            'onTextTrackDataChanged',
            subtitleTracks
          );
        }}
        subtitleStyle={{
          fontSize: 20,
          paddingBottom: 20,
        }}
        showNotificationControls
        fullscreenOrientation='landscape'
        fullscreenAutorotate
        style={styles.video}
        onLoad={(
          { duration }
        ) => {
          setDuration(duration);
        }}
        onProgress={(
          { currentTime }
        ) => {
          setCurrentTime(currentTime);
        }}
        onPlaybackStateChanged={(
          { isPlaying }
        ) => {
          setIsPlaying(isPlaying);
        }}
        controlsStyles={{
          hideSettingButton: false,
        }}
        controls
        onFullscreenPlayerWillPresent={async () => {
          await ScreenOrientation.lockAsync(
            OrientationLock.LANDSCAPE_RIGHT
          );
        }}
        onFullscreenPlayerWillDismiss={async () => {
          await ScreenOrientation.lockAsync(
            OrientationLock.PORTRAIT_UP
          );
        }}
      />

      <View style={styles.controlsContainer}>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          thumbTintColor={appTheme.colors.primary}
          maximumTrackTintColor={appTheme.colors.onSurfaceDisabled}
          minimumTrackTintColor={appTheme.colors.secondary}
          value={currentTime}
          onSlidingComplete={value => {
            player.current?.seek(value);
          }}
        />
        <Button
          mode='contained'
          icon={isPlaying ? 'pause' : 'play'}
          onPress={() => {
            if (isPlaying) {
              player.current?.pause();
            } else {
              player.current?.resume();
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  input: {
    width: "96%",
    margin: "2%",
  },
  video: {
    width: "100%",
    height: 220,
  },
  controlsContainer: {
    height: 130,
    justifyContent: 'space-around',
    padding: "2%",
  },
});
