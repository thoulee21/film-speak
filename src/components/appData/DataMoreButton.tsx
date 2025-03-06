import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Share, StatusBar, ToastAndroid } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

import haptics from '@/src/utils/haptics';

export const DataMoreBtn = ({ data, props }: {
  data: any, props: { size: number }
}) => {
  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false);

  return (
    <Menu
      anchor={
        <IconButton
          {...props}
          icon="dots-vertical"
          onPress={() => {
            haptics.heavy();
            setMenuVisible(true);
          }}
        />}
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      statusBarHeight={StatusBar.currentHeight}
    >
      <Menu.Item
        leadingIcon="clipboard-outline"
        title="Copy"
        onPress={() => {
          Clipboard.setString(JSON.stringify(data));

          haptics.medium();
          ToastAndroid.show(
            'Copied to clipboard',
            ToastAndroid.SHORT
          );
          setMenuVisible(false);
        }}
      />
      <Menu.Item
        leadingIcon="share-outline"
        title="Share"
        disabled={typeof data === 'undefined' || data === ''}
        onPress={() => {
          Share.share({
            message: JSON.stringify(data)
          });

          haptics.medium();
          setMenuVisible(false);
        }}
      />
    </Menu>
  );
};
