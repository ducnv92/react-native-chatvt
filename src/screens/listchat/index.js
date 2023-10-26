import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  KeyboardAvoidingView, Dimensions, StatusBar,
} from 'react-native';
import { MText as Text } from '../../components';
import { observer } from 'mobx-react-lite';
import colors from '../../Styles';
import Swipeable from '../../components/swipeable';
import listChatStore from './ListChatStore';
import appStore from '../AppStore';
import moment from 'moment';
import { Navigation } from 'react-native-navigation';
import Image from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTimeLastMessage, orderStatus, scale } from '../../utils';
import { MTextInput as TextInput } from '../../components';
import BottomSheetChatOptions from '../../components/bottomSheetChatOptions';
import { BottomSheetModalProvider } from '../../components/bottomSheet/bottom-sheet';
import { toJS } from 'mobx';
import stickerStore from "../chat/StickerStore";
import _ from 'lodash';

export const ListChatScreen = observer(function ListChatScreen(props) {
  const [showSearch, setShowSearch] = useState(false);
  const bottomSheetModalRef = useRef();
  const [query, setQuery] = useState(undefined);
  const currentSwipe = createRef()

  useEffect(() => {
    // StatusBar.setBackgroundColor(colors.primary)
    // StatusBar.setBarStyle(StatusBarSty, false)
    listChatStore.search = '';
    stickerStore.getStickers()
    // intLoad();
    // bottomSheetModalRef.current?.present();
    return () => {
      bottomSheetModalRef.current?.dismiss();
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(query!==undefined){
        listChatStore.search = query;
        listChatStore.page = 0;
        listChatStore.getData({});
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const intLoad = () => {
    listChatStore.page = 0;
    listChatStore.getData({});
  };

  const navigationChat = (data) => {
    Navigation.push(props.componentId, {
      component: {
        id: 'ChatScreen',
        name: 'ChatScreen',
        passProps: {
          data: data,
        },
        style: {
          backgroundColor: 'white',
        },
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
      },
    });
  };

  const getLastMessage = (item, setting, isMe) => {
    const prefix = isMe ? appStore.lang.list_chat.you + ': ' : '';

    try {
      if (item.message?.type === 'CREATED_QUOTE_ORDER') {
        return (
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: setting?.unread_count > 0 ? '600' : '500',
              color:
                setting?.unread_count > 0
                  ? colors.primaryText
                  : colors.neutralText,
            }}
          >
            {appStore.lang.list_chat.message_system}
          </Text>
        );
      }

      if (item.message?.type === 'VOICE') {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../../assets/ic_attach_message.png')}
              style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 6 }}
            />
            <Text numberOfLines={1} style={{
              fontSize: 15,
              fontWeight: setting?.unread_count > 0 ? '600' : '500',
              color:
                setting?.unread_count > 0
                  ? colors.primaryText
                  : colors.neutralText,
            }}>{prefix + appStore.lang.list_chat.message_voice}</Text>
          </View>
        );
      }
      if (item.message?.type === 'LOCATION') {
        return (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              source={require('../../assets/ic_attach_message.png')}
              style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 6 }}
            />
            <Text style={{
              fontSize: 15,
              fontWeight: setting?.unread_count > 0 ? '600' : '500',
              color:
                setting?.unread_count > 0
                  ? colors.primaryText
                  : colors.neutralText,
            }}>{prefix + appStore.lang.list_chat.message_location}</Text>
          </View>
        );
      }
      if (item.message?.type === 'FILE') {
        return (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          >
            <Image
              source={require('../../assets/ic_attach_message.png')}
              style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 6 }}
            />
            <Text numberOfLines={1}
              style={{
                flex: 1,
                fontWeight: setting?.unread_count > 0 ? '600' : '500',
                color:
                  setting?.unread_count > 0
                    ? colors.primaryText
                    : colors.neutralText,
              }}>{prefix + appStore.lang.list_chat.message_doc}</Text>
          </View>
        );
      }
      if (item.message?.type === 'STICKER') {
        return (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          >
            <Text numberOfLines={1}
                  style={{
                    flex: 1,
                    fontWeight: setting?.unread_count > 0 ? '600' : '500',
                    color:
                      setting?.unread_count > 0
                        ? colors.primaryText
                        : colors.neutralText,
                  }}>{prefix + 'gửi 1 nhãn dán'}</Text>
          </View>
        );
      }
      if (item.message?.has_attachment) {
        return (
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 21,
              fontWeight: setting?.unread_count > 0 ? '600' : '500',
              color:
                setting?.unread_count > 0
                  ? colors.primaryText
                  : colors.neutralText,
            }}
          >
            {prefix +
              (isMe
                ? `Bạn đã gửi ${item.message?.attachment_ids.length} ảnh/video`
                : `Bạn đã nhận ${item.message?.attachment_ids.length} ảnh/video`)}
          </Text>
        );
      }
    } catch (e) {
    }
    return (
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: setting?.unread_count > 0 ? '600' : '500',
          color:
            setting?.unread_count > 0 ? colors.primaryText : colors.neutralText,
        }}
      >
        {prefix + item.message?.text}
      </Text>
    );
  };

  const renderItem = ({ item, index }) => {
    let setting = {};
    try {
      let mySetting = item.settings?.find(
        (i) => i.user_id === appStore.user.type + '_' + appStore.user.user_id
      );
      setting = mySetting ? mySetting : {};
    } catch (e) { }
    let receiver = {};
    let isMe = false;
    try {
      isMe =
        appStore.user.type + '_' + appStore.user.user_id ===
        item.message?.sender;
      receiver = item.detail_participants.find(
        (i) => i.user_id !== appStore.user.user_id
      );
    } catch (e) { }

    const rightButtons = [
      <TouchableOpacity
        onPress={() => {

          if (setting.is_pin) {
            listChatStore.unPin({ conversation_id: item._id }, () => {
              try {
                item.settings = item.settings.map(i => {
                  i.is_pin = false;
                  return i
                })
              } catch (e) {

              }

                listChatStore.data  = [item, ...listChatStore.data];

              listChatStore.dataPin = _.orderBy(listChatStore.dataPin.filter(i => i._id !== item._id), c=>c?.message?.created_at, "desc")
              listChatStore.data = _.orderBy(listChatStore.data, c=>c?.message?.created_at, "desc")
            });
          } else {
            listChatStore.pin({ conversation_id: item._id }, () => {
              try {
                item.settings = item.settings.map(i => {
                  i.is_pin = true;
                  return i
                })
              } catch (e) {

              }
              listChatStore.dataPin = [item, ...listChatStore.dataPin]
              listChatStore.data = _.orderBy(listChatStore.data.filter(i => i._id !== item._id), c=>c?.message?.created_at, "desc")
              listChatStore.dataPin = _.orderBy(listChatStore.dataPin, c=>c?.message?.created_at, "desc")
            });
          }
        }}
        style={{
          width: 66,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3B7CEC',
          flex: 1,
        }}
      >
        <Image
          resizeMode={'contain'}
          source={
            setting.is_pin
              ? require('../../assets/ic_unpin.png')
              : require('../../assets/ic_pin_white.png')
          }
          style={{ width: 20, height: 20, resizeMode: 'contain' }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            fontWeight: '500',
            backgroundColor: 'transparent',
            textAlign: 'center',
            paddingTop: 4,
          }}
        >
          {setting.is_pin
            ? appStore.lang.list_chat.unpin
            : appStore.lang.list_chat.pin}
        </Text>
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={() => {
          try {
            listChatStore.mute(
              {
                conversation_id: item._id,
                is_show: !setting.is_hide_notification,
              },
              () => {
                item.settings = item.settings?.map(i => {
                  i.is_hide_notification = !i.is_hide_notification
                  return i
                })
                listChatStore.data = [...listChatStore.data]
                //   item.settings = item.settings.map(i=>{
                //     i.is_pin = true;
                //     return i
                //   })
                // listChatStore.data = [...listChatStore.data]
              }
            );

          } catch (e) {

          }
        }}
        style={{
          width: 66,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EB960A',
          flex: 1,
        }}
      >
        <Image
          resizeMode={'contain'}
          source={
            !setting.is_hide_notification
              ? require('../../assets/ic_notify_off.png')
              : require('../../assets/ic_notify.png')
          }
          style={{ width: 24, height: 24, resizeMode: 'contain' }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            backgroundColor: 'transparent',
            textAlign: 'center',
            fontWeight: '500',
            paddingTop: 4,
          }}
        >
          {setting.is_hide_notification
            ? appStore.lang.list_chat.unmute
            : appStore.lang.list_chat.mute}
        </Text>
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={() => {
          listChatStore.hide({ conversation_id: item._id }, () => intLoad());
        }}
        style={{
          width: 66,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EE0033',
          flex: 1,
        }}
      >
        <Image
          resizeMode={'contain'}
          source={require('../../assets/ic_delete.png')}
          style={{ width: 24, height: 24, resizeMode: 'contain' }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            backgroundColor: 'transparent',
            fontWeight: '500',
            textAlign: 'center',
            paddingTop: 4,
          }}
        >
          {appStore.lang.list_chat.delete}
        </Text>
      </TouchableOpacity>,
    ];

    if (item.type === 'GROUP') {
      //Group Chat
      return (
        <Swipeable
          onRightButtonsActivate={(event, gestureState, swipeable)=> {
            currentSwipe.current?.recenter()
          }}
          onRightButtonsOpenRelease={(event, gestureState, swipeable)=> {
            currentSwipe.current = swipeable
          }}
          rightButtonWidth={66} rightButtons={rightButtons}>
          <TouchableOpacity
            onPress={() => {
              try {
                navigationChat({ ...item, ...{ receiver: receiver } });
                item.settings = item.settings.map((i) => {
                  if (
                    i.user_id ===
                    appStore.user.type + '_' + appStore.user.user_id
                  ) {
                    i.unread_count = 0;
                  }
                  return i;
                });
                listChatStore.data = [...listChatStore.data];
              } catch (e) {

              }
              try {
                listChatStore.dataPin[index].settings = listChatStore.dataPin[
                  index
                  ].settings.map((i) => {
                  if (
                    i.user_id ===
                    appStore.user.type + '_' + appStore.user.user_id
                  ) {
                    i.unread_count = 0;
                  }
                  return i;
                });
                listChatStore.dataPin = [...listChatStore.dataPin];
              } catch (e) {

              }


            }}
            style={{
              flexDirection: 'row',
              backgroundColor: setting?.is_pin ? '#F8F8FA' : 'white',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                height: 48,
                width: 48,
                resizeMode: 'center',
                marginRight: 12,
              }}
            >
              <Image
                style={{ height: 48, width: 48, resizeMode: 'center' }}
                source={require('../../assets/avatar_group.png')}
              />
              {/*<Image style={{height: 12, width: 12, resizeMode: 'center', position: 'absolute', top: 36, left: 36 }} source={require('../../assets/ic_online.png')} />*/}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  numberOfLines={1}
                  style={{

                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.primaryText,
                  }}
                >
                  Đơn {item.order_numbers[0]}{' '}

                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: '400',
                    color: colors.neutralText,
                  }}
                >
                  - {orderStatus(item.orders[0]?.order_status)}{' '}
                </Text>
                <Text style={{ textAlign: 'right', color: colors.neutralText, fontSize: 13, fontWeight: setting?.unread_count > 0?'600':'500' }}>
                  {formatTimeLastMessage(item.message?.created_at)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 6,
                  alignItems: 'center',
                }}
              >
                {getLastMessage(item, setting, isMe)}
                <View style={{ flexDirection: 'row' }}>
                  {setting?.is_pin && (
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'center',
                        marginLeft: 6,
                      }}
                      source={require('../../assets/ic_pin.png')}
                    />
                  )}
                  {setting?.is_hide_notification && (
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'center',
                        marginLeft: 6,
                      }}
                      source={require('../../assets/ic_mute.png')}
                    />
                  )}
                  {item.message?.read_by?.map((item, index) => (
                    <View key={index + ''}>
                      {
                        item !== (appStore.user.type + '_' + appStore.user.user_id) &&
                        <Image
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'center',
                            marginLeft: 6,
                          }}
                          source={item.includes('VTM') ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
                        />
                      }
                    </View>
                  ))}
                  {setting?.unread_count > 0 && (
                    <View
                      style={{
                        height: 16,
                        width: 16,
                        backgroundColor: colors.primary,
                        borderRadius: 8,
                        marginLeft: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 10,
                          textAlign: 'center',
                        }}
                      >
                        {setting?.unread_count}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    } else if (item.type === 'PAIR') {
      //Private Chat

      return (
        // <ChatSwipeableRow
        //   isPin={setting?.is_pin}
        //   onPress1={(isPin)=>{
        //     listChatStore.pin({
        //       conversation_id: item._id
        //     })
        //   }}
        //   onPress3={()=>{
        //     listChatStore.hide({
        //       conversation_id: item._id
        //     })
        //   }}
        // >
        <Swipeable
          onRightButtonsActivate={(event, gestureState, swipeable)=> {
            currentSwipe.current?.recenter()
          }}
          onRightButtonsOpenRelease={(event, gestureState, swipeable)=> {
            currentSwipe.current = swipeable
          }}
          rightButtonWidth={66} rightButtons={rightButtons}>
          <TouchableOpacity
            onPress={() => {
              try {
                navigationChat({ ...item, ...{ receiver: receiver } });
                listChatStore.data[index].settings = listChatStore.data[
                  index
                ].settings.map((i) => {
                  if (
                    i.user_id ===
                    appStore.user.type + '_' + appStore.user.user_id
                  ) {
                    i.unread_count = 0;
                  }
                  return i;
                });
                listChatStore.data = [...listChatStore.data];
              } catch (e) {

              }
              try {
                listChatStore.dataPin[index].settings = listChatStore.dataPin[
                  index
                  ].settings.map((i) => {
                  if (
                    i.user_id ===
                    appStore.user.type + '_' + appStore.user.user_id
                  ) {
                    i.unread_count = 0;
                  }
                  return i;
                });
                listChatStore.dataPin = [...listChatStore.dataPin];
              } catch (e) {

              }
            }}
            style={{
              flexDirection: 'row',
              backgroundColor: setting?.is_pin ? '#F8F8FA' : 'white',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                height: 48,
                width: 48,
                resizeMode: 'center',
                marginRight: 12,
              }}
            >
              <Image
                style={{ height: 48, width: 48, resizeMode: 'center' }}
                source={receiver?.type === 'VTMAN' ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
              />
              {receiver.state?.includes('ONLINE') && (
                <Image
                  style={{
                    height: 12,
                    width: 12,
                    resizeMode: 'center',
                    position: 'absolute',
                    top: 36,
                    left: 36,
                  }}
                  source={require('../../assets/ic_online.png')}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    flex: 1,
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.primaryText,
                  }}
                >
                  {(receiver?.last_name ? receiver?.last_name : '')+ ' ' + (receiver?.first_name ? receiver?.first_name : '')  }{' '}
                  {receiver?.type === 'VTMAN' && (
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '400',
                        color: colors.neutralText,
                      }}
                    >
                      - {appStore.lang.common.postman}{' '}
                    </Text>
                  )}{' '}
                </Text>
                <Text style={{ textAlign: 'right', color: colors.neutralText, fontWeight: setting?.unread_count > 0?'600':'500', fontSize: 13 }}>
                  {formatTimeLastMessage(item.message?.created_at)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 6,
                  alignItems: 'center',
                }}
              >
                {getLastMessage(item, setting, isMe)}
                {item.message?.read_by?.map((reader, index) => (
                  <View key={index + ''}>
                    {
                      reader !== (appStore.user.type + '_' + appStore.user.user_id) && reader !== item?.sender &&
                      <Image
                        style={{
                          height: 16,
                          width: 16,
                          resizeMode: 'center',
                          marginLeft: 6,
                        }}
                        source={reader.includes('VTM') ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
                      />
                    }
                  </View>
                ))}
                <View style={{ flexDirection: 'row' }}>
                  {setting?.is_pin && (
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'center',
                        marginLeft: 6,
                      }}
                      source={require('../../assets/ic_pin.png')}
                    />
                  )}
                  {setting?.is_hide_notification && (
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'center',
                        marginLeft: 6,
                      }}
                      source={require('../../assets/ic_mute.png')}
                    />
                  )}
                  {/*<Image style={{height: 16, width: 16, resizeMode: 'center',  marginLeft: 10  }} source={require('../../assets/avatar_default.png')} />*/}
                  {setting?.unread_count > 0 && (
                    <View
                      style={{
                        height: 16,
                        width: 16,
                        backgroundColor: colors.primary,
                        borderRadius: 8,
                        marginLeft: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 10,
                          textAlign: 'center',
                        }}
                      >
                        {setting?.unread_count}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    }
  };

  function renderHeader() {
    return (
      <FlatList
        keyExtractor={(item) => item?.message?._id}
        style={{ backgroundColor: 'white' }}
        data={listChatStore.dataPin}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: '#F8F8FA', height: 1 }}>
            <View
              style={{
                backgroundColor: '#E5E5E5',
                height: 1,
                marginLeft: 76,
                marginRight: 16,
              }}
            ></View>
          </View>
        )}
        renderItem={renderItem}
      />
    );
  }




  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.primary}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
    >
    <SafeAreaView style={{ flex: 1, }}>

        <View style={{ height: scale(64), backgroundColor: colors.primary }}>
          {showSearch === true ? (
            <View
              style={{
                height: scale(64),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ height: 24, width: 24, resizeMode: 'contain' }}
                  source={require('../../assets/ic_search.png')}
                />
              </View>

              <TextInput
                placeholder={
                  appStore.appId === 'VTPost'
                    ? appStore.lang.list_chat.placeholder_search
                    : appStore.lang.list_chat.placeholder_search_VTM
                }
                placeholderTextColor={'#ffffffd1'}
                value={query}
                autoFocus={true}
                onChangeText={setQuery}
                style={{
                  fontWeight: '500',
                  fontSize: scale(15),
                  color: 'white',
                  flex: 1,
                }}
              />
              {query !== '' && (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('')
                    listChatStore.search = '';
                    listChatStore.page = 0;
                    listChatStore.getData({});
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={{ height: 24, width: 24, resizeMode: 'contain' }}
                    source={require('../../assets/ic_clear.png')}
                  />
                </TouchableOpacity>
              )}
              <View style={{
                width: 1, backgroundColor: '#eeeeee99', height: scale(20
                )
              }} />
              <TouchableOpacity
                onPress={() => {
                  setShowSearch(false);
                  setQuery('')
                  listChatStore.search = '';
                  // listChatStore.page = 0;
                  // listChatStore.getData({});
                }}
                style={{
                  width: scale(54),
                  height: scale(50),
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: scale(15),
                    color: 'white',
                    marginRight: 16,
                  }}
                >
                  {appStore.lang.common.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                height: scale(64),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if(appStore.appId==='Admin'){
                    Navigation.push(props.componentId, {
                      component: {
                        name: 'Admin.ScanQR',
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
                          callback: data=>{
                            console.log(data)
                          }
                        },
                      },
                    });
                  }else{
                    if (props.buttonBack !== false) {
                      Navigation.pop(props.componentId);
                    }
                  }
                }}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {props.buttonBack !== false && appStore.appId!=='Admin' && (
                  <Image
                    style={{ height: 36, width: 36, resizeMode: 'contain' }}
                    source={require('../../assets/ic_back.png')}
                  />
                )}
                {appStore.appId==='Admin' && (
                  <Image
                    style={{ height: 36, width: 36, resizeMode: 'contain' }}
                    source={require('../../assets/ic_qr.png')}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: scale(17),
                  color: 'white',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {appStore.appId === 'VTPost' ? appStore.lang.list_chat.message : 'Trò chuyện'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowSearch(true)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ height: 24, width: 24, resizeMode: 'contain' }}
                  source={require('../../assets/ic_search.png')}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {
          listChatStore.data.length === 0 &&  listChatStore.dataPin.length === 0 && !listChatStore.isLoading && !listChatStore.isLoadingPin &&
          (
          <TouchableOpacity
            onPress={() => intLoad()}
            style={{ alignItems: 'center', height: Dimensions.get('window').height, backgroundColor: 'white'}}>
            <Image source={require('../../assets/ic_message_empty.png')} style={{ width: 120, height: 120, resizeMode: 'contain', marginTop: 28 }} />
            <Text style={{ fontWight: '500', fontSize: 15, color: colors.primaryText, marginTop: 16, }}>Quý khách chưa có tin nhắn</Text>
          </TouchableOpacity>
          )
        }
        <FlatList
          refreshing={listChatStore.isLoading}
          onRefresh={() => {
            listChatStore.page = 0;
            listChatStore.getData({});
          }}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item) => item?.message?._id}
          onEndReached={() => () => {
            listChatStore.getData({})
          }}
          style={{ flex: 1, backgroundColor: 'white' }}
          data={listChatStore.data}
          extraData={listChatStore.data}

          ItemSeparatorComponent={() => (
            <View style={{ backgroundColor: 'white', height: 1 }}>
              <View
                style={{
                  backgroundColor: '#E5E5E5',
                  height: 1,
                  marginLeft: 76,
                  marginRight: 16,
                }}
              ></View>
            </View>
          )}
          renderItem={renderItem}
        />
        {props.admin && (
          <View
            style={{
              width: 58,
              height: 58,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 27,
              bottom: 27,
              backgroundColor: colors.primary,
              borderRadius: 58 / 2,
            }}
          >
            <Image
              style={{ height: 25, width: 25, resizeMode: 'contain' }}
              source={require('../../assets/ic_add_chat.png')}
            />
          </View>
        )}
      <BottomSheetChatOptions ref={bottomSheetModalRef} />
    </SafeAreaView>
    </KeyboardAvoidingView>

  );
});
