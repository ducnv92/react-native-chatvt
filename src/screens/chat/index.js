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
import { Image as ImageC, uuidv4 } from 'react-native-compressor';
import { Navigation } from "react-native-navigation";

import {ChatItem} from "./Item";



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
      id: uuidv4(),
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

  const onClickEmoji = emoji => {
    Log(emoji);
    setInput(input + emoji.emoji)
  };

  const requestCameraPermission = async () => {
    try {
      const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Log('You can use the camera');
        bottomSheetRef.current?.present();

      } else {
        Log('Camera permission denied');
      }

    } catch (err) {
      Log(err);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    requestCameraPermission()
  }, []);

  const sendImages = async () => {
    bottomSheetRef.current?.dismiss();

    const message = {
      request_id: uuidv4(),
      "type": "MESSAGE",
      attachmentLocal: chatStore.images.map(i => i.uri),
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
          renderItem={({item})=><ChatItem item={item}/>}
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
            style={{ fontSize: 15, color: colors.primaryText, flex: 1 }}
          />
          {/*<TouchableOpacity*/}
          {/*  onPress={()=>setShowEmoji(true)}*/}
          {/*  style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>*/}
          {/*  <Image source={require('../../assets/ic_emoj.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>*/}
          {/*</TouchableOpacity>*/}
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

