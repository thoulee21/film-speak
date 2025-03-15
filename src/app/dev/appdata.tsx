import React from 'react';
import { useTheme } from 'react-native-paper';
import {
  Tabs as PaperTabs,
  TabScreen,
  TabsProvider
} from 'react-native-paper-tabs';

import {
  LocalStorage,
  PackageData,
  ReduxState,
} from '@/src/components/dev/appdata/pages';
import { formatDataSize } from '@/src/utils/formatDataSize';
import { reduxStorage } from '@/src/utils/mmkvStorage';

export default function AppDataScreen() {
  const appTheme = useTheme();
  return (
    <TabsProvider>
      <PaperTabs
        style={{
          backgroundColor: appTheme.colors.elevation.level2,
        }}
      >
        <TabScreen label='Storage'>
          <LocalStorage />
        </TabScreen>

        <TabScreen
          label='State'
          badge={formatDataSize(reduxStorage.size)}
        >
          <ReduxState />
        </TabScreen>

        <TabScreen label='Package'>
          <PackageData />
        </TabScreen>
      </PaperTabs>
    </TabsProvider>
  );
}
