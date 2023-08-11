import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MText as Text } from '../../components';
import { observer } from 'mobx-react-lite';
import colors from '../../Styles';
import Swipeable from 'react-native-swipeable';
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

export const ListChatScreen = observer(function ListChatScreen(props) {
  const [showSearch, setShowSearch] = useState(false);
  const bottomSheetModalRef = useRef();
  const [query, setQuery] = useState("");

  useEffect(() => {
    listChatStore.search = '';
    intLoad();
    // bottomSheetModalRef.current?.present();
    return () => {
      bottomSheetModalRef.current?.dismiss();
    };
  }, []);

  const intLoad = () => {
    listChatStore.page = 0;
    listChatStore.getData({});
  };

  const navigationChat = (data) => {
    Navigation.push(props.componentId, {
      component: {
        name: 'ChatScreen',
        passProps: {
          data: data,
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
      if (item.message.type === 'CREATED_QUOTE_ORDER') {
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

      if (item.message.type === 'VOICE') {
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
            <Image
              source={require('../../assets/ic_attach_message.png')}
              style={{ width: 16, height: 16, resizeMode: 'contain' }}
            />
            <Text>{prefix + appStore.lang.list_chat.message_voice}</Text>
          </Text>
        );
      }
      if (item.message.type === 'LOCATION') {
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
            <Image
              source={require('../../assets/ic_attach_message.png')}
              style={{ width: 16, height: 16, resizeMode: 'contain' }}
            />
            <Text>{prefix + appStore.lang.list_chat.message_location}</Text>
          </Text>
        );
      }
      if (item.message.type === 'FILE') {
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
            <Image
              source={require('../../assets/ic_attach_message.png')}
              style={{ width: 16, height: 16, resizeMode: 'contain' }}
            />
            <Text>{prefix + appStore.lang.list_chat.message_doc}</Text>
          </Text>
        );
      }
      if (item.message.has_attachment) {
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
                ? `Bạn đã gửi ${item.message.attachment_ids.length} ảnh/video`
                : `Bạn đã nhận ${item.message.attachment_ids.length} ảnh/video`)}
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
        {prefix + item.message.text}
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
        item.message.sender;
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
              }catch (e) {

              }

              listChatStore.data.unshift(item)
              listChatStore.dataPin = [...listChatStore.dataPin.filter(i=>i._id !== item._id)]
              listChatStore.data = [...listChatStore.data]
            });
          } else {
            listChatStore.pin({ conversation_id: item._id }, () => {
              try{
                item.settings = item.settings.map(i => {
                  i.is_pin = true;
                  return i
                })
              }catch (e) {

              }
              listChatStore.dataPin.unshift(item)
              listChatStore.data = [...listChatStore.data.filter(i=>i._id !== item._id)]
              listChatStore.dataPin = [...listChatStore.dataPin]
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
          try{
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

          }catch (e) {

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
        <Swipeable rightButtonWidth={66} rightButtons={rightButtons}>
          <TouchableOpacity
            onPress={() => {
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
                    flex: 1,
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.primaryText,
                  }}
                >
                  Đơn {item.order_numbers[0]}{' '}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '400',
                      color: colors.neutralText,
                    }}
                  >
                    - {orderStatus(item.orders[0]?.order_status)}{' '}
                  </Text>
                </Text>
                <Text style={{ textAlign: 'right', color: colors.neutralText }}>
                  {formatTimeLastMessage(item.message.created_at)}
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
                        marginLeft: 10,
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
                        marginLeft: 10,
                      }}
                      source={require('../../assets/ic_mute.png')}
                    />
                  )}
                  {item.message?.read_by?.map((item) => (
                    <>
                      {
                        item !== (appStore.user.type + '_' + appStore.user.user_id) &&
                        <Image
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'center',
                            marginLeft: 10,
                          }}
                          source={item.includes('VTM') ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
                        />
                      }
                    </>
                  ))}
                  {setting?.unread_count > 0 && (
                    <View
                      style={{
                        height: 16,
                        width: 16,
                        backgroundColor: colors.primary,
                        borderRadius: 8,
                        marginLeft: 10,
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
        <Swipeable rightButtonWidth={66} rightButtons={rightButtons}>
          <TouchableOpacity
            onPress={() => {
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
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.primaryText,
                  }}
                >
                  {receiver?.first_name?receiver?.first_name:'' + ' ' + receiver?.last_name?receiver?.last_name:''}{' '}
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
                <Text style={{ textAlign: 'right', color: colors.neutralText }}>
                  {formatTimeLastMessage(item.message.created_at)}
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
                {item.message?.read_by?.map((reader) => (
                  <>
                    {
                      reader !== (appStore.user.type + '_' + appStore.user.user_id) && reader !== item?.sender &&
                      <Image
                        style={{
                          height: 16,
                          width: 16,
                          resizeMode: 'center',
                          marginLeft: 10,
                        }}
                        source={reader.includes('VTM') ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
                      />
                    }
                  </>
                ))}
                <View style={{ flexDirection: 'row' }}>
                  {setting?.is_pin && (
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'center',
                        marginLeft: 10,
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
                        marginLeft: 10,
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
                        marginLeft: 10,
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
        refreshing={listChatStore.isLoading}
        onRefresh={() => {
          listChatStore.page = 0;
          listChatStore.getData({});
        }}
        keyExtractor={(item) => item._id}
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


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      listChatStore.search = query;
      listChatStore.page = 0;
      listChatStore.getData({});
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
      >
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
                placeholderTextColor={'white'}
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
              {listChatStore.search !== '' && (
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
              <TouchableOpacity
                onPress={() => {
                  setShowSearch(false);
                  setQuery('')
                  listChatStore.search = '';
                  listChatStore.page = 0;
                  listChatStore.getData({});
                }}
                style={{
                  width: scale(50),
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
                  if (props.buttonBack !== false) {
                    Navigation.pop(props.componentId);
                  }
                }}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {props.buttonBack !== false && (
                  <Image
                    style={{ height: 36, width: 36, resizeMode: 'contain' }}
                    source={require('../../assets/ic_back.png')}
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
        <FlatList
          refreshing={listChatStore.isLoading}
          onRefresh={() => {
            listChatStore.page = 0;
            listChatStore.getData({});
          }}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item) => item._id}
          onEndReached={() => setTimeout(() => {
            listChatStore.getData({})
          }, 150)}
          style={{ flex: 1, backgroundColor: 'white' }}
          data={listChatStore.data}
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
      </KeyboardAvoidingView>
      <BottomSheetChatOptions ref={bottomSheetModalRef} />
    </SafeAreaView>
  );
});
