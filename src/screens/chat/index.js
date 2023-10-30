import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  TextInput,
  TouchableOpacityBase,
  Dimensions,
  Linking,
  Image,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableNativeFeedbackComponent, TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../Styles';
import { BottomSheetModalProvider, TouchableHighlight } from '../../components/bottomSheet/bottom-sheet';
import { MText as Text } from '../../components';
import chatStore from './ChatStore';
import { Log, orderStatus, timeSince } from '../../utils';
import appStore from '../AppStore';
import { observer } from 'mobx-react-lite';
import { Navigation } from 'react-native-navigation';
import { ChatItem } from './Item';
import uuid from 'react-native-uuid';
import { AttachScreen, Input } from './Attach';
import { FlatList, ScrollView } from '../../components/flatlist';
import { MenuProvider } from 'react-native-popup-menu';
import { RecordButton } from './RecordButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraRoll from '../../components/cameraRollPicker/CameraRoll';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Image from 'react-native-fast-image';
import Toast, { BaseToast } from 'react-native-toast-message';
import EmojiPicker from 'react-native-emoji-picker-staltz';
import inputStore from './InputStore';
import InputStore from './InputStore';
import EmojiKeyboard from "../../components/emoji";

export const ChatScreen = observer(function ChatScreen(props) {
  const conversation = props.data;
  const order = props.data?.orders?.length > 0 ? props.data?.orders[0] : {};
  const [receiver, setReceiver] = useState({});
  const inputRef = useRef(null);

  const isOrderSuccess = () => {
    return order?.order_status === 501;
  };

  const initData = async ()=>{
      chatStore.resetData();

      chatStore.quote = props.order
          ? {
              _id: uuid.v4(),
              conversation_id: conversation._id,
              text: 'QUOTE_ORDER',
              type: 'QUOTE_ORDER',
              order_number: props.order.ORDER_NUMBER?props.order.ORDER_NUMBER:props.order.ma_phieugui,
              has_attachment: false,
              order_info: {
                  vtp_order: {...props.order},
              },
          }
          : undefined;

      try {
          if(chatStore.quote){
              await chatStore.getOrderInfoVTM(chatStore.quote.order_number)
          }
      }catch (e) {
      }




      let receiver = {};
      try {
          receiver = conversation.detail_participants.find(
              (i) => i.user_id !== appStore.user.user_id
          );
          setReceiver(receiver ? receiver : {});
      } catch (e) { }
      chatStore.page = 0;
      chatStore.getData({
          conversation_id: conversation?._id,
      });
      chatStore.checkCanSend()
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (chatStore.keyboardEmoji) {
        chatStore.keyboardEmoji = false;
        InputStore.inputRef?.current?.focus();
      }
    });
      initData()
    return () => {
      chatStore.data = []
      chatStore.showAttachModal = false;
      chatStore.keyboardEmoji = false;
      chatStore.conversation_id = '';
      chatStore.images = [];
      InputStore.input = ''
        try{
            showSubscription.remove();

        }catch (e) {

        }
    };
  }, []);

  const navigateAttachs = () => {
    if (conversation.type === 'PAIR') {
      Navigation.push(props.componentId, {
        component: {
          name: 'AttachsScreen',
          options: {
            popGesture: false,
            bottomTabs: {
              visible: false,
            },
            topBar: {
              visible: false,
              height: 0,
            },
          },
          passProps: {
            data: conversation,
            receiver,
          },
        },
      });
    }
  };

  const handleLoadMore = () => {
    chatStore.getData({
      conversation_id: conversation._id,
    });
  };



  const sendImages = async () => {
    try {
      chatStore.showAttachModal = false;
      try {
        if (Platform.OS === 'ios') {
          for (let i = 0; i < chatStore.images.length; i++) {
            const regex = /:\/\/(.{36})\//i;
            const result = chatStore.images[i].uri.match(regex);
            const photoDetail = await CameraRoll.getPhotoByInternalID(
                result[1],
                {}
            );
            chatStore.images[i].uri = photoDetail.node.image.filepath;
          }
        }
      } catch (e) {
        alert(e);
      }

      const message = {
        id: uuid.v4(),
        type: 'MESSAGE',
        attachmentLocal: chatStore.images,
        has_attachment: true,
        attachment_ids: [],
        text: '',
        status: 'sending',
        order_number: props.data.order_info?.order_number,
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: props.data._id,
      };
      chatStore.images = [];
      chatStore.data  = [message, ...chatStore.data];

      chatStore.sendMessage(message);
    } catch (e) { }
  };

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <BottomSheetModalProvider style={{ flex: 1 }}>
          <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
          >
            <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 64,
                  backgroundColor: colors.primary,
                }}
            >
              <TouchableOpacity
                  onPress={() => {
                      try {
                          Navigation.pop(props.componentId?props.componentId:'ChatScreen')
                      }catch (e) {

                      }
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
              >
                <Image
                    style={{ height: 36, width: 36, resizeMode: 'contain' }}
                    source={require('../../assets/ic_back.png')}
                />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: 'center' , paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
                  <TouchableOpacity
                      onPress={navigateAttachs}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 17,
                          color: 'white',
                          textAlign: 'center'
                        }}
                        numberOfLines={1} ellipsizeMode='tail'
                    >
                      {conversation?.type === 'GROUP'
                          ? 'Đơn ' + (conversation?.order_numbers?.length>0 && conversation?.order_numbers[0])
                          : conversation?.type === 'PAIR'
                              ?  (receiver?.last_name?receiver?.last_name:'')+ ' ' + (receiver?.first_name?receiver?.first_name: '')
                              : ''}
                    </Text>
                    {conversation?.type === 'PAIR' && (
                        <Image
                            style={{
                              height: 14,
                              width: 14,
                              marginLeft: 4,
                              resizeMode: 'contain',
                            }}
                            source={require('../../assets/ic_arrow_down.png')}
                        />
                    )}
                  </TouchableOpacity>
                </View>
                {conversation?.type === 'PAIR' && (
                    <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 2,
                        }}
                    >
                      {receiver?.state?.includes('ONLINE') ? (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}>
                            <View
                                style={{
                                  height: 8,
                                  width: 8,
                                  marginRight: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#30F03B',
                                }}
                            />
                            <Text
                              ellipsizeMode="tail"
                              numberOfLines={1}
                              style={{ fontSize: 13, color: "white" }}>{
                              receiver.type === 'VTMAN' ?
                                  '' : 'Đang hoạt động'}</Text>
                          </View>
                      )
                      :(
                        receiver.type === 'VTMAN' ? (
                          <Text
                            style={{
                              fontWeight: '500',
                              fontSize: 13,
                              color: 'white',
                              textAlign: 'center',
                            }}
                          >
                            {receiver.type === 'VTMAN' ?
                              appStore.lang.common.postman: ('Hoạt động '+timeSince(receiver.last_state_update))}
                          </Text>
                        ) :(
                          receiver.last_state_update?
                          <Text
                            style={{
                              fontWeight: '500',
                              fontSize: 13,
                              color: 'white',
                              textAlign: 'center',
                            }}
                          >
                            {'Hoạt động '+timeSince(receiver.last_state_update)}
                          </Text>:null
                        )
                        )}

                    </View>
                )}
                {conversation?.type === 'GROUP' && (
                    <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 2,
                        }}
                    >

                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                          style={{
                            fontWeight: '500',
                            fontSize: 13,
                            color: 'white',
                            textAlign: 'center',
                          }}
                      >
                        {
                          orderStatus(order?.order_status)
                        }
                      </Text>
                    </View>
                )}

              </View>

              <TouchableOpacity
                  onPress={() => {
                    try {
                      Linking.openURL(`tel:${receiver?.phone}`)
                    } catch (e) {
                      console.log(e)
                    }
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
              >
                <Image
                    style={{
                      height: 18,
                      width: 18,
                      resizeMode: 'contain',
                      marginRight: 16,
                    }}
                    source={require('../../assets/ic_call_out_white.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: 'white' }}>

              <FlatList
                  keyboardShouldPersistTaps={'always'}
                  estimatedItemSize={100}
                  viewabilityConfig={{
                    waitForInteraction: true,
                    itemVisiblePercentThreshold: 50,
                    minimumViewTime: 1000,
                  }}
                  overrideItemLayout={(layout, item) => {
                    layout.size = 200;
                  }}
                  // forceNonDeterministicRendering={true}
                  style={{ flex: 1, backgroundColor: 'white', transform: [{scaleY: -1}] }}
                  data={chatStore.data}
                  // extraData={chatStore.data}
                  // inverted
                  renderItem={({ item, index }) => (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>{
                          if(chatStore.keyboardEmoji===true){
                            chatStore.keyboardEmoji = false
                          }
                        }}
                        style={{transform: [{scaleY: -1}]}}>
                        <ChatItem item={item} index={index} data={chatStore.data} conversation={conversation} componentId={props.componentId} />
                      </TouchableOpacity>
                  )}
                  getItemType={(item, index) => {
                    return item?.type;
                  }}
                  onEndReached={(info) => {
                    // if(info.distanceFromEnd===0){
                    handleLoadMore()
                    // }
                  }}
                  // maxToRenderPerBatch={20}
                  onEndReachedThreshold={0.7}
                  ListFooterComponent={() => <View style={{alignItems: 'center', padding: 4,}} >
                    {
                        chatStore.isLoadingMore && <ActivityIndicator color={colors.primary}/>
                    }
                  </View>}
                  removeClippedSubviews={true}
                  keyExtractor={(item) =>
                      item._id !== undefined ? item._id : item.id
                  }
                  refreshing={chatStore.isLoading}
                  onRefresh={() => {
                    chatStore.page = 0;
                    chatStore.getData({
                      conversation_id: conversation._id,
                    });
                  }}
              />
            </View>
            <BottomChat {...props} />
          </KeyboardAvoidingView>

          <AttachScreen {...props} />
          {chatStore.images.length > 0 && chatStore.showAttachModal && (
              <TouchableOpacity
                  onPress={sendImages}
                  style={{
                    position: 'absolute',
                    zIndex: 99999,
                    bottom: 92 + useSafeAreaInsets().bottom,
                    left: 16,
                    right: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    margin: 16,
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                  }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                  {appStore.lang.chat.send}
                </Text>
              </TouchableOpacity>
          )}
        </BottomSheetModalProvider>
        {/*<Toast*/}
        {/*    bottomOffset={90}*/}
        {/*    config={{*/}
        {/*      info: (props) => (*/}
        {/*          <BaseToast*/}
        {/*              {...props}*/}
        {/*              style={{*/}
        {/*                borderLeftColor: 'transparent',*/}
        {/*                borderRadius: 8,*/}
        {/*                backgroundColor: colors.primaryText,*/}
        {/*                flexWrap: 'wrap',*/}
        {/*              }}*/}
        {/*              // contentContainerStyle={{*/}
        {/*              //   backgroundColor: colors.primaryText,*/}
        {/*              //   borderRadius: 8,*/}
        {/*              //   marginHorizontal: 16,*/}
        {/*              // }}*/}
        {/*              text1Style={{*/}
        {/*                flexWrap: 'wrap',*/}
        {/*                color: 'white',*/}
        {/*                fontSize: 13,*/}
        {/*                fontWeight: '500',*/}
        {/*                fontFamily: 'SVN-GilroyMedium',*/}
        {/*              }}*/}
        {/*          />*/}
        {/*      ),*/}
        {/*    }}*/}
        {/*/>*/}
      </SafeAreaView>
  );
});


const BottomChat = observer(function BottomChat(props) {

  const [showAlert, setShowAlert] = useState(false)

  useEffect(()=>{

    return ()=>{
      InputStore.input = ''
    }
  }, [])

  const conversation = props.data;

  const sendMessage = async () => {
    const message = {
      id: uuid.v4(),
      type: 'MESSAGE',
      text: InputStore.input,
      status: 'sending',
      order_number: props.order
          ? props.order.ORDER_NUMBER
          : conversation.order_info?.order_number,
      sender: appStore.user.type + '_' + appStore.user.user_id,
      conversation_id: conversation._id,
    };
    InputStore.input = '';
    chatStore.data  = [message, ...chatStore.data];

    chatStore.sendMessage(message);
  };


  const handlePresentModalPress = () => {
    Keyboard.dismiss();
    chatStore.showAttachModal = true;
  };

  const isOrderSuccess = () => {
    return false
  }

  const sendSticker = async (sticker) => {
    try {
      const message = {
        id: uuid.v4(),
        type: 'STICKER',
        has_attachment: true,
        status: 'sending',
        conversation_id: props.data._id,
        sticker_ids: [sticker._id],
        sender: appStore.user.type + '_' + appStore.user.user_id,
      };
      chatStore.data  = [message, ...chatStore.data];

      chatStore.sendMessage(message);
    } catch (e) {
      console.log(e)
    }
  };

  return (
      <>
        <TouchableOpacity
            disabled={chatStore.canSend}
            onPress={() => {
              setShowAlert(true)
              setTimeout(()=>{setShowAlert(false)}, 2000)
            }}
            style={{
              minHeight: 56,
              backgroundColor: '#F8F8FA',
              flexDirection: 'row',
              alignItems: 'flex-end',
              borderTopWidth: 1,
              borderColor: '#DCE6F0',
            }}
        >
          <TouchableOpacity
              disabled={!chatStore.canSend}
              onPress={handlePresentModalPress}
              style={{
                width: 56,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
          >
            <Image
                source={require('../../assets/ic_attach.png')}
                tintColor={!chatStore.canSend ? '#B5B4B8' : colors.primary}
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  tintColor: !chatStore.canSend ? '#B5B4B8' : colors.primary,
                }}
            />
          </TouchableOpacity>
          <View style={{ width: 1, height: '100%' }}>
            <View
                style={{
                  width: 1,
                  backgroundColor: '#DCE6F0',
                  marginVertical: 14,
                  flex: 1,
                }}
            />
          </View>
          <Input />
          <TouchableOpacity
              disabled={!chatStore.canSend}
              onPress={() => {
                if (chatStore.keyboardEmoji) {
                  chatStore.keyboardEmoji = false;
                } else {
                  chatStore.keyboardEmoji = true;
                  Keyboard.dismiss();
                }
              }}
              style={{
                width: 40,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
              }}
          >
            <Image
                source={
                  chatStore.keyboardEmoji?require('../../assets/ic_emoji_disabled.png'):(!chatStore.canSend
                      ? require('../../assets/ic_emoji_disabled.png')
                      : require('../../assets/ic_emoj.png'))
                }
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                }}
            />
          </TouchableOpacity>
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

          {inputStore.input.trim() !== '' && chatStore.canSend && (
              <TouchableOpacity
                  onPress={sendMessage}
                  style={{
                    width: 40,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
              >
                <Image
                    source={require('../../assets/ic_send.png')}
                    style={{ height: 24, width: 24, resizeMode: 'contain' }}
                />
              </TouchableOpacity>
          )}
          {inputStore.input.trim() === '' && (
              <RecordButton
                  disabled={!chatStore.canSend}
                  {...props}
                  style={{
                    width: 40,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
              >
                <Image
                    source={require('../../assets/ic_microphone.png')}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: 'contain',
                      tintColor: !chatStore.canSend ? '#B5B4B8' : colors.primary,
                    }}
                    tintColor={!chatStore.canSend ? '#B5B4B8' : colors.primary}
                />
              </RecordButton>
          )}

        </TouchableOpacity>
        {chatStore.keyboardEmoji && (
            <EmojiKeyboard
                styles={{
                  container: { borderRadius: 0, backgroundColor: 'white' },
                }}
                onSelected={(sticker) => {
                  sendSticker(sticker)
                }}
            />

            // <EmojiPicker
            //   emojiStyle={{color: 'black'}}
            //   hideClearButton={true}
            //   onEmojiSelected={(emoji) => {
            //     if (emoji !== null) {
            //       inputStore.input += emoji
            //     }
            //   }}
            //   rows={7}
            //   localizedCategories={[ // Always in this order:
            //     'Smileys and emotion',
            //     'People and body',
            //     'Animals and nature',
            //     'Food and drink',
            //     'Activities',
            //     'Travel and places',
            //     'Objects',
            //     'Symbols',
            //   ]}
            // />
        )}
        {
          showAlert && (
            <View style={{
              position: 'absolute',
              width: Dimensions.get('window').width-28,
              backgroundColor: '#44494D',
              height: 68,
              marginHorizontal: 14,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 78

            }}>
              <Text style={{color: 'white', fontWeight: '500', lineHeight: 18, fontSize: 13, padding: 16 }}>Chat với bưu tá lấy không khả dụng do trạng thái đơn không cho phép.</Text>
            </View>
          )
        }
      </>
  )
})
