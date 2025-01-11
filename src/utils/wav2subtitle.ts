// 需要放在 speech sdk 之前引用，否则 sdk 会报错
import "react-native-get-random-values";

import { Buffer } from "buffer";
import * as FileSystem from 'expo-file-system';
import {
  AudioConfig,
  CancellationReason,
  SpeechConfig,
  SpeechRecognitionResult,
  SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";
import { PermissionsAndroid, Platform } from "react-native";
import SrtParser2, { type Line } from "srt-parser-2";

// Azure 语音服务 key、region
const KEY = '7b9805a40281436c9c2c03068a5c5785';
const REGION = 'southeastasia';

const newline = '\n';
let sequenceNumber = 0;

function getTimestamp(
  result: SpeechRecognitionResult,
  useSubRipTextCaptionFormat: boolean
) {
  // Offset and duration are measured in 100-nanosecond increments. 
  // The Date constructor takes a value measured in milliseconds.
  // 100 nanoseconds is equal to a tick. There are 10,000 ticks in a millisecond.
  // See:
  // https://docs.microsoft.com/dotnet/api/system.timespan.ticks
  // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitionresult

  const ticksPerMillisecond = 10000;
  const startTime = new Date(result.offset / ticksPerMillisecond);
  const endTime = new Date(result.offset / ticksPerMillisecond + result.duration / ticksPerMillisecond);

  // Note We must use getUTC* methods, or the results are adjusted for our local time zone, which we don't want.
  const start_hours = startTime.getUTCHours().toString().padStart(2, '0');
  const start_minutes = startTime.getUTCMinutes().toString().padStart(2, '0');
  const start_seconds = startTime.getUTCSeconds().toString().padStart(2, '0');
  const start_milliseconds = startTime.getUTCMilliseconds().toString().padStart(3, '0');

  const end_hours = endTime.getUTCHours().toString().padStart(2, '0');
  const end_minutes = endTime.getUTCMinutes().toString().padStart(2, '0');
  const end_seconds = endTime.getUTCSeconds().toString().padStart(2, '0');
  const end_milliseconds = endTime.getUTCMilliseconds().toString().padStart(3, '0');

  if (useSubRipTextCaptionFormat) {
    // SRT format requires ',' as decimal separator rather than '.'.
    return `${start_hours}:${start_minutes}:${start_seconds},${start_milliseconds} --> ${end_hours}:${end_minutes}:${end_seconds},${end_milliseconds}`;
  }
  else {
    return `${start_hours}:${start_minutes}:${start_seconds}.${start_milliseconds} --> ${end_hours}:${end_minutes}:${end_seconds}.${end_milliseconds}`;
  }
}

function getCaption(
  sequenceNumber: number,
  result: SpeechRecognitionResult,
  useSubRipTextCaptionFormat: boolean,
) {
  let caption = "";
  caption += `${sequenceNumber}${newline}`;

  caption += `${getTimestamp(result, useSubRipTextCaptionFormat)}${newline}`;
  caption += `${result.text}${newline}${newline}`
  return caption;
}

class Wav2SubtitleConverter {
  private recognizer: SpeechRecognizer | null = null;
  private subtitle: string = '';
  private lines: Line[] = [];

  /**
   * 初始化语音识别
   * @param fileUri 本地 .wav 文件路径
   * 如：file:///data/user/0/host.exp.exponent/cache/recording.wav
   */
  public async init(fileUri: string) {
    // 读取本地 .wav 文件
    const fileData = await FileSystem.readAsStringAsync(
      fileUri, {
      encoding: FileSystem.EncodingType.Base64
    });

    const buffer = Buffer.from(fileData, "base64");

    // 语音转换配置
    const speechConfig = SpeechConfig.fromSubscription(
      KEY,
      REGION
    );

    // 这里指定音频来源为 WaveFileInput
    const audioConfig = AudioConfig.fromWavFileInput(buffer);

    // 通过配置生成 SpeechRecognizer 实例
    this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  }

  /**
   * 开始语音识别
   * @param fileUri 本地 .wav 文件路径
   * 如：file:///data/user/0/host.exp.exponent/cache/recording.wav
   */
  public async start(
    fileUri: string,
    onCompleted: (lines: Line[]) => void,
    onRecognizing: (resTxt: string) => void
  ) {
    // 先检查是否有麦克风等权限
    await Wav2SubtitleConverter.checkPermission();

    if (!this.recognizer) await this.init(fileUri);

    this.recognizer!.sessionStarted = (s, e) => {
      console.log("Session started: " + e.sessionId);
    };

    this.recognizer!.sessionStopped = (s, e) => {
      console.log("Session stopped: " + e.sessionId);
    };

    this.recognizer!.canceled = (s, e) => {
      const stop = () => {
        this.recognizer!.stopContinuousRecognitionAsync(
          () => {
            console.log("Stop continuous recognition.");
          },
          (err) => {
            console.warn(err);
          }
        );

        const parser = new SrtParser2();
        this.lines = parser.fromSrt(this.subtitle);
        onCompleted(this.lines);
      }

      if (CancellationReason.Error === e.reason) {
        console.warn(e.errorDetails);
        stop();
      }

      if (CancellationReason.EndOfStream === e.reason) {
        console.log("End of speech");
        stop();
      }
    }

    this.recognizer!.recognizing = (s, e) => {
      onRecognizing(e.result.text)
    }

    // 识别到一整句话说完之后执行
    this.recognizer!.recognized = (_, e) => {
      sequenceNumber = sequenceNumber + 1;

      const caption = getCaption(
        sequenceNumber,
        e.result,
        false, // Use . as decimal separator.
      );

      this.subtitle += caption;
      console.debug("RECOGNIZED: Text=" + e.result.text);
    }

    // 开始识别
    this.recognizer!.startContinuousRecognitionAsync(
      () => {
        console.log("Start continuous recognition ...");
      },
      (err) => {
        console.warn(err);
      }
    );
  }

  public static async checkPermission() {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        console.debug("grants", grants)
        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Permissions granted");
          return true;
        } else {
          console.log("Permissions denied");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    return true;
  }
}

export default Wav2SubtitleConverter;
