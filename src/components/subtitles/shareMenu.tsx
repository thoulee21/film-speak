import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { IconButton, Menu } from "react-native-paper";

import type { Subtitle } from "@/src/store/slices/subtitles";
import haptics from "@/src/utils/haptics";
import { useTranslation } from "react-i18next";

export default function ShareMenu({ item, size }: { item: Subtitle, size: number }) {
  const { t } = useTranslation();

  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [isShareAvailable, setIsShareAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      setIsShareAvailable(await Sharing.isAvailableAsync());
    })();
  }, []);

  return (
    <Menu
      visible={shareMenuVisible}
      onDismiss={() => setShareMenuVisible(false)}
      anchor={
        <IconButton
          icon="share-variant"
          size={size}
          onPress={() => {
            haptics.light();
            setShareMenuVisible(true);
          }}
          disabled={!isShareAvailable}
        />
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
          setShareMenuVisible(false);
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
          setShareMenuVisible(false);
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
          setShareMenuVisible(false);
        }}
      />
    </Menu>
  )
}