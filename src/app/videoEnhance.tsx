import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Banner,
  Caption,
  Divider,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";

import VolumeSlider from "@/src/components/settings/VolumeSlider";
import {
  useAppDispatch,
  useAppSelector,
} from "@/src/hooks/redux";
import {
  initialState as initialVolumeFactorState,
  resetVolumeFactor,
  selectVolumeFactor,
  setVolumeFactor,
} from "@/src/store/slices/volumeFactor";
import type ListLRProps from "@/src/types/paperListItem";

const MIN = 1.0;
const MAX = 20.0;
const STEP = 1.0;

export default function VideoEnhanceScreen() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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
        <List.Section>
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
                  {t('videoEnhance.factors')}
                </Text>

                <Text style={{ fontSize }}>
                  {volumeFactor.toFixed(1)}x
                </Text>
              </View>
            )}
            description={`Increase or decrease the video factor, default is ${initialVolumeFactorState.value.toFixed(1)}`}
            left={renderVolumeFactorIcon}
            right={({ style, color }) => (
              <IconButton
                icon="refresh"
                style={style}
                iconColor={color}
                onPress={() => dispatch(resetVolumeFactor())}
              />
            )}
          />

          <Slider
            minimumValue={MIN}
            maximumValue={MAX}
            StepMarker={() => (
              <View style={[
                styles.stepMaker,
                { backgroundColor: appTheme.colors.primary }
              ]} />
            )}
            step={STEP}
            value={volumeFactor}
            onSlidingComplete={(value) => {
              dispatch(setVolumeFactor(value));
            }}
            style={styles.slider}
            thumbTintColor={appTheme.colors.primary}
            minimumTrackTintColor={appTheme.colors.onPrimaryContainer}
            maximumTrackTintColor={appTheme.colors.outline}
          />

          <View style={styles.sliderCaption}>
            <Caption>{MIN.toFixed(1)}</Caption>
            <Caption>{MAX.toFixed(1)}</Caption>
          </View>
        </List.Section>
        <Divider />

        <VolumeSlider />
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