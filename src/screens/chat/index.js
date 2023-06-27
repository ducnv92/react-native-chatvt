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
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { createThumbnail } from "react-native-create-thumbnail";

const VideoItem = function (props) {
  const [thumbnail, setThumbnail] = useState('')
  const [isPause, setIsPause] = useState(true)
  useEffect(() => {
    const createThumb = async () => {
      console.log('createThumbnail', props.url)

      const fileName = props.url.slice(props.url.lastIndexOf('/') + 1, props.url.length)

      const response = await createThumbnail({ url: props.url, format: 'jpeg', cacheName: fileName, timeStamp: 0 })
      console.log('createThumbnail', response)
      setThumbnail(response.path)

    }

    createThumb()
    return () => {
      setIsPause(true)
      console.log("cleaned up");
    };
  }, [])

  return (
    <View>
      {
        isPause ?
          <View style={props.style}>
            {!thumbnail ? (
              <ActivityIndicator size="large" />
            ) : (
              <TouchableOpacity
                onPress={() => setIsPause(false)}
              >
                <FastImage
                  style={props.style}
                  source={thumbnail ? { uri: thumbnail } : {}}
                />
              </TouchableOpacity>
            )}
          </View>
          :
          <TouchableOpacity
            onPress={() => setIsPause(true)}
          >
            <Video
              source={{ uri: props.url }}
              resizeMode={'contain'}
              paused={isPause}
              allowsExternalPlayback
              poster={thumbnail}
              style={props.style}
            >

            </Video>
          </TouchableOpacity>

      }
    </View>
  )
}


export const ChatScreen = observer(function ChatScreen(props) {
  const conversation = props.data;
  const [input, setInput] = useState('')
  const [receiver, setReceiver] = useState({})
  const [images, setImages] = useState([])
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

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

  const handleUrlPress = (url, matchIndex) => {
    Linking.openURL(url);
  }

  const handlePhonePress = (phone, matchIndex /*: number*/) => {
    // alert(`${phone} has been pressed!`);
  }

  const handleNamePress = (name, matchIndex /*: number*/) => {
    // alert(`Hello ${name}`);
  }

  const handleEmailPress = (email, matchIndex /*: number*/) => {
    // alert(`send email to ${email}`);
  }


  const renderText = (matchingString, matches) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }


  const renderItem = ({ item, index }) => {
    let right = item.sender === (appStore.user.type + '_' + appStore.user.user_id);
    if (item.type === 'MESSAGE') {


      if (item.has_attachment) {
        return <View style={{ marginVertical: 8, marginHorizontal: 16, }}>
          <View style={{ flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            {
              item.status === 'error' && right &&
              <Image source={require('../../assets/ic_send_error.png')}
                style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 14 }} />
            }

            <View style={{ borderRadius: 10, overflow: 'hidden', maxWidth: '75%', }}>
              {
                item.attachmentLocal && (
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: right ? 'flex-end' : 'flex-start',
                  }}>
                    {
                      item.attachmentLocal.map(attach => {

                        if (attach.includes('jpg') || attach.includes('png') || attach.includes('jpeg')) {
                          return <Image source={{ uri: attach }} style={{
                            backgroundColor: "#F2F2F2",
                            borderRadius: 5,
                            overflow: 'hidden',
                            width: item.attachmentLocal.length === 1 ? 200 : 120,
                            height: item.attachmentLocal.length === 1 ? 200 : 120
                          }} />
                        }
                        if (attach.includes('.mov') || attach.includes('.mp4')) {
                          return (<VideoItem source={{ uri: attach }}
                            url={attach}
                            resizeMode={'contain'}
                            allowsExternalPlayback
                            style={{
                              width: 200,
                              height: 200,
                              backgroundColor: '#f2f2f2',
                              borderRadius: 10,
                              marginVertical: 16
                            }}
                          >

                          </VideoItem>)
                        }
                        return <View />
                      })
                    }
                  </View>
                )
              }
              {
                item.attachments && (
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: right ? 'flex-end' : 'flex-start',
                  }}>
                    {
                      item.attachments.map(attach => {

                        if (attach.url.includes('jpg') || attach.url.includes('png') || attach.url.includes('jpeg')) {
                          return <TouchableOpacity
                            key={attach.url}
                            onPress={() => {
                              setImages([
                                {
                                  uri: attach.url
                                }
                              ])
                              setImageVisible(
                                true
                              )
                            }}>

                            <Image source={{ uri: attach.url }} style={{
                              borderWidth: 0.5,
                              borderColor: '#f2f2f2',
                              backgroundColor: "#F2F2F2",
                              borderRadius: 5,
                              overflow: 'hidden',
                              width: item.attachments.length === 1 ? 200 : 120,
                              height: item.attachments.length === 1 ? 200 : 120
                            }} />
                          </TouchableOpacity>
                        }

                        if (attach.url.includes('-mov') || attach.url.includes('-mp4')) {
                          return <VideoItem url={attach.url}
                            style={{
                              backgroundColor: "#F2F2F2",
                              borderRadius: 5,
                              overflow: 'hidden',
                              width: item.attachments.length === 1 ? 200 : 120,
                              height: item.attachments.length === 1 ? 200 : 120
                            }} />
                        }

                      })
                    }
                  </View>
                )
              }
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            <Text style={{
              fontWeight: '400',
              fontSize: 10,
              color: colors.neutralText,
              marginTop: 4,
              textAlign: right ? 'right' : 'left'
            }}>{new Date(item.created_at).getFullYear() < new Date().getFullYear() ? moment(item.created_at).format('DD/MM/YYYY') : moment(item.created_at).fromNow().includes('days') ? `${moment(item.created_at).format('DD/MM')}` : moment(item.created_at).fromNow().includes('day') ? `${moment(item.created_at).format('DD/MM')}` : moment(item.created_at).format('HH:mm')}</Text>
          </View>
          {/*{*/}
          {/*  item.status ==='sending' &&*/}
          {/*  <Text style={{fontWeight: '500', fontSize: 15, color: colors.neutralText,  marginTop: 8, textAlign: right?'right': 'left'}}>{'Đang gửi...'}</Text>*/}
          {/*}*/}
          {
            item.status === 'error' &&
            <Text style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.primary,
              marginTop: 8,
              textAlign: right ? 'right' : 'left'
            }}>{appStore.lang.chat.send_error}</Text>
          }
        </View>

      }

      return (
        <View style={{ marginVertical: 8, marginHorizontal: 16, }}>
          <View style={{ flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            {
              item.status === 'error' && right &&
              <Image source={require('../../assets/ic_send_error.png')}
                style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 14 }} />
            }
            <View style={{
              backgroundColor: appStore.appId === 'VTPost' ? (right ? colors.primary : "#F2F2F2") : (right ? colors.bgVTM : "#F2F2F2"),
              padding: 12,
              borderRadius: 10,
              maxWidth: '75%'
            }}>
              <ParsedText
                accessible={true}
                // accessibilityActions={[
                //   {name: 'cut', label: 'cut'},
                //   {name: 'copy', label: 'copy'},
                //   {name: 'paste', label: 'paste'},
                // ]}
                // onAccessibilityAction={event => {
                //   switch (event.nativeEvent.actionName) {
                //     case 'cut':
                //       Alert.alert('Alert', 'cut action success');
                //       break;
                //     case 'copy':
                //       Alert.alert('Alert', 'copy action success');
                //       break;
                //     case 'paste':
                //       Alert.alert('Alert', 'paste action success');
                //       break;
                //   }
                // }}
                style={{
                  fontWeight: '400',
                  fontSize: 15,
                  color: appStore.appId === 'VTPost' ? (right ? 'white' : colors.primaryText) : colors.primaryText
                }}
                parse={
                  [
                    { type: 'url', style: styles.url, onPress: handleUrlPress },
                    { type: 'phone', style: styles.phone, onPress: handlePhonePress },
                    { type: 'email', style: styles.email, onPress: handleEmailPress },
                    // {pattern: /Bob|David/,              style: styles.name, onPress: handleNamePress},
                    // {pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: handleNamePress, renderText: renderText},
                    // {pattern: /42/,                     style: styles.magicNumber},
                    { pattern: /#(\w+)/, style: styles.hashTag },
                  ]
                }
                childrenProps={{ allowFontScaling: false }}
              >{item.text}</ParsedText>
            </View>

          </View>
          {
            item.status === 'sending' &&
            <Text style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 8,
              textAlign: right ? 'right' : 'left'
            }}>{appStore.lang.chat.sending + '...'}</Text>
          }
          {
            item.status === 'error' &&
            <Text style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.primary,
              marginTop: 8,
              textAlign: right ? 'right' : 'left'
            }}>{appStore.lang.chat.send_error}</Text>
          }
        </View>
      )

    }
    if (item.type === 'CREATED_QUOTE_ORDER') {
      return (
        <View>
          <View style={{ backgroundColor: colors.blueBG, padding: 12, marginVertical: 8 }}>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                  fontWeight: '600',
                  fontSize: 16,
                  color: colors.primaryText
                }}>{item.order_info.order_number}</Text>
                <View style={{
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  borderRadius: 28,
                  backgroundColor: '#EB960A',
                  marginHorizontal: 8
                }}>
                  <Text style={{
                    fontWeight: '600',
                    fontSize: 11,
                    color: 'white'
                  }}>{orderStatus(item.order_info.order_status)}</Text>
                </View>
              </View>
            </View>
            <Text style={{
              fontWeight: '600',
              fontSize: 17,
              color: colors.primaryText,
              marginTop: 10
            }}>{item.order_info.receiver_full_name} - {item.order_info.receiver_phone}</Text>
            <Text style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 2
            }}>{item.order_info.product}</Text>

          </View>
          {
            item.status === 'sending' &&
            <Text style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 8
            }}>{appStore.lang.chat.sending + '...'}</Text>
          }
        </View>
      )


    }
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
      id: uuidv4(),
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
          renderItem={renderItem}
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
          style={{}}
          // assetType={'All'}
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
    <ImageViewing
      images={images}
      swipeToCloseEnabled={true}
      doubleTapToZoomEnabled={true}
      imageIndex={0}
      visible={imageVisible}
      onRequestClose={() => setImageVisible(false)}
    />
  </SafeAreaView>

})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  url: {
    textDecorationLine: 'underline',
  },

  email: {
    textDecorationLine: 'underline',
  },

  phone: {
    textDecorationLine: 'underline',
  },

  name: {},

  username: {
    fontWeight: 'bold'
  },

  magicNumber: {
    // fontSize: 42,
  },

  hashTag: {
    fontStyle: 'italic',
  },
});
