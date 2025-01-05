import Clipboard from "@react-native-clipboard/clipboard";
import * as Crypto from "expo-crypto";
import { File, Paths } from "expo-file-system/next";
import { useCallback } from "react";
import { StyleSheet, ToastAndroid } from "react-native";
import HapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";
import { Avatar, Button, Caption, Card, Text, useTheme } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { selectDevMode } from "@/src/redux/slices/devMode";
import { removeSubtitle, type Subtitle } from "@/src/redux/slices/subtitles";
import { selectVideoSource, setVideoSource } from "@/src/redux/slices/videoSource";

export default function SubtitleItem({ item }: { item: Subtitle }) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const devMode = useAppSelector(selectDevMode);
  const videoSource = useAppSelector(selectVideoSource);
  const selected = videoSource === item.fileUri;

  const selectSubtitle = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

    if (videoSource !== item.fileUri) {
      dispatch(setVideoSource(item.fileUri));
    }
  }, [dispatch, item.fileUri, videoSource]);

  const copyToClipboard = useCallback(() => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectHeavyClick
    );
    Clipboard.setString(item.fileUri);

    ToastAndroid.show(
      "File URI copied",
      ToastAndroid.SHORT
    )
  }, [item.fileUri]);

  const performRemove = useCallback(async () => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

    const fileHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      item.fileUri
    );
    const wavFile = new File(
      Paths.cache,
      `${fileHash.slice(0, 6)}.wav`
    );
    const coverFile = new File(item.coverUri);

    wavFile.exists && wavFile.delete();
    coverFile.exists && coverFile.delete();

    if (!item.fileUri.startsWith("http")) {
      const cachedVideo = new File(item.fileUri);
      cachedVideo.exists && cachedVideo.delete();
    }

    dispatch(removeSubtitle(item.fileUri));

    ToastAndroid.show(
      "Subtitle removed",
      ToastAndroid.SHORT
    );
  }, [dispatch, item.coverUri, item.fileUri]);

  return (
    <Card
      onPress={selectSubtitle}
      onLongPress={copyToClipboard}
      mode={selected ? "elevated" : "contained"}
      style={[styles.card, {
        backgroundColor: selected
          ? appTheme.colors.primaryContainer
          : appTheme.colors.surfaceVariant,
      }]}
    >
      <Card.Cover source={{ uri: item.coverUri }} />
      <Card.Title
        title={new Date(item.createAt).toLocaleString()}
        subtitle={`${item.value.length} line(s)`}
        left={({ size }) => (
          <Avatar.Icon
            size={size}
            icon={selected ? "check" : "subtitles-outline"}
            style={{
              backgroundColor: selected
                ? appTheme.colors.primary
                : appTheme.colors.backdrop,
            }}
          />
        )}
        right={({ size }) => (
          <Caption style={{
            marginRight: 16,
            fontSize: size - 6,
          }}>
            {item.fileUri.split(".").pop()?.toLocaleUpperCase()}
          </Caption>
        )}
      />
      <Card.Content>
        {devMode && <Text>{item.fileUri}</Text>}
      </Card.Content>

      <Card.Actions>
        <Button
          icon="delete-outline"
          onPress={performRemove}
          disabled={selected}
        >
          Delete
        </Button>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
  }
})
