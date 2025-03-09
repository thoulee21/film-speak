import { File } from "expo-file-system/next";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, useTheme } from "react-native-paper";

import MoreMenu from "@/src/components/subtitles/moreMenu";
import ShareMenu from "@/src/components/subtitles/shareMenu";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { useRemoveSubtitle } from "@/src/hooks/useRemoveSubtitle";
import { type Subtitle } from "@/src/store/slices/subtitles";
import {
  selectVideoSource,
  setVideoSource,
} from "@/src/store/slices/videoSource";
import { formatDataSize } from "@/src/utils/formatDataSize";
import haptics from "@/src/utils/haptics";

export default function SubtitleItem({ item }: { item: Subtitle }) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const { t } = useTranslation();
  const performRemove = useRemoveSubtitle();

  const videoSource = useAppSelector(selectVideoSource);
  const selected = videoSource === item.fileUri;

  const selectSubtitle = useCallback(() => {
    haptics.light();

    if (videoSource !== item.fileUri) {
      dispatch(setVideoSource(item.fileUri));
    }
  }, [dispatch, item.fileUri, videoSource]);

  const cacheSize = useMemo(() => {
    const videoFileSize = new File(item.fileUri).size || 0;
    const coverFileSize = new File(item.coverUri).size || 0;
    const wavFileSize = new File(item.audioUri).size || 0;

    return videoFileSize + coverFileSize + wavFileSize;
  }, [item.audioUri, item.coverUri, item.fileUri]);

  const onPressDelete = useCallback(() => {
    Alert.alert(
      t('common.remove'),
      t('error.removeSubtitleConfirm'),
      [
        { text: t('common.cancel'), style: "cancel", },
        {
          text: t('common.remove'),
          style: "destructive",
          onPress: () => {
            haptics.medium();
            performRemove(item);
          },
        },
      ]
    );
  }, [item, performRemove, t]);

  return (
    <Card
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
        subtitle={`${item.value.length} line(s) · ${formatDataSize(cacheSize)}`}
        subtitleStyle={{ color: appTheme.colors.onSurfaceDisabled }}
        left={({ size }) => (
          <Avatar.Icon
            size={size}
            icon="subtitles-outline"
            style={{
              backgroundColor: selected
                ? appTheme.colors.primary
                : appTheme.colors.backdrop,
            }}
          />
        )}
        right={({ size }) => (
          <View style={{ flexDirection: "row" }}>
            <ShareMenu item={item} size={size} />
            <MoreMenu item={item} size={size} />
          </View>
        )}
      />

      <Card.Actions>
        <Button
          icon="delete-outline"
          onPress={onPressDelete}
        >
          {t('common.delete')}
        </Button>

        <Button
          icon="check"
          onPress={selectSubtitle}
          disabled={selected}
        >
          使用
        </Button>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
  },
})
