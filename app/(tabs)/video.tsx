import { useEvent } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function VideoScreen() {
  const [videoSource, setVideoSource] = useState(
    'https://media.w3.org/2010/05/sintel/trailer.mp4'
  );

  const player = useVideoPlayer(
    videoSource,
    player => {
      player.loop = false;
      player.showNowPlayingNotification = true;
      player.play();
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
        startsPictureInPictureAutomatically
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
