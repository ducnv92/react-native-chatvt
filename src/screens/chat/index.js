import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  StyleSheet, Linking, PermissionsAndroid, Alert, ActivityIndicator
} from 'react-native';
import colors from '../../Styles';
// import EmojiPicker from 'rn-emoji-keyboard'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import CameraRollPicker from '../../components/cameraRollPicker';
import chatStore from "./ChatStore";
import { Log, orderStatus } from "../../utils";
import appStore from "../AppStore";
import { observer } from "mobx-react-lite";
import ParsedText from 'react-native-parsed-text';
import ImageViewing from "../../components/imageView";
import { Navigation } from "react-native-navigation";

import { ChatItem } from "./Item";
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from '../../components/documentPicker'
import uuid from 'react-native-uuid';

export const ChatScreen = observer(function ChatScreen(props) {
  const conversation = props.data;
  const [input, setInput] = useState('')
  const [receiver, setReceiver] = useState({})
  const [showEmoji, setShowEmoji] = useState(false);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    Log('handleSheetChanges', index);
  }, []);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.xls, types.docx, types.xlsx],
        allowMultiSelection: true
      });

      const message = {
        id: uuidv4(),
        "type": "DOCUMENT",
        attachmentLocal: response,
        has_attachment: true,
        "text": input,
        "status": "sending",
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: conversation._id
      }
      console.log('document', message);
      chatStore.data.unshift(message)
      // chatStore.sendMessage(message)
      setInput('')
    } catch (err) {
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    let receiver = {}
    try {
      receiver = conversation.detail_participants.find(i => i.user_id !== appStore.user.user_id)
      setReceiver(receiver)
    } catch (e) {

    }
    chatStore.page = 0
    chatStore.getData({
      conversation_id: conversation?._id
    })
    Log('_id', conversation)
  }, [])

  const handleLoadMore = () => {
    chatStore.getData({
      conversation_id: conversation._id
    })
  }



  const sendMessage = () => {
    const message = {
      id: uuid.v4(),
      "type": "MESSAGE",
      "text": input,
      "status": "sending",
      order_number: conversation.order_info?.order_number,
      sender: appStore.user.type + '_' + appStore.user.user_id,
      conversation_id: conversation._id
    }
    chatStore.data.unshift(message)
    chatStore.sendMessage(message)
    // messages.unshift()
    // setMessages(messages)
    setInput('')
  }

  const pickDocument = () => {
    DocumentPicker.pick({
      allowMultiSelection: true,
    })
      .then((res)=>{
        console.log(res)

        const message = {
          id: uuid.v4(),
          _id: uuid.v4(),
          type: "FILE",
          has_attachment: true,
          attachmentLocal: res,
          status: "sending",
          order_number: conversation.order_info?.order_number,
          sender: appStore.user.type + '_' + appStore.user.user_id,
          conversation_id: conversation._id
        }
        chatStore.data.unshift(message)
        chatStore.sendMessage(message)
        setInput('')
      })
      .catch((res)=>{
        console.log(res)
      })
  }
  const sendMap = () => {
    const permission = Platform.OS ==='android'?PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION:PERMISSIONS.IOS.LOCATION_WHEN_IN_USE

    request(permission).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              const message = {
                id: uuid.v4(),
                type: "LOCATION",
                location: {
                  longitude: position.coords.longitude,
                  latitude: position.coords.latitude,
                },
                status: "sending",
                sender: appStore.user.type + '_' + appStore.user.user_id,
                conversation_id: conversation._id
              }
              console.log('map', message)
              chatStore.data.unshift(message)
              chatStore.sendMessage(message)
              setInput('')
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );

          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    });


  }


  const onClickEmoji = emoji => {
    Log(emoji);
    setInput(input + emoji.emoji)
  };

  const requestCameraPermission = async () => {
    try {
      let permission = ''
      if(Platform.OS === 'android'){
        permission = Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }else{
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      }


      request(permission).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            bottomSheetRef.current?.present();

            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      });



      // const granted = await PermissionsAndroid.request(permission);
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   Log('You can use the camera');
      //   bottomSheetRef.current?.present();
      //
      // } else {
      //   Log('Camera permission denied');
      // }

    } catch (err) {
      Log(err);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    requestCameraPermission()
  }, []);

  const sendImages = async () => {
    try{
      bottomSheetRef.current?.dismiss();

      const message = {
        id: uuid.v4(),
        "type": "MESSAGE",
        attachmentLocal: chatStore.images,
        has_attachment: true,
        "attachment_ids": [],
        "text": '',
        "status": "sending",
        order_number: conversation.order_info?.order_number,
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: conversation._id
      }
      chatStore.data.unshift(message)
      chatStore.sendMessage(message)
      chatStore.images = []
    }catch (e) {
      console.log(e)
    }
  }

  return <SafeAreaView style={{ flex: 1 }}>
    <BottomSheetModalProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, }}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: colors.primary, }}>
          <TouchableOpacity
            onPress={() => Navigation.pop(props.componentId)}
            style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ height: 36, width: 36, resizeMode: 'contain', }}
              source={require('../../assets/ic_back.png')} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={{ fontWeight: '600', fontSize: 17, color: 'white', gap: 7 }}>{
                receiver.first_name + " " + receiver.last_name
              }

              </Text>
              {/* <Image style={{ height: 10, width: 10, resizeMode: 'center', }} source={require('../../assets/ic_arrow_down.png')} /> */}

            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 }}>
              <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: '#30F03B' }} />

              <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'white', textAlign: 'center' }}>{
                receiver.type === 'VTMAN' && appStore.lang.common.postman
              }
              </Text>
            </View>

          </View>

          <TouchableOpacity
            style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'flex-end' }}>
            {/* <Image style={{ height: 18, width: 18, resizeMode: 'contain', marginRight: 16 }} source={require('../../assets/ic_call_out_white.png')} /> */}
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ flex: 1, backgroundColor: 'white' }}
          data={chatStore.data}
          inverted={true}
          renderItem={({ item }) => <ChatItem item={item} />}
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          keyExtractor={(item) => item._id}
          refreshing={chatStore.isLoading}
          onRefresh={() => {
            chatStore.page = 0;
            chatStore.getData({
              conversation_id: conversation._id
            })
          }}
        />
        <View style={{
          minHeight: 56,
          backgroundColor: '#F8F8FA',
          flexDirection: 'row',
          alignItems: 'flex-end',
          borderTopWidth: 1,
          borderColor: '#DCE6F0'
        }}>
          <TouchableOpacity
            onPress={handlePresentModalPress}
            style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/ic_attach.png')}
              style={{ height: 24, width: 24, resizeMode: "contain" }} />
          </TouchableOpacity>
          <View style={{ width: 1, backgroundColor: 'red', marginVertical: 14 }} />
          <TextInput
            placeholder={appStore.lang.chat.input_message}
            placeholderTextColor={'#B5B4B8'}
            multiline={true}
            onChangeText={text => setInput(text)}
            value={input}
            style={{ fontSize: 15, color: colors.primaryText, flex: 1, minHeight: 56, paddingTop: 18,   }}
          />
          <TouchableOpacity
            onPress={() => handleDocumentSelection()}
            style={{ width: 40, height: 56, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/nav_document.png')} style={{ height: 24, width: 24, resizeMode: "contain" }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => sendMap()}
            style={{ width: 40, height: 56, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/nav_location_active.png')} style={{ height: 24, width: 24, resizeMode: "contain" }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>pickDocument()}
            style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../../assets/nav_document.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>
          </TouchableOpacity>
          {
            input.trim() !== '' &&
            <TouchableOpacity
              onPress={sendMessage}
              style={{ width: 40, height: 56, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../assets/ic_send.png')}
                style={{ height: 24, width: 24, resizeMode: "contain" }} />
            </TouchableOpacity>
            // <TouchableOpacity
            //   style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>
            //   <Image source={require('../../assets/ic_microphone.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>
            // </TouchableOpacity>
          }
        </View>
      </KeyboardAvoidingView>
      {/*<EmojiPicker onEmojiSelected={onClickEmoji} open={showEmoji} onClose={() => setShowEmoji(false)} />*/}
      <BottomSheetModal
        ref={bottomSheetRef}
        // index={0}
        bottomInset={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          chatStore.images = []
        }}
      >
        <CameraRollPicker
          assetType={'All'}
          include={['playableDuration']}
          selected={chatStore.images}
          callback={(images) => {
            console.log('image picked', images)
            chatStore.images = images
          }} />

      </BottomSheetModal>
    </BottomSheetModalProvider>
    {
      chatStore.images.length > 0 &&
      <TouchableOpacity
        onPress={sendImages}
        style={{ position: 'absolute', bottom: 16, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16, margin: 16, backgroundColor: colors.primary, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{appStore.lang.chat.send}</Text>
      </TouchableOpacity>
    }

  </SafeAreaView>

})

