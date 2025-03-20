import Clipboard from "@react-native-clipboard/clipboard";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ToastAndroid } from "react-native";
import { IconButton, Menu, useTheme } from "react-native-paper";

import { useRemoveSubtitle } from "@/src/hooks/useRemoveSubtitle";
import type { Subtitle } from "@/src/store/slices/subtitles";
import haptics from "@/src/utils/haptics";

export default function MoreMenu({ item, size }: { item: Subtitle, size: number }) {
  const appTheme = useTheme();
  const { t } = useTranslation();
  const performRemove = useRemoveSubtitle();

  const [
    moreMenuVisible,
    setMoreMenuVisible,
  ] = useState(false);

  const copyToClipboard = useCallback(() => {
    Clipboard.setString(item.fileUri);

    ToastAndroid.show(
      t('action.fileUri'),
      ToastAndroid.SHORT
    );
  }, [item.fileUri, t]);

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
    <Menu
      visible={moreMenuVisible}
      onDismiss={() => setMoreMenuVisible(false)}
      statusBarHeight={-45}
      anchor={
        <IconButton
          icon="dots-vertical"
          size={size}
          onPress={() => {
            haptics.light();
            setMoreMenuVisible(true);
          }}
        />
      }
    >
      <Menu.Item
        title="Copy File URI"
        leadingIcon="content-copy"
        onPress={() => {
          haptics.heavy();
          copyToClipboard();
          setMoreMenuVisible(false);
        }}
      />
      <Menu.Item
        title={t('common.remove')}
        leadingIcon="delete-outline"
        titleStyle={{ color: appTheme.colors.error }}
        onPress={() => {
          haptics.medium();
          onPressDelete();
          setMoreMenuVisible(false);
        }}
      />
    </Menu>
  )
}