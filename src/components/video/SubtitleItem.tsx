import { useCallback } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Caption,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import type { Line } from "srt-parser-2";

import { useAppSelector } from "@/src/hooks/redux";
import { selectShowSubtitle } from "@/src/store/slices/showSubtitle";
import type ListLRProps from "@/src/types/paperListItem";
import formateTime from "@/src/utils/formatTime";
import haptics from "@/src/utils/haptics";

interface SubtitleItemProps {
  item: Line;
  selectedID: string;
  setSelectedID: (arg0: string) => void;
  onItemPress: (arg0?: Line) => void;
}

const SubtitleItem = ({
  item,
  selectedID,
  setSelectedID,
  onItemPress,
}: SubtitleItemProps) => {
  const appTheme = useTheme();
  const showSubtitle = useAppSelector(selectShowSubtitle);

  const renderTitleSection = useCallback(({
    color, ellipsizeMode, fontSize, selectable
  }: {
    color: string;
    ellipsizeMode: "head" | "middle" | "tail" | "clip" | undefined;
    fontSize: number;
    selectable: boolean;
  }) => (
    <View style={styles.row}>
      <Text
        style={{ color, fontSize }}
        ellipsizeMode={ellipsizeMode}
        selectable={selectable}
      >
        {`${formateTime(item.startTime)} - ${formateTime(item.endTime)}`}
      </Text>

      <Caption>
        {(item.endSeconds - item.startSeconds)
          .toFixed(1)}s
      </Caption>
    </View>
  ), [item]);

  const toggleSelected = useCallback(() => {
    if (selectedID === item.id) {
      setSelectedID("0");
      onItemPress(undefined);
    } else {
      setSelectedID(item.id);
      onItemPress(item);
    }
  }, [item, onItemPress, selectedID, setSelectedID]);

  const renderIndicator = useCallback(({ style }: ListLRProps) => (
    selectedID !== item.id ? (
      <Avatar.Text
        style={[style, { backgroundColor: 'royalblue' }]}
        color="white"
        size={40}
        label={item.id}
      />
    ) : (
      <ActivityIndicator size={40} style={style} />
    )
  ), [item.id, selectedID]);

  return (
    <List.Item
      title={renderTitleSection}
      description={showSubtitle && item.text.trim()}
      descriptionNumberOfLines={15}
      style={{
        backgroundColor: selectedID === item.id
          ? appTheme.colors.secondaryContainer
          : undefined,
      }}
      left={renderIndicator}
      onPress={() => {
        haptics.light();
        toggleSelected();
      }}
      onLongPress={() => {
        haptics.medium();
        Alert.alert("Subtitle", item.text)
      }}
    />
  )
};

export default SubtitleItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
