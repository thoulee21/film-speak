import { type StyleProp, type ViewStyle } from "react-native";
import { Button } from "react-native-paper";

import useSelectFile from "@/src/hooks/useSelectFile";

export default function SelectVideoButton({
  style, mode
}: {
  style?: StyleProp<ViewStyle>
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
}) {
  const selectFile = useSelectFile()

  return (
    <Button
      icon="file-video"
      mode={mode || 'contained'}
      style={style}
      onPress={selectFile}
    >
      Select Video File
    </Button>
  )
}
