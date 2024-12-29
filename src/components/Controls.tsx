import Slider from "@react-native-community/slider";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import type { VideoRef } from "react-native-video";

interface ControlsProps {
  player: React.RefObject<VideoRef>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export default function Controls({
  currentTime, duration, isPlaying, player
}: ControlsProps) {
  const appTheme = useTheme();

  return (
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
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    height: 130,
    justifyContent: 'space-around',
    padding: "2%",
  },
});
