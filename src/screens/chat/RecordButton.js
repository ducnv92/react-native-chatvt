import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import { Log, requestPermission } from '../../utils';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import colors from '../../Styles';
import appStore from '../AppStore';
import AudioRecorderPlayer from '../../components/audioRecord/index';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import DocumentPicker, { types } from '../../components/documentPicker';
import { MText as Text } from '../../components';
import {
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType, AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType
} from "../../components/audioRecord/index.android";
import AnimatedSoundBars from "../../components/waveView";

export class RecordButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileRecorded: undefined,
      isRecording: false,
      actionRecord: false,
      isPlay: false,
      recordSecs: 0,
      layout: { x: 0 },
      recordTime: '00:00',
    };
    this.path = Platform.select({
      ios: uuid.v4() + '.m4a',
      android: `${RNFS.CachesDirectoryPath}/${uuid.v4() + '.mp3'}`,
    });
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  componentWillUnmount() {
    try {
      this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
    } catch (e) { }
  }

  startRecord = async () => {
    try {
      requestPermission(
        Platform.OS === 'android'
          ? [
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ]
          : [PERMISSIONS.IOS.MICROPHONE],
        async () => {
          this.setState({
            actionRecord: true,
          });

          const result = await this.audioRecorderPlayer.startRecorder(
            this.path,
            {
              AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
              AudioSourceAndroid: AudioSourceAndroidType.MIC,
              AVModeIOS: AVModeIOSOption.measurement,
              AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
              AVNumberOfChannelsKeyIOS: 2,
              AVFormatIDKeyIOS: AVEncodingOption.aac,
            }
          );
          this.audioRecorderPlayer.addRecordBackListener((e) => {
            this.setState({
              isRecording:
                Platform.OS === 'ios'
                  ? e.current_position !== undefined
                  : e.currentPosition !== undefined,
              recordSecs: e.currentPosition,
              recordTime: this.audioRecorderPlayer.mmssss(
                Math.floor(
                  Platform.OS === 'ios'
                    ? Number(e.current_position)
                    : e.currentPosition
                )
              ),
            });
            return;
          });
        }
      );
    } catch (e) { }
  };

  sendRecorded = async () => {
    try {
      const message = {
        id: uuid.v4(),
        type: 'VOICE',
        attachmentLocal: [
          {
            uri: this.state.fileRecorded,
            extension: 'mp3',
            name: uuid.v4() + '.mp3',
          },
        ],
        has_attachment: true,
        text: '',
        status: 'sending',
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: this.props.data._id,
      };

      chatStore.data  = [message, ...chatStore.data];
      await chatStore.sendMessage(message);

      this.setState({
        isRecording: false,
        actionRecord: false,
        fileRecorded: undefined,
        recordSecs: 0,
        layout: { x: 0 },
        recordTime: '00:00',
      });
    } catch (err) {
      console.warn(err);
    }
  };

  onStopRecord = async () => {
    try {
      try{
        this.soundbarRef.stop()
      }catch (e) {

      }
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      if (result && result.includes('file://')) {
        this.setState({
          isRecording: false,
          fileRecorded: result,
          recordSecs: 0,
        });
      } else {
        this.setState({
          isRecording: false,
          fileRecorded: undefined,
          recordSecs: 0,
        });
      }
    } catch (e) {
    }
  };

  onStartPlay = async () => {
    try{
      this.soundbarRef.play()
    }catch (e) {

    }
    const msg = await this.audioRecorderPlayer.startPlayer(
      this.state.fileRecorded
    );

    this.audioRecorderPlayer.addPlayBackListener((e) => {
      this.setState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition)
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async () => {
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };

  render() {
    return (
      <>
        {
          <TouchableOpacity
            {...this.props}
            onLayout={({ nativeEvent }) => {
              this.setState({
                layout: nativeEvent,
              });
            }}
            onPress={() => {
              if (this.state.isRecording) {
                this.onStopRecord();
              } else {
                this.startRecord();
              }
            }}
            style={{
              width: 56,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {this.props.children}
          </TouchableOpacity>
        }
        {this.state.actionRecord && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 56,
              width: '100%',
              backgroundColor: '#F8F8FA',
              position: 'absolute',
              top: this.state.layout?.x,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                try {
                  try {
                    this.onStopRecord();
                  } catch (e) {
                    console.log(e);
                  }
                  try {
                    await RNFS.unlink(this.state.fileRecorded)
                      .then(() => {
                        console.log('FILE DELETED');
                      })
                      // `unlink` will throw an error, if the item to unlink does not exist
                      .catch((err) => {
                      });
                  } catch (e) {
                    console.log(e);
                  }
                  this.setState({
                    fileRecorded: undefined,
                    isRecording: false,
                    actionRecord: false,
                    recordSecs: 0,
                    recordTime: '00:00',
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
              style={{
                width: 56,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {
                <Image
                  source={require('../../assets/ic_trash_primary.png')}
                  style={{ height: 24, width: 24, resizeMode: 'contain' }}
                />
              }
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                if (this.state.isRecording) {
                  this.onStopRecord();
                } else {
                  this.onStartPlay();
                }
              }}
              style={{
                width: 56,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../../assets/ic_pause.png')}
                style={{ height: 24, width: 24, resizeMode: 'contain' }}
              />
            </TouchableOpacity> */}
            {/*<Image*/}
            {/*  source={require('../../assets/ic_wave.png')}*/}
            {/*  style={{ flex: 1, height: 32, resizeMode: 'contain' }}*/}
            {/*/>*/}
            <AnimatedSoundBars isPlay={true} barColor={colors.primary} length={20}/>

            <View
              style={{
                width: 56,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 15,
                  color: colors.neutralText,
                }}
              >
                {this.state.recordTime}
              </Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                await this.onStopRecord()
                if (this.state.fileRecorded && !this.state.isRecording) {
                  this.sendRecorded();
                  this.setState({
                    isRecording: false,
                    actionRecord: false,
                  });
                }
              }}
              style={{
                width: 56,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {this.state.isRecording && (
                <Image
                  source={require('../../assets/ic_send.png')}
                  style={{ height: 24, width: 24, resizeMode: 'contain' }}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }
}
