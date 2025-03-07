import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MD3Theme, Text } from 'react-native-paper';

import { ArrayDataItem } from '@/src/components/dev/appdata/ArrayDataItem';
import { DataItemType } from '@/src/components/dev/appdata/DataItem';

export const ArrayDataList = ({ item, appTheme }: {
  item: DataItemType,
  appTheme: MD3Theme
}) => {
  return <FlatList
    data={item.data}
    renderItem={(props) =>
      <ArrayDataItem {...props}
        appTheme={appTheme}
      />
    }
    ListEmptyComponent={
      <Text style={styles.dataText}>
        Empty Array
      </Text>
    }
    ListFooterComponent={
      <View style={styles.innerListFooter} />
    }
  />;
};

const styles = StyleSheet.create({
  dataText: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  innerListFooter: {
    height: 15,
  },
});
