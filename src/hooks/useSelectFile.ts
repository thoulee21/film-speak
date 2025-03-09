import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useCallback } from "react";
import { DeviceEventEmitter } from "react-native";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { setVideoSource } from "@/src/store/slices/videoSource";
import { selectVolumeFactor } from "@/src/store/slices/volumeFactor";
import handleInputVideo from "@/src/utils/handleInputVideo";

export default function useSelectFile() {
  const dispatch = useAppDispatch();
  const volumeFactor = useAppSelector(selectVolumeFactor);

  const selectFile = useCallback(async () => {
    const pickRes = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: false,
    });

    if (!pickRes.canceled) {
      DeviceEventEmitter.emit('onVideoProcessing');
      router.navigate('/');

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

  return selectFile;
}