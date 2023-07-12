import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import {Log, requestPermission} from '../../utils';
import { Dimensions, FlatList, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import colors from '../../Styles';
import appStore from '../AppStore';
import AudioRecorderPlayer from '../../components/audioRecord';

export class RecordButton extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      recordSecs: 0,
      recordTime: "00:00"
    }
    this.audioRecorderPlayer =  new AudioRecorderPlayer();
    console.log('RecordButton')

  }

  componentWillUnmount() {
    try {
      this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
    }catch (e) {
      console.log(e)
    }
  }



  startRecord = async () => {
    console.log('RecordButton')
    try{
      requestPermission(Platform.OS==='android'?[PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]:[PERMISSIONS.IOS.MICROPHONE], async()=>{
        console.log('startRecord');
        const result = await this.audioRecorderPlayer.startRecorder();
        this.audioRecorderPlayer.addRecordBackListener((e) => {
          console.log(e)
          this.setState({
            recordSecs: e.currentPosition,
            recordTime: this.audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition),
            ),
          });
          return;
        });
        console.log(result);
      })
    }catch (e) {
      console.log(e)
    }



  }

  onStopRecord = async () => {
    console.log('onStopRecord');
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  };

  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await this.audioRecorderPlayer.startPlayer();
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      console.log(e)
      this.setState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };

  render() {
    return(<>
      {
        <TouchableOpacity
          onPress={()=>{
            // if(this.audioRecorderPlayer.is)
            this.startRecord()
          }}
          style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/ic_microphone.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>
        </TouchableOpacity>
      }

    </>)
  }
}
