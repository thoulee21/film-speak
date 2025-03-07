import Clipboard from "@react-native-clipboard/clipboard";
import { File } from "expo-file-system/next";
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, ToastAndroid } from "react-native";
import { Avatar, Button, Caption, Card, Menu, useTheme } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { removeSubtitle, selectSubtitles, type Subtitle } from "@/src/redux/slices/subtitles";
import { selectVideoSource, setVideoSource } from "@/src/redux/slices/videoSource";
import { formatDataSize } from "@/src/utils/formatDataSize";
import haptics from "@/src/utils/haptics";

export default function SubtitleItem({ item }: { item: Subtitle }) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();
  const { t } = useTranslation();

  const subtitles = useAppSelector(selectSubtitles);
  const videoSource = useAppSelector(selectVideoSource);

  const [menuVisible, setMenuVisible] = useState(false);
  const [isShareAvailable, setIsShareAvailable] = useState(false);

  const selected = videoSource === item.fileUri;

  useEffect(() => {
    (async () => {
      setIsShareAvailable(await Sharing.isAvailableAsync());
    })();
  }, []);

  const selectSubtitle = useCallback(() => {
    haptics.light();

    if (videoSource !== item.fileUri) {
      dispatch(setVideoSource(item.fileUri));
    }
  }, [dispatch, item.fileUri, videoSource]);

  const copyToClipboard = useCallback(() => {
    haptics.heavy();
    Clipboard.setString(item.fileUri);

    ToastAndroid.show(
      t('action.fileUri'),
      ToastAndroid.SHORT
    );
  }, [item.fileUri, t]);

  const performRemove = useCallback(async () => {
    haptics.medium();

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
      t('common.remove'),
      ToastAndroid.SHORT
    );
  }, [dispatch, item.audioUri, item.coverUri, item.fileUri, selected, subtitles, t]);

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

      <Card.Actions>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          mode="elevated"
          anchorPosition="bottom"
          anchor={
            <Button
              icon="share-outline"
              mode="outlined"
              disabled={!isShareAvailable}
              onPress={() => {
                haptics.light();
                setMenuVisible(true);
              }}
            >
              {t('common.share')}
            </Button>
          }
        >
          <Menu.Item
            title={t('action.audioShare')}
            leadingIcon="music-note-outline"
            onPress={async () => {
              await Sharing.shareAsync(item.audioUri, {
                dialogTitle: t('action.audioShare'),
                mimeType: "audio/wav",
              });
              setMenuVisible(false);
            }}
          />
          <Menu.Item
            title={t('action.coverShare')}
            leadingIcon="image-outline"
            onPress={async () => {
              await Sharing.shareAsync(item.coverUri, {
                dialogTitle: t('action.coverShare'),
                mimeType: "image/png",
              });
              setMenuVisible(false);
            }}
          />
          <Menu.Item
            title={t('action.videoShare')}
            leadingIcon="video-outline"
            onPress={async () => {
              await Sharing.shareAsync(item.fileUri, {
                dialogTitle: t('action.videoShare'),
                mimeType: "video/mp4",
              });
              setMenuVisible(false);
            }}
          />
        </Menu>

        <Button
          icon="delete-outline"
          onPress={() => {
            Alert.alert(
              t('common.remove'),
              t('error.removeSubtitleConfirm'),
              [
                { text: t('common.cancel'), style: "cancel", },
                {
                  text: t('common.remove'),
                  style: "destructive",
                  onPress: performRemove,
                },
              ]
            );
          }}
        >
          {t('common.delete')}
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
