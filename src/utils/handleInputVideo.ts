import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { FFmpegKit, FFmpegKitConfig } from "ffmpeg-kit-react-native";

/**
 * @param fileSource 视频文件路径
 * @param volumeFactor 音量增幅
 * @param onComplete 完成回调
 * @returns void
 * @description 增幅音量+缓存视频
 **/
const handleInputVideo = async (
  fileSource: string,
  volumeFactor: number,
  onComplete: (dest: string) => void,
) => {
  const fileUri = await FFmpegKitConfig.getSafParameterForRead(fileSource);
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256, fileSource
  );
  const destination = `${FileSystem.cacheDirectory}${hash.slice(0, 6)}.mp4`;

  await FFmpegKit.executeAsync(
    `-y -i ${fileUri} -af "volume=${volumeFactor}" -c:v copy -c:a aac ${destination}`,
    () => {
      onComplete(destination);
    },
  );
};

export default handleInputVideo;
