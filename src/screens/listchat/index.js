import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import colors from '../../Styles';
import Swipeable from 'react-native-swipeable';
import listChatStore from "./ListChatStore";
import appStore from "../AppStore";
import moment from "moment";
import { Navigation } from 'react-native-navigation';
import Image from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {scale} from "../../utils";


export const ListChatScreen =  observer(function ListChatScreen ( props){
  const [showSearch, setShowSearch] = useState(false);

  useEffect(()=>{
    listChatStore.search = ''
    intLoad()
  }, [])

  const intLoad = () => {
    listChatStore.page = 0
    listChatStore.getData({

    })
  }

  const navigationChat = (data) =>{
    Navigation.push(props.componentId, {
      component: {
        name: "ChatScreen",
        passProps: {
          data: data
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
      }
    })
  }

  const renderItem = ({item, index})=>{

    let setting = {}
    try{
      let mySetting = item.settings.find(i=>i.user_id===(appStore.user.type+'_'+appStore.user.user_id))
      setting = mySetting?mySetting:{}
      // if(index%2===0)
      // setting.unread_count = 2
    }catch (e) {

    }
    let receiver = {}
    let isMe = false
    try{
      receiver = item.detail_participants.find(i=>i.user_id!==appStore.user.user_id)

      isMe = (appStore.user.type+'_'+appStore.user.user_id)===item.message.sender
    }catch (e) {

    }

    const rightButtons = [
      <TouchableOpacity
        onPress={()=>{
          if(setting.is_pin){
            listChatStore.unPin({ conversation_id: item._id },   ()=>intLoad())
          }else{
            listChatStore.pin({ conversation_id: item._id }, ()=>intLoad())
          }
        }}
        style={{
          width: 66,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3B7CEC',
          flex: 1,
        }}>
        <Image  resizeMode={'contain'}  source={setting.is_pin?require('../../assets/ic_unpin.png'):require('../../assets/ic_pin_white.png')} style={{width: 20, height: 20, resizeMode: 'contain'}}/>
        <Text style={{  color: 'white',
          fontSize: 13,
          backgroundColor: 'transparent',
          textAlign: 'center',
          paddingTop: 4,}}>{setting.is_pin?appStore.lang.list_chat.unpin:appStore.lang.list_chat.pin}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={()=>{
          listChatStore.mute({ conversation_id: item._id, is_show: !setting.is_hide_notification}, ()=>intLoad())
        }}
        style={{
          width: 66,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EB960A',
          flex: 1,
        }}>
        <Image resizeMode={'contain'} source={!setting.is_hide_notification?require('../../assets/ic_notify_off.png'):require('../../assets/ic_notify.png')} style={{width: 24, height: 24, resizeMode: 'contain'}}/>
        <Text style={{  color: 'white',
          fontSize: 13,
          backgroundColor: 'transparent',
          textAlign: 'center',
          paddingTop: 4,}}>{setting.is_hide_notification?appStore.lang.list_chat.unmute:appStore.lang.list_chat.mute}</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={()=>{
          listChatStore.hide({ conversation_id: item._id },()=>intLoad())
        }}
        style={{
          width: 66,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EE0033',
          flex: 1,
        }}>
        <Image resizeMode={'contain'} source={require('../../assets/ic_delete.png')} style={{width: 24, height: 24, resizeMode: 'contain'}}/>
        <Text style={{  color: 'white',
          fontSize: 13,
          backgroundColor: 'transparent',
          textAlign: 'center',
          paddingTop: 4,}}>{appStore.lang.list_chat.delete}</Text>
      </TouchableOpacity>,
    ];


    if(item.type==='GROUP' ){
      //Group Chat
      return (<Swipeable
        rightButtonWidth={66}
        rightButtons={rightButtons}
      >
        <TouchableOpacity
          onPress={()=>{
            navigationChat( {...item, ...{receiver: receiver}})
            listChatStore.data[index].settings =listChatStore.data[index].settings.map(i=>{
              if (i.user_id===(appStore.user.type+'_'+appStore.user.user_id)){
                i.unread_count = 0
              }
              return i
            })
            listChatStore.data = [...listChatStore.data]
          }}
          style={{flexDirection: 'row', backgroundColor: setting?.is_pin?'#F8F8FA':'white', paddingVertical: 12, paddingHorizontal: 16}}>
          <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
            <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_group.png')} />
            {/*<Image style={{height: 12, width: 12, resizeMode: 'center', position: 'absolute', top: 36, left: 36 }} source={require('../../assets/ic_online.png')} />*/}
          </View>
          <View style={{flex: 1,}}>

            <View style={{flexDirection: 'row'}}>
              <Text  style={{ flex: 1,  fontSize: 17, fontWeight: '600', color: colors.primaryText}}>Đơn {item.order_numbers[0]} </Text>
              <Text style={{textAlign: 'right', color: colors.neutralText}}>{moment(item.message.created_at).format('DD/MM')}</Text>
            </View>
            <View style={{flexDirection: 'row',  paddingTop: 6, alignItems: 'center'}}>
              <Text numberOfLines={1}  style={{ flex:1, fontSize: 15, fontWeight: '400', color: setting?.unread_count>0?colors.primaryText:colors.neutralText,}}>{item.message.has_attachment ?(<><Image source={require('../../assets/ic_attach_message.png')} style={{width: 16, height: 16,  resizeMode: 'contain'}}/>{isMe?`Bạn đã gửi ${item.message.attachment_ids.length} ảnh`: `Bạn đã nhận ${item.message.attachment_ids.length} ảnh`} </>):(item.message.type==='CREATED_QUOTE_ORDER'? <Text>{appStore.lang.list_chat.message_system}</Text>:<Text>{isMe && (appStore.lang.list_chat.you+':')} {item.message.text}</Text>)}</Text>
              <View style={{flexDirection: 'row',}}>
                {
                  setting?.is_pin &&
                  <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10 }} source={require('../../assets/ic_pin.png')} />
                }
                {
                  setting?.is_hide_notification &&
                  <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10}}
                         source={require('../../assets/ic_mute.png')}/>
                }
                {/*<Image style={{height: 16, width: 16, resizeMode: 'center',  marginLeft: 10  }} source={require('../../assets/avatar_default.png')} />*/}
                {
                  setting?.unread_count>0 && <View style={{height: 16, width: 16, backgroundColor: colors.primary, borderRadius: 8,  marginLeft: 10, alignItems: 'center', justifyContent: 'center'  }}>
                    <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>{setting?.unread_count}</Text>
                  </View>
                }


              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>)


    } else if(item.type==='PAIR'){
      //Private Chat

        return(
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
        rightButtonWidth={66}
        rightButtons={rightButtons}
      >
          <TouchableOpacity
            onPress={()=>{
              navigationChat( {...item, ...{receiver: receiver}})
              listChatStore.data[index].settings =listChatStore.data[index].settings.map(i=>{
                if (i.user_id===(appStore.user.type+'_'+appStore.user.user_id)){
                  i.unread_count = 0
                }
                return i
              })
              listChatStore.data = [...listChatStore.data]

            }}
            style={{flexDirection: 'row', backgroundColor: setting?.is_pin?'#F8F8FA':'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
              {
                <Image style={{height: 12, width: 12, resizeMode: 'center', position: 'absolute', top: 36, left: 36 }} source={require('../../assets/ic_online.png')} />
              }
            </View>
            <View style={{flex: 1,}}>

              <View style={{flexDirection: 'row'}}>
                <Text  style={{ flex: 1,  fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{receiver?.first_name+ ' '+receiver?.last_name} {receiver?.type==='VTMAN' && <Text style={{fontSize: 13, fontWeight: '400',  color: colors.neutralText}}>- {appStore.lang.common.postman} </Text>} </Text>
                <Text style={{textAlign: 'right', color: colors.neutralText}}>{moment(item.message.created_at).format('DD/MM')}</Text>
              </View>
              <View style={{flexDirection: 'row',  paddingTop: 6, alignItems: 'center'}}>
                <Text numberOfLines={1}  style={{ flex:1, fontSize: 15, fontWeight: '400', color: setting?.unread_count>0?colors.primaryText:colors.neutralText,}}>{item.message.has_attachment ?(<><Image source={require('../../assets/ic_attach_message.png')} style={{width: 16, height: 16,  resizeMode: 'contain'}}/>{isMe?`Bạn đã gửi ${item.message.attachment_ids.length} ảnh`: `Bạn đã nhận ${item.message.attachment_ids.length} ảnh`} </>):(item.message.type==='CREATED_QUOTE_ORDER'? <Text>{appStore.lang.list_chat.message_system}</Text>:<Text>{isMe && (appStore.lang.list_chat.you+':')} {item.message.text}</Text>)}</Text>
                <View style={{flexDirection: 'row',}}>
                  {
                    setting?.is_pin &&
                    <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10 }} source={require('../../assets/ic_pin.png')} />
                  }
                  {
                    setting?.is_hide_notification &&
                    <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10}}
                           source={require('../../assets/ic_mute.png')}/>
                  }
                  {/*<Image style={{height: 16, width: 16, resizeMode: 'center',  marginLeft: 10  }} source={require('../../assets/avatar_default.png')} />*/}
                  {
                    setting?.unread_count>0 && <View style={{height: 16, width: 16, backgroundColor: colors.primary, borderRadius: 8,  marginLeft: 10, alignItems: 'center', justifyContent: 'center'  }}>
                      <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>{setting?.unread_count}</Text>
                    </View>
                  }


                </View>
              </View>
            </View>
          </TouchableOpacity>
      </Swipeable>
      )

    }

  }

  function renderHeader(){
    return(
      <FlatList
        refreshing={listChatStore.isLoading}
        onRefresh={()=>{
          listChatStore.page = 0;
          listChatStore.getData({})
        }}
        keyExtractor={(item) => item._id}
        style={{ backgroundColor: 'white'}}
        data={listChatStore.dataPin}
        ItemSeparatorComponent={()=>  (<View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>)}
        renderItem={renderItem}
      />
    )
  }

  return <SafeAreaView style={{  flex: 1, backgroundColor: colors.primary, }} >
    <KeyboardAvoidingView
      style={{flex: 1,}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}>
    <View style={{ height: scale(50),  backgroundColor: colors.primary,}}>
      {
        showSearch===true ?
          <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <View
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{height: 24, width: 24, resizeMode: 'contain' }} source={require('../../assets/ic_search.png')} />
            </View>

            <TextInput
              placeholder={appStore.appId==='VTPost'? appStore.lang.list_chat.placeholder_search: appStore.lang.list_chat.placeholder_search_VTM}
              placeholderTextColor={'white'}
              value={listChatStore.search}
              autoFocus={true}
              onChangeText={text=> {

                listChatStore.search = text
                listChatStore.page = 0;
                listChatStore.getData({})
              }}
              style={{fontWeight: '400', fontSize: scale(15), color: 'white',  flex: 1,}}/>
            {
              listChatStore.search !=='' &&
              <TouchableOpacity
                onPress={()=> {
                  listChatStore.search = ''
                  listChatStore.page = 0;
                  listChatStore.getData({

                  })
                }}
                style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                <Image style={{height: 24, width: 24, resizeMode: 'contain' }} source={require('../../assets/ic_clear.png')} />
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={()=>setShowSearch(false)}
              style={{width: scale(50), height: scale(50), justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontWeight: '400', fontSize: scale(15), color: 'white', marginRight: 16}}>{
                appStore.lang.common.cancel
              }
              </Text>
            </TouchableOpacity>
          </View>:

          <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <TouchableOpacity
              onPress={()=>{
                if(props.buttonBack!==false){
                  Navigation.pop(props.componentId)
                }
              }}
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              {
                props.buttonBack!==false &&
                <Image style={{height: 36, width: 36, resizeMode: 'contain',  }} source={require('../../assets/ic_back.png')} />
              }
            </TouchableOpacity>
            <Text style={{fontWeight: '600', fontSize: scale(17), color: 'white', flex: 1, textAlign: 'center' }}>{
              appStore.lang.list_chat.message
            }
            </Text>
            <TouchableOpacity
              onPress={()=>setShowSearch(true)}
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{height: 24, width: 24, resizeMode: 'contain' }} source={require('../../assets/ic_search.png')} />
            </TouchableOpacity>
          </View>
      }
    </View>
    <FlatList
      refreshing={listChatStore.isLoading}
      onRefresh={()=>{
        listChatStore.page = 0;
        listChatStore.getData({})
      }}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item) => item._id}
      style={{flex: 1, backgroundColor: 'white'}}
      data={listChatStore.data}
      ItemSeparatorComponent={()=>  (<View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>)}
      renderItem={renderItem}
    />
      {
        props.admin &&  <View style={{width: 58, height: 58, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 27, bottom: 27, backgroundColor: colors.primary, borderRadius: 58/2}}>
          <Image style={{height: 25, width: 25, resizeMode: 'contain',  }} source={require('../../assets/ic_add_chat.png')} />
        </View>

      }

    </KeyboardAvoidingView>
  </SafeAreaView>;
})

