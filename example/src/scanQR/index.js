import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Navigation } from 'react-native-navigation';
import {Button, TextInput} from 'react-native-paper'
import Image from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import {BarcodeFormat, scanBarcodes, useScanBarcodes} from "vision-camera-code-scanner";
import {Camera, useCameraDevices, useFrameProcessor} from "react-native-vision-camera";



export const ScanQR =  observer(function ScanQR ( props){

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
  //   checkInverted: true,
  // });

  // Alternatively you can use the underlying function:
  //
  const frameProcessor = useFrameProcessor((frame) => {
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
    console.log(detectedBarcodes)
  }, []);



  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log(status)
      setHasPermission(status === 'authorized');
    })();
  }, []);

  return (

      <View style={{flex: 1,}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 64,
            backgroundColor: '#EE0033',
          }}
        >
          <TouchableOpacity
            onPress={() => Navigation.pop(props.componentId)}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ height: 36, width: 36, resizeMode: 'contain' }}
              source={require('../assets/ic_back.png')}
            />
          </TouchableOpacity>

            <Text style={{ fontFamily: "SVN-GilroySemiBold", position: 'absolute', textAlign: 'center', width: '100%', alignSelf: 'center',  fontSize: 16, color: "white"}}>Quét mã QR</Text>
        </View>
        {
          (device != null &&
          hasPermission )? ( <Camera
            style={{flex: 1,}}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />    ):
            <ActivityIndicator color={'#EE0033'} style={{margin: 24}}/>
        }

      </View>
  );
})
const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
