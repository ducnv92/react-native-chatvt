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
  TouchableOpacityBase, Dimensions,
} from 'react-native';
import colors from '../../Styles';
import { BottomSheetModalProvider } from '../../components/bottomSheet/bottom-sheet';
import { MText as Text } from '../../components';
import chatStore from './ChatStore';
import { Log, orderStatus } from '../../utils';
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
import { EmojiKeyboard } from '../../components/emojiKeyBoard';
// import { MTextInput as TextInput } from '../../components';
import Image from 'react-native-fast-image';
import Toast, { BaseToast } from 'react-native-toast-message';
import EmojiPicker from 'react-native-emoji-picker-staltz';
import inputStore from './InputStore';
import InputStore from './InputStore';
let {height, width} = Dimensions.get('window');
import { FlashList } from "../../components/flashlist";
export const ChatScreen = observer(function ChatScreen(props) {
  const conversation = props.data;
  const order = props.data?.orders?.length > 0 ? props.data?.orders[0] : {};
  const [receiver, setReceiver] = useState({});
  const inputRef = useRef(null);

  const isOrderSuccess = () => {
    return order?.order_status === 501;
  };

  useEffect(() => {
    chatStore.quote = props.order
      ? {
          _id: uuid.v4(),
          conversation_id: conversation._id,
          text: 'QUOTE_ORDER',
          type: 'QUOTE_ORDER',
          order_number: props.order.ORDER_NUMBER,
          has_attachment: false,
          order_info: {
            vtp_order: props.order,
          },
        }
      : undefined;

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (chatStore.keyboardEmoji) {
        chatStore.keyboardEmoji = false;
        InputStore.inputRef?.current?.focus();
      }
    });
    chatStore.resetData();
    const listener =
      Navigation.events().registerNavigationButtonPressedListener(() => {
        chatStore.images = [];
      });



    let receiver = {};
    try {
      receiver = conversation.detail_participants.find(
        (i) => i.user_id !== appStore.user.user_id
      );
      setReceiver(receiver ? receiver : {});
    } catch (e) {}
    setTimeout(() => {
      chatStore.page = 0;
      chatStore.getData({
        conversation_id: conversation?._id,
      });
    }, 250);
    return () => {
      showSubscription.remove();
      listener.remove();
      chatStore.showAttachModal = false;
      chatStore.keyboardEmoji = false;
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
        chatStore.data.unshift(message);
         chatStore.sendMessage(message);
    } catch (e) {}
  };

  return (
    <MenuProvider style={{ flex: 1, backgroundColor: colors.primary }}>
      <SafeAreaView style={{ flex: 1 }}>
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
                  source={require('../../assets/ic_back.png')}
                />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={navigateAttachs}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 17,
                        color: 'white',
                      }}
                    >
                      {conversation.type === 'GROUP'
                        ? 'Đơn ' + conversation.order_numbers[0]
                        : conversation.type === 'PAIR'
                        ? receiver.first_name + ' ' + receiver.last_name
                        : conversation.type === 'PAIR_SUPPORT'
                        ? 'Chăm sóc khách hàng'
                        : 'Không tên'}
                    </Text>
                    {conversation.type === 'PAIR' && (
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
                {conversation.type === 'PAIR' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 2,
                    }}
                  >
                    {receiver.state?.includes('ONLINE') && (
                      <View
                        style={{
                          height: 8,
                          width: 8,
                          marginRight: 8,
                          borderRadius: 4,
                          backgroundColor: '#30F03B',
                        }}
                      />
                    )}

                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 13,
                        color: 'white',
                        textAlign: 'center',
                      }}
                    >
                      {conversation.type === 'PAIR' &&
                        receiver.type === 'VTMAN' &&
                        appStore.lang.common.postman}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => alert('Tính năng đang phát triển!')}
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
            <View style={{flex: 1, backgroundColor: 'white'}}>

                <FlashList
                  estimatedItemSize={200}
                  forceNonDeterministicRendering={true}
                  maintainVisibleContentPosition={{
                    autoscrollToTopThreshold: 10,
                    minIndexForVisible: 1,
                  }}
                  style={{ flex: 1, backgroundColor: 'white',}}
                  data={chatStore.data}
                  extraData={chatStore.data}
                  inverted={true}
                  renderItem={({ item, index }) => (
                    <ChatItem  item={item} index={index} conversation={conversation} />
                  )}
                  getItemType={(item, index) => {
                    if(index=== 0) {
                      return 0
                    }
                    return item?.type;
                  }}
                  onEndReached={() => handleLoadMore()}
                  onEndReachedThreshold={0.5}
                  ListHeaderComponent={() => <View style={{ height: 8 }} />}
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
            <BottomChat {...props}/>
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
        <Toast
          bottomOffset={90}
          config={{
            info: (props) => (
              <BaseToast
                {...props}
                style={{
                  borderLeftColor: 'transparent',
                  borderRadius: 8,
                  backgroundColor: colors.primaryText,
                  flexWrap: 'wrap',
                }}
                // contentContainerStyle={{
                //   backgroundColor: colors.primaryText,
                //   borderRadius: 8,
                //   marginHorizontal: 16,
                // }}
                text1Style={{
                  flexWrap: 'wrap',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: '500',
                  fontFamily: 'SVN-GilroyMedium',
                }}
              />
            ),
          }}
        />
      </SafeAreaView>
    </MenuProvider>
  );
});


const BottomChat = observer(function BottomChat(props) {
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
    chatStore.data.unshift(message);
    chatStore.sendMessage(message);
  };


  const handlePresentModalPress = () => {
    Keyboard.dismiss();
    chatStore.showAttachModal = true;
  };
  const isOrderSuccess = () => {
    return false
  }
  return(
    <>
    <TouchableOpacity
      disabled={!isOrderSuccess()}
      onPress={() => {
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Chat với bưu tá lấy không khả dụng do đơn đã',
        });
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
        disabled={isOrderSuccess()}
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
          tintColor={isOrderSuccess() ? '#B5B4B8' : colors.primary}
          style={{
            height: 24,
            width: 24,
            resizeMode: 'contain',
            tintColor: isOrderSuccess() ? '#B5B4B8' : colors.primary,
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
      <Input/>
      <TouchableOpacity
        disabled={isOrderSuccess()}
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
            isOrderSuccess()
              ? require('../../assets/ic_emoji_disabled.png')
              : require('../../assets/ic_emoj.png')
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

      {inputStore.input.trim() !== '' && !isOrderSuccess() && (
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
          disabled={isOrderSuccess()}
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
              tintColor: isOrderSuccess() ? '#B5B4B8' : colors.primary,
            }}
            tintColor={isOrderSuccess() ? '#B5B4B8' : colors.primary}
          />
        </RecordButton>
      )}

    </TouchableOpacity>
      {chatStore.keyboardEmoji && (
        // <EmojiKeyboard
        //   styles={{
        //     container: { borderRadius: 0, backgroundColor: 'white' },
        //   }}
        //   onEmojiSelected={(emoji) => {
        //     chatStore.input += emoji.emoji;
        //   }}
        // />

        <EmojiPicker
          hideClearButton={true}
          onEmojiSelected={(emoji) => {
            if(emoji!==null) {
              inputStore.input += emoji
            }
          }}
          rows={7}
          localizedCategories={[ // Always in this order:
            'Smileys and emotion',
            'People and body',
            'Animals and nature',
            'Food and drink',
            'Activities',
            'Travel and places',
            'Objects',
            'Symbols',
          ]}
        />
      )}
      </>
  )
})
