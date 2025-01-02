import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper/src/types';

import { DataMoreBtn } from '@/src/components/appData/DataMoreButton';
import { JSONViewer } from '@/src/components/appData/JsonViewer';

export const ArrayDataItem = ({ item, index, appTheme }: {
  item: any,
  index: number,
  appTheme: MD3Theme
}) => {
  const renderAvatar = useCallback((props: any) => (
    <Avatar.Text
      {...props}
      label="A"
      style={{
        backgroundColor: appTheme.colors.tertiary,
      }}
    />
  ), [appTheme.colors.tertiary]);

  const renderMoreButton = useCallback((props: any) => (
    <DataMoreBtn data={item} {...props} />
  ), [item]);

  return (
    <Card
      key={index}
      mode="outlined"
      style={styles.card}
    >
      <Card.Title
        title={item.id || 'Array Item'}
        subtitle={typeof item}
        subtitleStyle={{ color: appTheme.colors.tertiary }}
        left={renderAvatar}
        right={renderMoreButton}
      />

      {typeof item !== 'object'
        ? <Text style={styles.dataText}>
          {item}
        </Text>
        : <JSONViewer data={item} />}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'transparent',
  },
  dataText: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
});
