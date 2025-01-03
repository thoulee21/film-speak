import React, { useState } from 'react';
import { Button, Dialog, List, Portal, Text, useTheme } from 'react-native-paper';

import { author, displayName } from '@/package.json';

const date = new Date();
const copyright = `Copyright©${date.getFullYear()} ${author.name}.`;

const CopyrightItem = () => {
  const appTheme = useTheme();
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <>
      <List.Item
        title="About this app"
        onPress={showDialog}
      />

      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}
        >
          <Dialog.Icon
            icon="information-outline"
            size={40}
          />
          <Dialog.Title>
            {displayName}
          </Dialog.Title>

          <Dialog.Content>
            <Text selectable>
              {copyright
                .concat(' All Rights Reserved.')}
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={hideDialog}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default CopyrightItem;