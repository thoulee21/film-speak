import { useAssets } from "expo-asset";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import HapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";
import { ActivityIndicator, Caption, Divider, List, useTheme } from "react-native-paper";
import { type Line } from "srt-parser-2";

import Wav2SubtitleConverter from "@/src/utils/wav2subtitle";

interface SubtitleProps {
  fileUri?: string;
  onItemPress: (arg0: Line) => void;
}

export default function Subtitle({ fileUri, onItemPress }: SubtitleProps) {
  const appTheme = useTheme();

  const [audioAssets] = useAssets([
    require('@/assets/audio/audio.wav')
  ]);

  const [subtitle, setSubtitle] = useState<Line[]>([]);
  const [selectedID, setSelectedID] = useState("0");

  useEffect(() => {
    if (audioAssets) {
      const DEFAULT_FILE_URI = audioAssets[0].localUri;
      if (DEFAULT_FILE_URI) {

        const wav2Subtitle = new Wav2SubtitleConverter();
        wav2Subtitle.start(
          fileUri || DEFAULT_FILE_URI,
          setSubtitle
        );
      }
    }
  }, [audioAssets, fileUri]);

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
      keyExtractor={(item) => item.id}
    />
  );
};