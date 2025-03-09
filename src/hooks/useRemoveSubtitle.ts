import { File } from "expo-file-system/next";
import { useCallback } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "@/src/hooks/redux";
import {
  removeSubtitle,
  selectSubtitles,
  type Subtitle,
} from "@/src/store/slices/subtitles";
import {
  selectVideoSource,
  setVideoSource,
} from "@/src/store/slices/videoSource";

export const useRemoveSubtitle = () => {
  const dispatch = useAppDispatch();
  const subtitles = useAppSelector(selectSubtitles);
  const videoSource = useAppSelector(selectVideoSource);


  const performRemove = useCallback(async (item: Subtitle) => {
    const selected = videoSource === item.fileUri;
    const wavFile = new File(item.audioUri);
    const coverFile = new File(item.coverUri);

    wavFile.exists && wavFile.delete();
    coverFile.exists && coverFile.delete();

    if (!item.fileUri.startsWith("http")) {
      const cachedVideo = new File(item.fileUri);
      cachedVideo.exists && cachedVideo.delete();
    }

    if (selected) {
      if (subtitles.length - 1 > 0) {
        dispatch(setVideoSource(subtitles[0].fileUri));
      } else {
        dispatch(setVideoSource(undefined))
      }
    }

    dispatch(removeSubtitle(item.fileUri));
  }, [dispatch, subtitles, videoSource]);

  return performRemove;
};