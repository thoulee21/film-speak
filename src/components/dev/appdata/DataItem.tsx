import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, IconButton, Text, useTheme } from 'react-native-paper';

import { ArrayDataList } from '@/src/components/dev/appdata/ArrayDataList';
import { DataMoreBtn } from '@/src/components/dev/appdata/DataMoreButton';
import { JSONViewer } from '@/src/components/dev/appdata/JsonViewer';

export interface DataItemType {
  name: string,
  data: any
}

export const DataItem = ({ item }: { item: DataItemType }) => {
  const appTheme = useTheme();
  const [expended, setExpended] = useState(false);

  const toggleExpended = useCallback(() => {
    setExpended((prev) => !prev);
  }, []);

  const isArray = useMemo(() => Array.isArray(item.data), [item.data]);

  const Content = useCallback(() => {
    let content: React.ReactNode;

    switch (typeof item.data) {
      case 'object':
        if (isArray) {
          content = expended
            ? <ArrayDataList item={item} appTheme={appTheme} />
            : null;
        } else {
          content = <JSONViewer data={item.data} />;
        }
        break;

      case 'boolean':
        content = <Text style={styles.dataText}>
          {item.data.toString()}
        </Text>;
        break;

      case 'undefined':
        content = <Text style={styles.dataText}>
          empty
        </Text>;
        break;

      default:
        content = <Text style={styles.dataText}>
          {JSON.stringify(item.data, null, 2)}
        </Text>;
        break;
    }

    return content;
  }, [appTheme, expended, isArray, item]);

  const renderDataAvatar = useCallback((props: any) => (
    <Avatar.Text {...props}
      label={item.name[0].toLocaleUpperCase()}
    />
  ), [item.name]);

  const renderMoreButton = useCallback((props: { size: number }) => (
    <DataMoreBtn data={item.data} props={props} />
  ), [item]);

  const renderExpandSwitch = useCallback(() => (
    <IconButton
      icon={expended ? 'chevron-up' : 'chevron-down'}
      onPress={toggleExpended}
      animated
    />
  ), [expended, toggleExpended]);

  return (
    <Card
      mode="contained"
      style={styles.card}
    >
      <Card.Title
        title={item.name}
        subtitle={!isArray
          ? typeof item.data
          : `array[${item.data.length}]`}
        subtitleStyle={{ color: appTheme.colors.secondary }}
        left={renderDataAvatar}
        right={isArray ? renderExpandSwitch : renderMoreButton}
      />
      <Content />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  dataText: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
});
