import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import HapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";
import { ActivityIndicator, Caption, Divider, List, useTheme } from "react-native-paper";
import SrtParser2, { type Line } from "srt-parser-2";

export const SUBTITLE = 'https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt';

interface SubtitleProps {
  uri?: string;
  onItemPress: (arg0: Line) => void;
}

export default function Subtitle({
  uri, onItemPress
}: SubtitleProps) {
  const appTheme = useTheme();

  const [subtitles, setSubtitles] = useState<Line[]>([]);
  const [selectedID, setSelectedID] = useState<string>("0");

  useEffect(() => {
    const getSubtitle = async () => {
      const response = await fetch(uri || SUBTITLE);
      const text = await response.text();

      const parser = new SrtParser2();
      const json = parser.fromSrt(text);

      setSubtitles(json);
    };

    getSubtitle();
  }, [uri]);

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
      data={subtitles}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      extraData={selectedID}
      keyExtractor={(item) => item.id}
    />
  );
};