import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import {
  FFmpegKit,
  FFmpegKitConfig,
  type FFmpegSession,
} from "ffmpeg-kit-react-native";

export default async function (
  videoUri: string,
  onComplete: (session: FFmpegSession, audioUri: string) => void
) {
  const videoUriHash = (await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    videoUri
  )).slice(0, 6);
  const audioUri = `${FileSystem.cacheDirectory}${videoUriHash}.wav`;

  // 如果 videoUri 是 content:// URI，则将其转换为 file:// URI
  if (videoUri.startsWith('content://')) {
    videoUri = await FFmpegKitConfig.getSafParameterForRead(videoUri);
    console.debug('Selected video URI:', videoUri);
  }

  await FFmpegKit.executeAsync(
    `-i ${videoUri} -vn -c:a pcm_s16le -ar 16000 -ac 1 ${audioUri}`,
    (session) => {
      onComplete(session, audioUri);
    },
  );
};
