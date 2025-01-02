import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Platform,
  StyleSheet,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { Appbar, Divider, List } from "react-native-paper";

import { useAppSelector } from "@/src/hooks/redux";
import {
  selectSubtitles,
  type Subtitle,
} from "@/src/redux/slices/subtitles";

export default function Subtitles() {
  const subtitles = useAppSelector(selectSubtitles);

  const renderItem = ({ item }: ListRenderItemInfo<Subtitle>) => {
    return (
      <List.Item
        title={item.fileUri}
        titleNumberOfLines={5}
        description={item.value.length + " captions"}
      />
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Appbar.Header
        statusBarHeight={0}
        elevated
      >
        <Appbar.Content title="History" />
      </Appbar.Header>

      <FlatList
        data={subtitles}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
