import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import { observer } from 'mobx-react-lite';
import colors from '../../Styles';
import ChatSwipeableRow from "../../components/ChatSwipeableRow";
import listChatStore from "./ListChatStore";
import appStore from "../AppStore";
import moment from "moment";


export const ListChatScreen =  observer(function ListChatScreen ({ navigation }){
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    listChatStore.page = 0
    listChatStore.getData({
      search: search
    })
  }, [])

  const navigationChat = (data) =>{
    navigation.push('ChatScreen',data)
  }

  const renderItem = ({item, index})=>{

    let setting = {}
    try{
      setting = item.settings.find(i=>i.user_id===(appStore.user.type+'_'+appStore.user.user_id))
    }catch (e) {

    }

    // if(item.participants.length>2){
    //   //Group Chat
    //   <ChatSwipeableRow
    //     onPress1={()=>{
    //       listChatStore.pin({
    //         conversation_id: item._id
    //       })
    //     }}
    //     onPress3={()=>{
    //       listChatStore.hide({
    //         conversation_id: item._id
    //       })
    //     }}
    //   >
    //     <TouchableOpacity
    //       onPress={()=>{
    //         navigation.push('ChatScreen')
    //       }}
    //       style={{flexDirection: 'row', backgroundColor: index===0?'#F8F8FA':'white', paddingVertical: 12, paddingHorizontal: 16}}>
    //       <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
    //         <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
    //         <Image style={{height: 12, width: 12, resizeMode: 'center', position: 'absolute', top: 36, left: 36 }} source={require('../../assets/ic_online.png')} />
    //       </View>
    //       <View style={{flex: 1,}}>
    //
    //         <View style={{flexDirection: 'row'}}>
    //           <Text  style={{ flex: 1,  fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{item.participants[0].first_name+ ' '+item.participants[0].last_name} <Text style={{fontSize: 13, fontWeight: '400',  color: colors.neutralText}}>- Bưu tá </Text></Text>
    //           <Text style={{textAlign: 'right', color: colors.neutralText}}>Hôm nay</Text>
    //         </View>
    //         <View style={{flexDirection: 'row',  paddingTop: 6, alignItems: 'center'}}>
    //           <Text  style={{ flex:1, fontSize: 15, fontWeight: '400', color: colors.neutralText,}}>Bạn: Dạ mình cảm ơn</Text>
    //           <View style={{flexDirection: 'row',}}>
    //             <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10 }} source={require('../../assets/ic_pin.png')} />
    //             <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10 }} source={require('../../assets/ic_mute.png')} />
    //             <Image style={{height: 16, width: 16, resizeMode: 'center',  marginLeft: 10  }} source={require('../../assets/avatar_default.png')} />
    //             <View style={{height: 16, width: 16, backgroundColor: colors.primary, borderRadius: 8,  marginLeft: 10, alignItems: 'center', justifyContent: 'center'  }}>
    //               <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>{'3'}</Text>
    //             </View>
    //
    //           </View>
    //         </View>
    //       </View>
    //     </TouchableOpacity>
    //   </ChatSwipeableRow>
    //
    //
    // } else
      if(item.participants.length==2){
      //Private Chat
      let receiver = {}
      let isMe = false
      try{
        receiver = item.participants.find(i=>i.user_id!==appStore.user.user_id)

        isMe = (appStore.user.type+'_'+appStore.user.user_id)===item.sender
      }catch (e) {

      }


      return(
        <ChatSwipeableRow
          onPress1={()=>{
            listChatStore.pin({
              conversation_id: item._id
            })
          }}
          onPress3={()=>{
            listChatStore.hide({
              conversation_id: item._id
            })
          }}
        >
          <TouchableOpacity
            onPress={()=>{
              navigationChat( {...item, ...{receiver: receiver}})
            }}
            style={{flexDirection: 'row', backgroundColor: index===0?'#F8F8FA':'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
              <Image style={{height: 12, width: 12, resizeMode: 'center', position: 'absolute', top: 36, left: 36 }} source={require('../../assets/ic_online.png')} />
            </View>
            <View style={{flex: 1,}}>

              <View style={{flexDirection: 'row'}}>
                <Text  style={{ flex: 1,  fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{receiver?.first_name+ ' '+receiver?.last_name} {receiver?.type==='VTMAN' && <Text style={{fontSize: 13, fontWeight: '400',  color: colors.neutralText}}>- Bưu tá </Text>} </Text>
                <Text style={{textAlign: 'right', color: colors.neutralText}}>{moment(item.message.created_at).format('DD/MM')}</Text>
              </View>
              <View style={{flexDirection: 'row',  paddingTop: 6, alignItems: 'center'}}>
                <Text  style={{ flex:1, fontSize: 15, fontWeight: '400', color: setting?.unread_message_count>0?colors.primaryText:colors.neutralText,}}>{isMe && "Bạn:"} {item.message.text}</Text>
                <View style={{flexDirection: 'row',}}>
                  {
                    setting?.is_pin &&
                    <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10 }} source={require('../../assets/ic_pin.png')} />
                  }
                  {
                    setting?.is_mute &&
                    <Image style={{height: 16, width: 16, resizeMode: 'center', marginLeft: 10}}
                           source={require('../../assets/ic_mute.png')}/>
                  }
                  {/*<Image style={{height: 16, width: 16, resizeMode: 'center',  marginLeft: 10  }} source={require('../../assets/avatar_default.png')} />*/}
                  {
                    setting?.unread_message_count>0 && <View style={{height: 16, width: 16, backgroundColor: colors.primary, borderRadius: 8,  marginLeft: 10, alignItems: 'center', justifyContent: 'center'  }}>
                      <Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>{setting?.unread_message_count}</Text>
                    </View>
                  }


                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ChatSwipeableRow>
      )

    }

  }


  return <SafeAreaView style={{  flex: 1 }} >
    <KeyboardAvoidingView
      style={{flex: 1,}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={{ height: 50,  backgroundColor: colors.primary,}}>
      {
        showSearch===true ?
          <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <View
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{height: 24, width: 24, resizeMode: 'contain' }} source={require('../../assets/ic_search.png')} />
            </View>

            <TextInput
              placeholder={'Nhập tên bưu tá, nhóm'}
              placeholderTextColor={'white'}
              value={search}
              autoFocus={true}
              onChangeText={text=>setSearch(text)}
              style={{fontWeight: '400', fontSize: 15, color: 'white',  flex: 1,}}/>
            {
              search !=='' &&
              <TouchableOpacity
                onPress={()=>setSearch('')}
                style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                <Image style={{height: 24, width: 24, resizeMode: 'contain' }} source={require('../../assets/ic_clear.png')} />
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={()=>setShowSearch(false)}
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontWeight: '400', fontSize: 15, color: 'white', marginRight: 16}}>{
                'Huỷ'
              }
              </Text>
            </TouchableOpacity>
          </View>:

          <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <TouchableOpacity
              onPress={()=>navigation.pop()}
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{height: 36, width: 36, resizeMode: 'contain',  }} source={require('../../assets/ic_back.png')} />
            </TouchableOpacity>
            <Text style={{fontWeight: '600', fontSize: 17, color: 'white', flex: 1, textAlign: 'center' }}>{
              'Tin Nhắn'
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
        listChatStore.getData({search})
      }}
      style={{flex: 1, backgroundColor: 'white'}}
      data={listChatStore.data}
      ItemSeparatorComponent={()=>  (<View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>)}
      renderItem={renderItem}
    />
    {/*<View style={{width: 58, height: 58, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 27, bottom: 27, backgroundColor: colors.primary, borderRadius: 58/2}}>*/}
    {/*  <Image style={{height: 25, width: 25, resizeMode: 'contain',  }} source={require('../../assets/ic_add_chat.png')} />*/}
    {/*</View>*/}
    </KeyboardAvoidingView>
  </SafeAreaView>;
})