import { useEvent } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import ShareMenu, {
  type ShareCallback,
  type ShareData,
} from 'react-native-share-menu';

export default function VideoScreen() {
  const [sharedItem, setSharedItem] = useState<ShareData>();
  const [videoSource, setVideoSource] = useState(
    'https://media.w3.org/2010/05/sintel/trailer.mp4'
  );

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

  const player = useVideoPlayer(
    !sharedItem
      ? videoSource
      : sharedItem.data as string,
    player => {
      player.loop = true;
      player.showNowPlayingNotification = true;
      player.volume = 1;
    }
  );

  const { isPlaying } = useEvent(
    player,
    'playingChange',
    { isPlaying: player.playing }
  );

  const { status } = useEvent(
    player,
    'statusChange',
    { status: player.status }
  );

  return (
    <View style={styles.contentContainer}>
      <TextInput
        mode='outlined'
        label='Video Source'
        style={styles.input}
        onChangeText={setVideoSource}
        value={videoSource}
        textContentType='URL'
      />
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit='fill'
        requiresLinearPlayback
        onFullscreenEnter={async () => {
          await ScreenOrientation.unlockAsync();
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.ALL
          );
        }}
        onFullscreenExit={async () => {
          await ScreenOrientation.unlockAsync();
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        }}
      />
      <View style={styles.controlsContainer}>
        <Button
          mode='contained'
          icon={isPlaying ? 'pause' : 'play'}
          loading={status === 'loading'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
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
    padding: "2%",
  },
});
