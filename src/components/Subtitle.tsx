import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  ActivityIndicator,
  Button,
  Caption,
  Divider,
  List,
  useTheme
} from "react-native-paper";
import { type Line } from "srt-parser-2";

import Wav2SubtitleConverter from "@/src/utils/wav2subtitle";

interface SubtitleProps {
  fileUri: string;
  onItemPress: (arg0: Line) => void;
}

export default function Subtitle({ fileUri, onItemPress }: SubtitleProps) {
  const appTheme = useTheme();

  const [subtitle, setSubtitle] = useState<Line[]>([]);
  const [selectedID, setSelectedID] = useState("0");

  useEffect(() => {
    const wav2Subtitle = new Wav2SubtitleConverter();
    wav2Subtitle.start(fileUri, setSubtitle);
  }, [fileUri]);

  const renderItem = useCallback(({ item }: { item: Line }) => (
    <List.Item
      title={`${item.startSeconds} - ${item.endSeconds}`}
      description={item.text.trim()}
      descriptionNumberOfLines={2}
      onPress={() => {
        HapticFeedback.trigger(
          HapticFeedbackTypes.effectDoubleClick
        );
        setSelectedID(item.id);

        onItemPress(item);
      }}
      style={{
        backgroundColor: selectedID === item.id
          ? appTheme.colors.primaryContainer
          : undefined,
      }}
      left={({ style }) => (
        <Caption style={[style, { fontSize: 19 }]}>
          {item.id}
        </Caption>
      )}
      right={(props) =>
        selectedID === item.id && (
          <ActivityIndicator {...props} />
        )
      }
    />
  ), [selectedID, onItemPress, appTheme.colors.primaryContainer]);

  return (
    <FlatList
      data={subtitle}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      extraData={selectedID}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.loadingView}>
          <Button loading>
            Generating Subtitle...
          </Button>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
