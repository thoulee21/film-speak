import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Avatar, Caption, IconButton, List, Text, useTheme } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  resetVolumeFactor,
  selectVolumeFactor,
  setVolumeFactor,
} from "@/src/store/slices/volumeFactor";
import type ListLRProps from "@/src/types/paperListItem";
import Slider from "@react-native-community/slider";

const MIN = 1.0;
const MAX = 20.0;
const STEP = 1.0;

export default function VolFactorSlider() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const appTheme = useTheme();
  const volumeFactor = useAppSelector(selectVolumeFactor);

  const renderVolumeFactorIcon = useCallback(({ style }: ListLRProps) => (
    <Avatar.Icon
      style={[style, { backgroundColor: 'hotpink' }]}
      size={40}
      color="white"
      icon="volume-high"
    />
  ), []);

  return (
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
        description={t('videoEnhance.volFactor.description')}
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