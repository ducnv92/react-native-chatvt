import type {EmitterSubscription} from 'react-native';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
const { RNAudioRecorderPlayerChatVT } = NativeModules;

export enum AudioSourceAndroidType {
  DEFAULT = 0,
  MIC,
  VOICE_UPLINK,
  VOICE_DOWNLINK,
  VOICE_CALL,
  CAMCORDER,
  VOICE_RECOGNITION,
  VOICE_COMMUNICATION,
  REMOTE_SUBMIX,
  UNPROCESSED,
  RADIO_TUNER = 1998,
  HOTWORD,
}

export enum OutputFormatAndroidType {
  DEFAULT = 0,
  THREE_GPP,
  MPEG_4,
  AMR_NB,
  AMR_WB,
  AAC_ADIF,
  AAC_ADTS,
  OUTPUT_FORMAT_RTP_AVP,
  MPEG_2_TS,
  WEBM,
}

export enum AudioEncoderAndroidType {
  DEFAULT = 0,
  AMR_NB,
  AMR_WB,
  AAC,
  HE_AAC,
  AAC_ELD,
  VORBIS,
}

export enum AVEncodingOption {
  lpcm = 'lpcm',
  ima4 = 'ima4',
  aac = 'aac',
  MAC3 = 'MAC3',
  MAC6 = 'MAC6',
  ulaw = 'ulaw',
  alaw = 'alaw',
  mp1 = 'mp1',
  mp2 = 'mp2',
  mp4 = 'mp4',
  alac = 'alac',
  amr = 'amr',
  flac = 'flac',
  opus = 'opus',
}

type AVEncodingType =
  | AVEncodingOption.lpcm
  | AVEncodingOption.ima4
  | AVEncodingOption.aac
  | AVEncodingOption.MAC3
  | AVEncodingOption.MAC6
  | AVEncodingOption.ulaw
  | AVEncodingOption.alaw
  | AVEncodingOption.mp1
  | AVEncodingOption.mp2
  | AVEncodingOption.mp4
  | AVEncodingOption.alac
  | AVEncodingOption.amr
  | AVEncodingOption.flac
  | AVEncodingOption.opus;

export enum AVModeIOSOption {
  gamechat = 'gamechat',
  measurement = 'measurement',
  movieplayback = 'movieplayback',
  spokenaudio = 'spokenaudio',
  videochat = 'videochat',
  videorecording = 'videorecording',
  voicechat = 'voicechat',
  voiceprompt = 'voiceprompt',
}

export type AVModeIOSType =
  | AVModeIOSOption.gamechat
  | AVModeIOSOption.measurement
  | AVModeIOSOption.movieplayback
  | AVModeIOSOption.spokenaudio
  | AVModeIOSOption.videochat
  | AVModeIOSOption.videorecording
  | AVModeIOSOption.voicechat
  | AVModeIOSOption.voiceprompt;

export enum AVEncoderAudioQualityIOSType {
  min = 0,
  low = 32,
  medium = 64,
  high = 96,
  max = 127,
}

export enum AVLinearPCMBitDepthKeyIOSType {
  'bit8' = 8,
  'bit16' = 16,
  'bit24' = 24,
  'bit32' = 32,
}

export interface AudioSet {
  AVSampleRateKeyIOS?: number;
  AVFormatIDKeyIOS?: AVEncodingType;
  AVModeIOS?: AVModeIOSType;
  AVNumberOfChannelsKeyIOS?: number;
  AVEncoderAudioQualityKeyIOS?: AVEncoderAudioQualityIOSType;
  AudioSourceAndroid?: AudioSourceAndroidType;
  AVLinearPCMBitDepthKeyIOS?: AVLinearPCMBitDepthKeyIOSType;
  AVLinearPCMIsBigEndianKeyIOS?: boolean;
  AVLinearPCMIsFloatKeyIOS?: boolean;
  AVLinearPCMIsNonInterleavedIOS?: boolean;
  OutputFormatAndroid?: OutputFormatAndroidType;
  AudioEncoderAndroid?: AudioEncoderAndroidType;
  AudioEncodingBitRateAndroid?: number;
  AudioSamplingRateAndroid?: number;
}

const pad = (num: number): string => {
  return ('0' + num).slice(-2);
};

export type RecordBackType = {
  isRecording?: boolean;
  currentPosition: number;
  currentMetering?: number;
};

export type PlayBackType = {
  isMuted?: boolean;
  currentPosition: number;
  duration: number;
};

class AudioRecorderPlayer {
  private _isRecording: boolean | undefined;
  private _isPlaying: boolean | undefined;
  private _hasPaused: boolean | undefined;
  private _hasPausedRecord: boolean | undefined;
  private _recorderSubscription: EmitterSubscription | undefined | null;
  private _playerSubscription: EmitterSubscription | undefined;
  private _playerCallback: ((event: PlayBackType) => void) | undefined | null;

  mmss = (secs: number): string => {
    let minutes = Math.floor(secs / 60);

    secs = secs % 60;
    minutes = minutes % 60;

    return pad(minutes) + ':' + pad(secs);
  };

  mmssss = (milisecs: number): string => {
    const secs = Math.floor(milisecs / 1000);
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    const miliseconds = Math.floor((milisecs % 1000) / 10);

    return pad(minutes) + ':' + pad(seconds) + ':' + pad(miliseconds);
  };

  /**
   * Set listerner from native module for recorder.
   * @returns {callBack((e: RecordBackType): void)}
   */

  addRecordBackListener = (
    callback: (recordingMeta: RecordBackType) => void,
  ): void => {
    if (Platform.OS === 'android') {
      this._recorderSubscription = DeviceEventEmitter.addListener(
        'rn-recordback',
        callback,
      );
    } else {
      const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayerChatVT);

      this._recorderSubscription = myModuleEvt.addListener(
        'rn-recordback',
        callback,
      );
    }
  };

  /**
   * Remove listener for recorder.
   * @returns {void}
   */
  removeRecordBackListener = (): void => {
    if (this._recorderSubscription) {
      this._recorderSubscription.remove();
      this._recorderSubscription = null;
    }
  };

  /**
   * Set listener from native module for player.
   * @returns {callBack((e: PlayBackType): void)}
   */
  addPlayBackListener = (
    callback: (playbackMeta: PlayBackType) => void,
  ): void => {
    this._playerCallback = callback;
  };

  /**
   * remove listener for player.
   * @returns {void}
   */
  removePlayBackListener = (): void => {
    this._playerCallback = null;
  };

  /**
   * start recording with param.
   * @param {string} uri audio uri.
   * @returns {Promise<string>}
   */
  startRecorder = async (
    uri?: string,
    audioSets?: AudioSet,
    meteringEnabled?: boolean,
  ): Promise<string> => {
    if (!this._isRecording) {
      this._isRecording = true;

      return RNAudioRecorderPlayerChatVT.startRecorder(
        uri ?? 'DEFAULT',
        audioSets,
        meteringEnabled ?? false,
      );
    }

    return 'Already recording';
  };

  /**
   * Pause recording.
   * @returns {Promise<string>}
   */
  pauseRecorder = async (): Promise<string> => {
    if (!this._hasPausedRecord) {
      this._hasPausedRecord = true;

      return RNAudioRecorderPlayerChatVT.pauseRecorder();
    }

    return 'Already paused recording.';
  };

  /**
   * Resume recording.
   * @returns {Promise<string>}
   */
  resumeRecorder = async (): Promise<string> => {
    if (this._hasPausedRecord) {
      this._hasPausedRecord = false;

      return RNAudioRecorderPlayerChatVT.resumeRecorder();
    }

    return 'Currently recording.';
  };

  /**
   * stop recording.
   * @returns {Promise<string>}
   */
  stopRecorder = async (): Promise<string> => {
    if (this._isRecording) {
      this._isRecording = false;
      this._hasPausedRecord = false;

      return RNAudioRecorderPlayerChatVT.stopRecorder();
    }

    return 'Already stopped';
  };

  /**
   * Resume playing.
   * @returns {Promise<string>}
   */
  resumePlayer = async (): Promise<string> => {
    if (!this._isPlaying) {
      return 'No audio playing';
    }

    if (this._hasPaused) {
      this._hasPaused = false;

      return RNAudioRecorderPlayerChatVT.resumePlayer();
    }

    return 'Already playing';
  };

  playerCallback = (event: PlayBackType): void => {
    if (this._playerCallback) {
      this._playerCallback(event);
    }

    if (event.currentPosition === event.duration) {
      this.stopPlayer();
    }
  };

  // @ts-ignore
  /**
   * Start playing with param.
   * @param {string} uri audio uri.
   * @param {Record<string, string>} httpHeaders Set of http headers.
   * @returns {Promise<string>}
   */
    // @ts-ignore
  startPlayer = async (uri?: string, httpHeaders?: Record<string, string>): Promise<string> => {
    if (!uri) {
      uri = 'DEFAULT';
    }

    if (!this._playerSubscription) {
      if (Platform.OS === 'android') {
        this._playerSubscription = DeviceEventEmitter.addListener(
          'rn-playback',
          this.playerCallback,
        );
      } else {
        const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayerChatVT);

        this._playerSubscription = myModuleEvt.addListener(
          'rn-playback',
          this.playerCallback,
        );
      }
    }

    if (!this._isPlaying || this._hasPaused) {
      this._isPlaying = true;
      this._hasPaused = false;

      return RNAudioRecorderPlayerChatVT.startPlayer(uri, httpHeaders);
    }
  };

  /**
   * Stop playing.
   * @returns {Promise<string>}
   */
  stopPlayer = async (): Promise<string> => {
    if (this._isPlaying) {
      this._isPlaying = false;
      this._hasPaused = false;

      return RNAudioRecorderPlayerChatVT.stopPlayer();
    }

    return 'Already stopped playing';
  };

  /**
   * Pause playing.
   * @returns {Promise<string>}
   */
    // @ts-ignore
  pausePlayer = async (): Promise<string> => {
    if (!this._isPlaying) {
      return 'No audio playing';
    }

    if (!this._hasPaused) {
      this._hasPaused = true;

      return RNAudioRecorderPlayerChatVT.pausePlayer();
    }
  };

  /**
   * Seek to.
   * @param {number} time position seek to in millisecond.
   * @returns {Promise<string>}
   */
  seekToPlayer = async (time: number): Promise<string> => {
    return RNAudioRecorderPlayerChatVT.seekToPlayer(time);
  };

  /**
   * Set volume.
   * @param {number} setVolume set volume.
   * @returns {Promise<string>}
   */
  setVolume = async (volume: number): Promise<string> => {
    if (volume < 0 || volume > 1) {
      throw new Error('Value of volume should be between 0.0 to 1.0');
    }

    return RNAudioRecorderPlayerChatVT.setVolume(volume);
  };

  /**
   * Set subscription duration. Default is 0.5.
   * @param {number} sec subscription callback duration in seconds.
   * @returns {Promise<string>}
   */
  setSubscriptionDuration = async (sec: number): Promise<string> => {
    return RNAudioRecorderPlayerChatVT.setSubscriptionDuration(sec);
  };
}

export default AudioRecorderPlayer;
