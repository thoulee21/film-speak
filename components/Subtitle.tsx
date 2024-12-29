import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Divider, List } from "react-native-paper";
import SrtParser2, { type Line } from "srt-parser-2";

export const SUBTITLE = 'https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt';

interface SubtitleProps {
  uri?: string;
  onItemPress: (arg0: Line) => void;
}

export default function Subtitle({ uri, onItemPress }: SubtitleProps) {
  const [subtitles, setSubtitles] = useState<Line[]>([]);

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

  return (
    <FlashList
      data={subtitles}
      renderItem={({ item }) => (
        <List.Item
          title={`${item.startSeconds} - ${item.endSeconds}`}
          description={item.text.trim()}
          descriptionNumberOfLines={2}
          onPress={() => onItemPress(item)}
          key={item.id}
        />
      )}
      ItemSeparatorComponent={Divider}
      estimatedItemSize={84.4}
    />
  );
};