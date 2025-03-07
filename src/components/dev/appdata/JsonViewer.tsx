import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const JSONViewer = ({ data }: { data: any }) => {
  const appTheme = useTheme();
  const showingData = data || { info: 'No data to show' };

  return (
    <ScrollView
      horizontal
      style={[
        styles.jsonView,
        { borderRadius: appTheme.roundness }
      ]}
    >
      <Text style={styles.json}>
        {JSON.stringify(showingData, null, 2)}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  json: {
    margin: 10,
  },
  jsonView: {
    marginBottom: 10,
    height: 'auto',
    width: '100%',
  },
});
