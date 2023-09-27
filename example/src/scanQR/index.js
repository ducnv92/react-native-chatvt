import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  StyleSheet, Linking, ActivityIndicator, Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Navigation } from 'react-native-navigation';
import {Button, TextInput} from 'react-native-paper'
import Image from 'react-native-fast-image';
import {chatVT} from 'react-native-chatvt';
import AsyncStorage from '@react-native-community/async-storage';
// import {BarcodeFormat, scanBarcodes, useScanBarcodes} from "vision-camera-code-scanner";
// import {Camera, useCameraDevices, useFrameProcessor} from "react-native-vision-camera";

import QRCodeScanner from 'react-native-qrcode-scanner';
import jwt_decode from "jwt-decode";
import listChatStore from "../../../src/screens/listchat/ListChatStore";

export const ScanQR =  observer(function ScanQR ( props){
  const [reactive, setReactive] = useState(true)

  const  onSuccess = async (e) =>{
    console.log('ScanQR', e.data)
    // alert(JSON.stringify(e.data))
    try{
      var decoded = jwt_decode(e.data, { header: true });
      console.log('decoded', decoded)

      if(decoded?.conversation_id) {
        setReactive(false)
        chatVT.toConversation(props.componentId, decoded?.conversation_id)
      }
    }catch (e) {
      alert(e)
    }

    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  }

  useEffect(()=>{
    Navigation.events().registerComponentDidAppearListener(
      ({ componentId, componentName, passProps }) => {
        console.log('componentName', componentName)
        setReactive(componentName === 'Admin.ScanQR')
      }
    )
  }, [])

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
          reactive &&
          <QRCodeScanner
            reactivate={true}
            onRead={onSuccess}
          />

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
