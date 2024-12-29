import Subtitle, { SUBTITLE } from '@/src/components/Subtitle';
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
import { TextInput } from 'react-native-paper';
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
import type { Line } from 'srt-parser-2';

const VIDEO_SOURCE = 'https://media.w3.org/2010/05/sintel/trailer.mp4';

export default function VideoScreen() {
  const player = useRef<VideoRef>(null);

  const [sharedItem, setSharedItem] = useState<ShareData>();
  const [videoSource, setVideoSource] = useState(VIDEO_SOURCE);
  const [clip, setClip] = useState<Line>();

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
  }, [handleShare]);

  const source = useMemo(
    () => (
      sharedItem ? sharedItem.data : videoSource
    ) as string,
    [sharedItem, videoSource]
  );

  return (
    <View style={styles.contentContainer}>
      <TextInput
        label='Video Source'
        onChangeText={setVideoSource}
        value={videoSource}
        textContentType='URL'
        selectTextOnFocus
        placeholder='Enter video source URL'
        underlineStyle={{ display: 'none' }}
      />

      <Video
        ref={player}
        source={{
          uri: source,
          textTracks: [{
            title: 'test',
            language: 'en' as ISO639_1,
            type: TextTrackType.VTT,
            uri: SUBTITLE,
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
          fontSize: 15,
          paddingBottom: 50,
          subtitlesFollowVideo: true,
          opacity: 0.8,
        }}
        showNotificationControls
        fullscreenOrientation='landscape'
        fullscreenAutorotate
        style={styles.video}
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
        // onPlaybackStateChanged={({
        //   isPlaying
        // }) => {
        //   setIsPlaying(isPlaying);
        // }}
        controls
        controlsStyles={{
          hideSettingButton: false,
        }}
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
  contentContainer: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: 220,
  },
});
