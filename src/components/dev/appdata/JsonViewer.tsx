import { Base16Theme, google } from 'base16';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import JsonView from 'react-native-json-tree';
import { useTheme } from 'react-native-paper';

export const JSONViewer = ({ data }: { data: any }) => {
  const appTheme = useTheme();

  const showingData = data || { info: 'No data to show' };
  const dynamicTheme: Base16Theme = useMemo(() => ({
    ...google,
    base00: appTheme.colors.surfaceVariant,
  }), [appTheme]);

  return (
    <ScrollView
      horizontal
      style={{ borderRadius: appTheme.roundness * 3 }}
    >
      <JsonView
        data={showingData}
        theme={dynamicTheme}
        invertTheme={false}
        hideRoot
        shouldExpandNode={() => true}
      />
    </ScrollView>
  );
};
