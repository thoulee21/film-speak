import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  Banner,
  Caption,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";

import {
  useAppDispatch,
  useAppSelector,
} from "@/src/hooks/redux";
import {
  resetVolumeFactor,
  selectVolumeFactor,
  setVolumeFactor,
} from "@/src/redux/slices/volumeFactor";
import type ListLRProps from "@/src/types/paperListItem";

export default function VideoEnhanceScreen() {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();
  const volumeFactor = useAppSelector(selectVolumeFactor);

  const renderVolumeFactorIcon = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="volume-high" />
  ), []);

  return (
    <View>
      <Banner visible>
        The changes you make here will not affect the video processed earlier. To apply the changes, you need to reprocess the video.
      </Banner>

      <ScrollView>
        <View>
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
                  Volume Factor
                </Text>

                <Text style={{ fontSize }}>
                  {volumeFactor}
                </Text>
              </View>
            )}
            description="Increase or decrease the video factor, default is 20"
            left={renderVolumeFactorIcon}
            right={({ style }) => (
              <IconButton
                icon="refresh"
                mode="contained"
                style={style}
                onPress={() => dispatch(resetVolumeFactor())}
              />
            )}
          />

          <Slider
            minimumValue={1}
            maximumValue={40}
            StepMarker={() => (
              <View style={[
                styles.stepMaker,
                { backgroundColor: appTheme.colors.primary }
              ]} />
            )}
            step={1}
            value={volumeFactor}
            onSlidingComplete={(value) => {
              dispatch(setVolumeFactor(value));
            }}
            onValueChange={() => {
              HapticFeedback.trigger(
                HapticFeedbackTypes.effectHeavyClick
              );
            }}
            style={styles.slider}
            thumbTintColor={appTheme.colors.primary}
            minimumTrackTintColor={appTheme.colors.onPrimaryContainer}
            maximumTrackTintColor={appTheme.colors.outline}
          />

          <View style={styles.sliderCaption}>
            <Caption>1</Caption>
            <Caption>40</Caption>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  sliderCaption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  }
})