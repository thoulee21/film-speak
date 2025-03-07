import * as Crypto from "expo-crypto";
import { cacheDirectory } from "expo-file-system";
import { File, Paths } from "expo-file-system/next";
import { FFmpegKit, type FFmpegSession } from "ffmpeg-kit-react-native";
import React, { useCallback, useMemo, useState, } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Caption, Divider } from "react-native-paper";
import { type Line } from "srt-parser-2";

import LottieAnimation from "@/src/components/LottieAnimation";
import SelectVideoButton from "@/src/components/video/SelectVideoButton";
import SubtitleItem from "@/src/components/video/SubtitleItem";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { addSubtitle, selectSubtitles } from "@/src/store/slices/subtitles";
import { selectVideoSource } from "@/src/store/slices/videoSource";
import extractAudioFromVideo from "@/src/utils/extractAudioFromVideo";
import Wav2SubtitleConverter from "@/src/utils/wav2subtitle";

interface SubtitleProps {
  onItemPress: (arg0?: Line) => void;
}

export default function Subtitle({ onItemPress }: SubtitleProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const videoFileUri = useAppSelector(selectVideoSource);
  const subtitles = useAppSelector(selectSubtitles);

  const [selectedID, setSelectedID] = useState("0");
  const [generatingLog, setGeneratingLog] = useState('');

  const subtitle = useMemo(() => {
    if (!videoFileUri) { return []; }

    let subtitleValue = subtitles.find((subtitle) =>
      subtitle.fileUri === videoFileUri
    )?.value;

    const save = async (lines: Line[], audioUri: string) => {
      subtitleValue = lines;

      const uriHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        videoFileUri
      );
      const coverFile = new File(
        Paths.cache,
        `cover_${uriHash.slice(0, 6)}_001.jpg`
      );

      const saveSubtitleMetadata = () => {
        const subtitleMatedata = {
          fileUri: videoFileUri,
          value: lines,
          createAt: Date.now(),
          coverUri: coverFile.uri,
          audioUri
        };

        dispatch(addSubtitle(subtitleMatedata));
      }

      const outputPattern = `${cacheDirectory}cover_${uriHash.slice(0, 6)}_%03d.jpg`;
      await FFmpegKit.executeAsync(
        `-i ${videoFileUri} -y -f image2 -frames 1 ${outputPattern}`,
        saveSubtitleMetadata
      )
    }

    const generateSubtitle = (
      _: FFmpegSession, audioUri: string
    ) => {
      const wav2Subtitle = new Wav2SubtitleConverter();
      wav2Subtitle.start(
        audioUri,
        (lines) => save(lines, audioUri),
        setGeneratingLog
      );
    }

    if (!subtitleValue) {
      extractAudioFromVideo(
        videoFileUri,
        generateSubtitle
      );
    }

    return subtitleValue;
  }, [subtitles, videoFileUri, dispatch]);

  const renderItem = useCallback(({
    item
  }: { item: Line }) => (
    <SubtitleItem
      item={item}
      onItemPress={onItemPress}
      selectedID={selectedID}
      setSelectedID={setSelectedID}
    />
  ), [onItemPress, selectedID]);

  return (
    <FlatList
      data={subtitle}
      renderItem={renderItem}
      overScrollMode="never"
      ItemSeparatorComponent={Divider}
      extraData={selectedID}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        videoFileUri ? (
          <LottieAnimation
            animation="loadingAtomColored"
            caption={t('subtitle.generate')}
          >
            <Caption
              style={[
                styles.log,
                styles.paddingHor
              ]}
              numberOfLines={1}
              ellipsizeMode="head"
            >
              {generatingLog}
            </Caption>
          </LottieAnimation>
        ) : (
          <LottieAnimation
            animation="welcome"
            style={styles.paddingHor}
            caption={t('subtitle.welcome')}
          />
        )
      }
      // 避免字幕项被 FAB 遮挡
      ListFooterComponent={
        <View style={styles.paddingHor}>
          {!videoFileUri && <SelectVideoButton />}
          <View style={{ height: 100 }} />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  log: {
    textAlign: 'center',
    marginBottom: 16,
  },
  paddingHor: {
    marginHorizontal: 16,
  }
})
