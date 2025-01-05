import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useCallback } from "react";
import { DeviceEventEmitter, type StyleProp, type ViewStyle } from "react-native";
import { Button } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { setVideoSource } from "@/src/redux/slices/videoSource";
import { selectVolumeFactor } from "@/src/redux/slices/volumeFactor";
import handleInputVideo from "@/src/utils/handleInputVideo";

export default function SelectVideoButton({
  style, mode
}: {
  style?: StyleProp<ViewStyle>
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
}) {
  const dispatch = useAppDispatch();
  const volumeFactor = useAppSelector(selectVolumeFactor);

  const selectFile = useCallback(async () => {
    const pickRes = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: false,
    });

    if (!pickRes.canceled) {
      DeviceEventEmitter.emit('onVideoProcessing');
      router.canGoBack() && router.back();

      await handleInputVideo(
        pickRes.assets[0].uri,
        volumeFactor,
        (dest) => {
          dispatch(setVideoSource(dest));
          DeviceEventEmitter.emit('onVideoProcessed');
        }
      );
    }
  }, [dispatch, volumeFactor]);

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
