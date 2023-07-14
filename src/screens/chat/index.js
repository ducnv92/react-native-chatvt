import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  StyleSheet, Linking, PermissionsAndroid, Alert, ActivityIndicator, Keyboard
} from 'react-native';
import colors from '../../Styles';
// import EmojiPicker from 'rn-emoji-keyboard'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetModalProvider, useBottomSheetModal,
} from '../../components/bottomSheet/bottom-sheet';
import CameraRollPicker from '../../components/cameraRollPicker';
import chatStore from "./ChatStore";
import { Log, orderStatus } from "../../utils";
import appStore from "../AppStore";
import { observer } from "mobx-react-lite";
import ParsedText from 'react-native-parsed-text';
import ImageViewing from "../../components/imageView";
import { Navigation } from "react-native-navigation";

import { ChatItem } from "./Item";
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from '../../components/documentPicker'
import uuid from 'react-native-uuid';
import {AttachScreen}  from './Attach';
import { FlatList, ScrollView } from '../../components/flatlist';
import { MenuProvider } from 'react-native-popup-menu';
import {RecordButton} from "./RecordButton";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraRoll from "../../components/cameraRollPicker/CameraRoll";
import { SafeAreaView } from 'react-native-safe-area-context';


export const ChatScreen = observer(function ChatScreen(props) {
  const conversation = props.data;
  const [receiver, setReceiver] = useState({})
  const inputRef = useRef(null);

  useEffect(() => {
    chatStore.resetData()
    const listener = Navigation.events().registerNavigationButtonPressedListener(
      () => {
          chatStore.images = []
      }
    );

    chatStore.inputRef = ()=>{
      try{
        inputRef.current?.focus()
      }catch (e) {
        Log(e)
      }
    }
    return () => {
      listener.remove()
      chatStore.showAttachModal = false
    };
  }, []);


  useEffect(() => {
    let receiver = {}
    try {
      receiver = conversation.detail_participants.find(i => i.user_id !== appStore.user.user_id)
      setReceiver(receiver?receiver:{})
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



  const sendMessage = async () => {
    const message = {
      id: uuid.v4(),
      "type": "MESSAGE",
      "text": chatStore.input,
      "status": "sending",
      order_number: conversation.order_info?.order_number,
      sender: appStore.user.type + '_' + appStore.user.user_id,
      conversation_id: conversation._id
    }
    chatStore.data.unshift(message)
    await chatStore.sendMessage(message)
    chatStore.input = ''
  }

  const handlePresentModalPress = () => {
    Keyboard.dismiss()
    chatStore.showAttachModal = true
  };

  const sendImages = async () => {
    try{
      chatStore.showAttachModal = false

      try {
        if(Platform.OS === 'ios'){
          for (let i = 0; i < chatStore.images.length; i++) {
            const regex = /:\/\/(.{36})\//i;
            const result = chatStore.images[i].uri.match(regex);
            const photoDetail = await CameraRoll.getPhotoByInternalID(result[1], {})
            chatStore.images[i].uri = photoDetail.node.image.filepath
          }
        }
      }catch (e) {
        alert(e)
        console.log(e)
      }

      const message = {
        id: uuid.v4(),
        "type": "MESSAGE",
        attachmentLocal: chatStore.images,
        has_attachment: true,
        "attachment_ids": [],
        "text": '',
        "status": "sending",
        order_number: props.data.order_info?.order_number,
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: props.data._id
      }
      chatStore.data.unshift(message)
      await chatStore.sendMessage(message)
      chatStore.images = []
    }catch (e) {

    }
  }


  return <MenuProvider>
    <SafeAreaProvider  style={{ flex: 1}}>
  <SafeAreaView style={{ flex: 1 }}>
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
                conversation.type==='GROUP'?('Đơn '+conversation.order_numbers[0]) : (receiver.first_name + " " + receiver.last_name)
              }

              </Text>
              {/* <Image style={{ height: 10, width: 10, resizeMode: 'center', }} source={require('../../assets/ic_arrow_down.png')} /> */}

            </View>
            {
              conversation.type==='PAIR' &&
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 }}>
                <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: '#30F03B' }} />

                <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'white', textAlign: 'center' }}>{
                  conversation.type==='PAIR' && receiver.type === 'VTMAN' && appStore.lang.common.postman
                }
                </Text>
              </View>
            }

          </View>

          <TouchableOpacity
            style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'flex-end' }}>
            {/* <Image style={{ height: 18, width: 18, resizeMode: 'contain', marginRight: 16 }} source={require('../../assets/ic_call_out_white.png')} /> */}
          </TouchableOpacity>
        </View>
        <FlatList
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: 10,
            minIndexForVisible: 1,
          }}
          style={{ flex: 1, backgroundColor: 'white' }}
          data={chatStore.data}
          inverted={true}
          renderItem={({ item }) => <ChatItem item={item} conversation={conversation} />}
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={()=><View style={{height: 8}}/>}
          removeClippedSubviews={true}
          keyExtractor={(item) => item._id!==undefined?item._id: item.id}
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
          <View style={{width: 1, height: '100%'}}>
            <View style={{ width: 1, backgroundColor: '#DCE6F0', marginVertical: 14, flex: 1, }} />
          </View>
          <TextInput
            ref={inputRef}
            placeholder={appStore.lang.chat.input_message}
            placeholderTextColor={'#B5B4B8'}
            multiline={true}
            onChangeText={text =>{
              chatStore.input= text
            }}
            value={chatStore.input}
            style={{ fontSize: 15, color: colors.primaryText, flex: 1, minHeight: 56, paddingTop: 18, padding: 12,}}
          />
          {/*<TouchableOpacity*/}
          {/*  onPress={() => handleDocumentSelection()}*/}
          {/*  style={{ width: 40, height: 56, alignItems: 'center', justifyContent: 'center' }}>*/}
          {/*  <Image source={require('../../assets/nav_document.png')} style={{ height: 24, width: 24, resizeMode: "contain" }} />*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity*/}
          {/*  onPress={() => sendMap()}*/}
          {/*  style={{ width: 40, height: 56, alignItems: 'center', justifyContent: 'center' }}>*/}
          {/*  <Image source={require('../../assets/nav_location_active.png')} style={{ height: 24, width: 24, resizeMode: "contain" }} />*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity*/}
          {/*  onPress={()=>pickDocument()}*/}
          {/*  style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>*/}
          {/*  <Image source={require('../../assets/nav_document.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>*/}
          {/*</TouchableOpacity>*/}
          {
            chatStore.input.trim() !== '' &&
            <TouchableOpacity
              onPress={sendMessage}
              style={{ width: 40, height: 56, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../assets/ic_send.png')}
                style={{ height: 24, width: 24, resizeMode: "contain" }} />
            </TouchableOpacity>
          }
          {
            chatStore.input.trim() === '' &&
            <RecordButton
              {...props}
              style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../../assets/ic_microphone.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>
            </RecordButton>
          }
        </View>
      </KeyboardAvoidingView>
      {/*<EmojiPicker onEmojiSelected={onClickEmoji} open={showEmoji} onClose={() => setShowEmoji(false)} />*/}
      <AttachScreen {...props}/>
      {
        chatStore.images.length > 0 &&
        <TouchableOpacity
          onPress={sendImages}
          style={{ position: 'absolute', zIndex: 99999, bottom: 92 +useSafeAreaInsets().bottom, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16, margin: 16, backgroundColor: colors.primary, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{appStore.lang.chat.send}</Text>
        </TouchableOpacity>
      }
    </BottomSheetModalProvider>


  </SafeAreaView>
    </SafeAreaProvider>
  </MenuProvider>
})

