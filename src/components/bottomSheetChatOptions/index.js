import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Image, SafeAreaView, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider } from '../bottomSheet/bottom-sheet';
import chatStore from '../../screens/chat/ChatStore';
import { MText as Text } from '../index';
import quickMessageStore from '../../screens/chat/QuickMessageStore';
import colors from '../../Styles';
import listChatStore from '../../screens/listchat/ListChatStore';
import appStore from '../../screens/AppStore';
import { formatTimeLastMessage } from '../../utils';
import { chatVT } from '../../index';
import { Navigation } from 'react-native-navigation';
import services from '../../services'


const BottomSheetChatOptions = React.forwardRef( (props, ref)=> {
  const snapPoints = useMemo(() => ['30%'], []);
  const bottomSheetRef = useRef()
  const [data, setData] = useState([])
  const [order, setOrder] = useState({})

  useImperativeHandle(ref, // forwarded ref
    () => {
      return {
        updateData(data, order) {
          setData(data)
          setOrder(order)
          console.log('update data', data, order)
        },
        present() {
          bottomSheetRef.current?.present()
        },
        dismiss() {
          bottomSheetRef.current?.dismiss()
        },
      } // the forwarded ref value
    }, [])

  const toChat = (listUserId)=>{
    appStore.createConversation({
      vtm_user_ids: listUserId,
      order_number: order.ORDER_NUMBER,
    }, (conversation)=>{
      Navigation.push(props.componentId, {
        component: {
          name: 'ChatScreen',
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
            order: order
          }
        }
      })

    }, error=>alert(error) )
  }

  const toChatGroup = ()=> {
    try {
      ref?.current?.dismiss()
    }catch (e) {

    }


  }

  const getUserIdFromPhone = async (phone)=>{
    try{
      const response = await services.create().getVTMCustomerByPhone({
        phone
      });
      console.log(response)
      if(response.data?.data?.existed){
        if(response.data?.data?.cus_info?.cus_cus_id){
          return response.data?.data?.cus_info?.cus_cus_id
        }else{

        }
      }else{
        return 0
      }
    }catch(e){
      console.log(e)
      return -1
    }
   
  }

  const toChatPhone = async(phone)=>{
    try {
      ref?.current?.dismiss()
    }catch (e) {

    }
    appStore.createConversation({
      vtp_user_ids: [await getUserIdFromPhone(phone)],
      order_number: order.ma_phieugui,
    }, (conversation)=>{
      Navigation.push(props.componentId, {
        component: {
          name: 'ChatScreen',
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
            order: order
          }
        }
      })

    }, error=>alert(error) )
  }
  const toChatReceiver = ()=>{
    try {
      ref?.current?.dismiss()
    }catch (e) {

    }
    appStore.createConversationWithReceiver({
      order_number: order.ORDER_NUMBER
    }, (conversation)=>{
      Navigation.push(props.componentId, {
        component: {
          name: 'ChatScreen',
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
            order
          }
        }
      })

    }, error=>alert(error) )
  }

  const renderItem = (item, index)=>{
    return(
      <TouchableOpacity
        onPress={()=>{
          try {
            ref?.current?.dismiss()
          }catch (e) {

          }
          toChat([
            item.USERID
          ])
        }}
        style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
        <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
          <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
        </View>
        <View style={{flex: 1,}}>
          <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{`Chat với bưu tá ${item.RECEIVER_POSTMAN===1?'nhận': 'gửi'}`}</Text>
          <Text  style={{ fontSize: 15, fontWeight: '500', color: colors.neutralText, paddingTop: 4}}>{item.FIRSTNAME + ' '+ item.LASTNAME}</Text>

        </View>
      </TouchableOpacity>
    )
  }

  return (
    <BottomSheetModalProvider
    >
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={()=>{
          return <TouchableOpacity
            activeOpacity={1}
            onPress={()=>ref?.current?.dismiss()}
            style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000059'}}/>
        }}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => {

        }}
      >
        {
          appStore.appId ==='VTPost'&&
          <SafeAreaView style={{flex: 1}}>
         
          <TouchableOpacity
            onPress={toChatReceiver}
            style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
            </View>
            <View style={{flex: 1,}}>
              <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{`Chat với người nhận`}</Text>
              <Text  style={{ fontSize: 15, fontWeight: '500', color: colors.neutralText, paddingTop: 4}}>{order.RECEIVER_FULLNAME}</Text>

            </View>
          </TouchableOpacity>
          {
            data.length>0 &&
            <View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>
          }
          <BottomSheetFlatList
            data={data}
            renderItem={({item, index})=>renderItem(item, index)}
            ItemSeparatorComponent={()=><View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>}
          />


        </SafeAreaView>
        }
        
        {
          appStore.appId ==='VTMan'&&
          <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            onPress={toChatGroup}
            style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_create_group.png')} />
            </View>
            <View style={{flex: 1,}}>
              <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{`Chat nhóm`}</Text>
              <Text  style={{ fontSize: 15, fontWeight: '500', color: colors.neutralText, paddingTop: 4}}>{'Tham gia của nhiều người'}</Text>

            </View>
          </TouchableOpacity>
          <View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>
          <TouchableOpacity
            onPress={()=>{
              toChatPhone(order.tel_khgui)
            }}
            style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
            </View>
            <View style={{flex: 1,}}>
              <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{`Chat với khách hàng gửi`}</Text>
              <Text  style={{ fontSize: 15, fontWeight: '500', color: colors.neutralText, paddingTop: 4}}>{order.ten_khgui}</Text>

            </View>
          </TouchableOpacity>
          <View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>
          <TouchableOpacity
            onPress={()=>{
              toChatPhone(order.tel_khnhan)
            }}
            style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
            </View>
            <View style={{flex: 1,}}>
              <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{`Chat với khách hàng nhận`}</Text>
              <Text  style={{ fontSize: 15, fontWeight: '500', color: colors.neutralText, paddingTop: 4}}>{order.ten_khnhan}</Text>

            </View>
          </TouchableOpacity>
  

        </SafeAreaView>
        }
      </BottomSheetModal>
    </BottomSheetModalProvider>

  )
})

export default BottomSheetChatOptions
