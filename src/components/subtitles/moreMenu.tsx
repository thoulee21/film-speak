import Clipboard from "@react-native-clipboard/clipboard";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastAndroid } from "react-native";
import { IconButton, Menu } from "react-native-paper";

import type { Subtitle } from "@/src/store/slices/subtitles";
import haptics from "@/src/utils/haptics";

export default function MoreMenu({ item, size }: { item: Subtitle, size: number }) {
  const { t } = useTranslation();
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const copyToClipboard = useCallback(() => {
    haptics.heavy();
    Clipboard.setString(item.fileUri);

    ToastAndroid.show(
      t('action.fileUri'),
      ToastAndroid.SHORT
    );
  }, [item.fileUri, t]);

  return (
    <Menu
      visible={moreMenuVisible}
      onDismiss={() => setMoreMenuVisible(false)}
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
        onPress={copyToClipboard}
      />
    </Menu>
  )
}