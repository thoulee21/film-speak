import Clipboard from "@react-native-clipboard/clipboard";
import { File } from "expo-file-system/next";
import * as Sharing from 'expo-sharing';
import { useCallback } from "react";
import { Alert, StyleSheet, ToastAndroid } from "react-native";
import HapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";
import { Avatar, Button, Caption, Card, Text, useTheme } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { selectDevMode } from "@/src/redux/slices/devMode";
import { removeSubtitle, selectSubtitles, type Subtitle } from "@/src/redux/slices/subtitles";
import { selectVideoSource, setVideoSource } from "@/src/redux/slices/videoSource";
import { formatDataSize } from "@/src/utils/formatDataSize";

export default function SubtitleItem({ item }: { item: Subtitle }) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const devMode = useAppSelector(selectDevMode);
  const subtitles = useAppSelector(selectSubtitles);

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

    const wavFile = new File(item.audioUri);
    const coverFile = new File(item.coverUri);

    wavFile.exists && wavFile.delete();
    coverFile.exists && coverFile.delete();

    if (!item.fileUri.startsWith("http")) {
      const cachedVideo = new File(item.fileUri);
      cachedVideo.exists && cachedVideo.delete();
    }

    if (selected) {
      if (subtitles.length - 1 > 0) {
        dispatch(setVideoSource(subtitles[0].fileUri));
      } else {
        dispatch(setVideoSource(undefined))
      }
    }
    dispatch(removeSubtitle(item.fileUri));

    ToastAndroid.show(
      "Subtitle removed",
      ToastAndroid.SHORT
    );
  }, [dispatch, item.audioUri, item.coverUri, item.fileUri, selected, subtitles]);

  return (
    <Card
      onPress={selectSubtitle}
      onLongPress={copyToClipboard}
      mode={selected ? "elevated" : "contained"}
      style={[styles.card, {
        backgroundColor: selected
          ? appTheme.colors.secondaryContainer
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
        right={() => {
          const videoFileSize = new File(item.fileUri).size || 0;
          const coverFileSize = new File(item.coverUri).size || 0;
          const wavFileSize = new File(item.audioUri).size || 0;
          const cacheSizeSum = videoFileSize + coverFileSize + wavFileSize;

          return (
            <Caption style={styles.cacheSize}>
              {formatDataSize(cacheSizeSum)}
            </Caption>
          )
        }}
      />

      {devMode && (
        <Card.Content>
          <Text>
            {JSON.stringify(
              item.fileUri, null, 2
            )}
          </Text>
        </Card.Content>
      )}

      <Card.Actions>
        <Button
          icon="share-outline"
          onPress={async () => {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(
                item.audioUri,
                {
                  dialogTitle: "Share extracted wave file",
                  mimeType: "audio/wav",
                },
              );
            } else {
              ToastAndroid.show(
                "Sharing is not available",
                ToastAndroid.SHORT,
              );
            }
          }}
        >
          Share .wav
        </Button>

        <Button
          icon="delete-outline"
          onPress={() => {
            Alert.alert(
              "Remove subtitle",
              "Are you sure you want to remove this subtitle?",
              [
                { text: "Cancel", style: "cancel", },
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: performRemove,
                },
              ]
            );
          }}
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
  },
  cacheSize: {
    fontSize: 15,
    marginRight: 16,
  }
})
