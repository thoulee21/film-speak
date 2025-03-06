import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Caption, IconButton, List, Text, useTheme } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { resetVolume, selectVolume, setVolume } from "@/src/redux/slices/volume";
import { selectVolumeFactor } from "@/src/redux/slices/volumeFactor";
import type ListLRProps from "@/src/types/paperListItem";
import haptics from "@/src/utils/haptics";

const MIN = 0;
const MAX = 1;
const STEP = 0.1;

export default function VolumeSlider() {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const volumeFactor = useAppSelector(selectVolumeFactor);
  const volume = useAppSelector(selectVolume);

  const showVolumeValue = volume === -1 ? (1 / volumeFactor) : volume

  const renderVolumeIcon = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="volume-high" />
  ), []);

  return (
    <View style={styles.item}>
      <List.Item
        title={({
          color, ellipsizeMode, fontSize, selectable
        }) => (
          <View style={styles.title}>
            <Text
              style={{ color, fontSize }}
              ellipsizeMode={ellipsizeMode}
              selectable={selectable}
            >
              Extra Volume Adjustment
            </Text>

            <Text style={{ fontSize }}>
              {showVolumeValue.toFixed(1)}
            </Text>
          </View>
        )}
        description={`Keep in mind that raw video volume has been adjusted by a factor of ${volumeFactor.toFixed(1)}`}
        descriptionNumberOfLines={3}
        left={renderVolumeIcon}
        right={({ style }) => (
          <IconButton
            icon="refresh"
            style={style}
            onPress={() => dispatch(resetVolume())}
          />
        )}
      />

      <Slider
        minimumValue={MIN}
        maximumValue={MAX}
        step={STEP}
        StepMarker={() => (
          <View style={[
            styles.stepMaker,
            { backgroundColor: appTheme.colors.primary }
          ]} />
        )}
        value={showVolumeValue}
        onSlidingComplete={(value) => {
          dispatch(setVolume(value));
        }}
        onValueChange={haptics.heavy}
        style={styles.slider}
        thumbTintColor={appTheme.colors.primary}
        minimumTrackTintColor={appTheme.colors.onPrimaryContainer}
        maximumTrackTintColor={appTheme.colors.outline}
      />

      <View style={styles.caption}>
        <Caption>{MIN}</Caption>
        <Caption>{MAX}</Caption>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 15,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {
    marginHorizontal: 6,
  },
  stepMaker: {
    width: 2,
    height: 2,
    borderRadius: 5,
  },
  caption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  }
})