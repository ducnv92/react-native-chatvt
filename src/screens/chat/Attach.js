import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, {BottomSheetFlatList, BottomSheetModal} from '../../components/bottomSheet/bottom-sheet';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import { Log } from '../../utils';
import {
  Dimensions,
  FlatList,
  Image, KeyboardAvoidingView,
  Modal, PermissionsAndroid,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {MTextInput as TextInput} from '../../components'
import {MText as Text} from '../../components'
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import colors from '../../Styles';
import appStore from '../AppStore';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import DocumentPicker, {types} from "../../components/documentPicker";
import uuid from "react-native-uuid";
import Geolocation from 'react-native-geolocation-service';
import quickMessageStore from "./QuickMessageStore";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import inputStore from './InputStore';
import InputStore from './InputStore';




const QuickMessageModal =observer(function QuickMessageModal ( props) {

  const updateQuickMessage = () => {
    if(!(quickMessageStore.currentMessage.text && quickMessageStore.currentMessage.text.trim()!=='')){
      return
    }
    if(quickMessageStore.currentMessage._id){
      quickMessageStore.update({
        ...quickMessageStore.currentMessage,
        ...{
          text: quickMessageStore.currentMessage.text
        }
      }, ()=>{
        quickMessageStore.showModal = false
        quickMessageStore.currentMessage = {}
      })
    }else{
      quickMessageStore.create({
        text: quickMessageStore.currentMessage.text,
        type: "MESSAGE",
      }, ()=>{
        quickMessageStore.showModal = false
        quickMessageStore.currentMessage = {}
      })
    }
  }

  return (
    <Modal
      visible={quickMessageStore.showModal}
      transparent={true}
      animationType={'fade'}
    >
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#00000059',  justifyContent: 'flex-end'}}>
          <>
            <View style={{height: 56, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8FA'}}>
              <Text style={{ position: 'absolute', width: '100%', textAlign: 'center', fontWeight: '600', fontSize: 17, color: '#44494D'}} >Tạo tin chat nhanh</Text>
              <TouchableOpacity
                onPress={()=>{
                  quickMessageStore.showModal = false
                }}
                style={{width: 56, height: 56, alignItems: 'center', justifyContent: 'center', }}>
                <Image source={require('../../assets/ic_close.png')} style={{width: 24, height: 24, resizeMode: 'contain'}} resizeMode={'contain'}/>

              </TouchableOpacity>
              <View style={{flex: 1}}/>

            </View>
            <View style={{backgroundColor: 'white'}}>
              <TextInput
                value={quickMessageStore.currentMessage.text}
                multiline={true}
                autoFocus={true}
                placeholder={'Nội dung tin nhắn'}
                numberOfLines={10}
                style={{textAlignVertical: 'top', minHeight: 179,   margin: 16, borderColor: '#DCE6F0', borderWidth: 1, borderRadius: 10, padding: 12 }}
                onChangeText={text =>{
                  quickMessageStore.currentMessage = {...quickMessageStore.currentMessage, ...{text}}
                }}
              />
              <TouchableOpacity
                onPress={updateQuickMessage}
                style={{ margin: 16, alignItems: 'center', justifyContent: 'center', padding: 16,  backgroundColor: colors.primary, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Lưu chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  )

})
const QuickMessage =observer(function QuickMessage ( props) {
  const snapPoints = useMemo(() => ['40%', '80%'], []);
  const bottomSheetModalRef = useRef();
  const insets = useSafeAreaInsets();

  useEffect(()=>{

    quickMessageStore.getData({})

      bottomSheetModalRef.current?.present();

    return()=>{
      bottomSheetModalRef.current?.dismiss();
    }
  }, [])

  const showUpdate = (message) => {
    quickMessageStore.currentMessage = message
    quickMessageStore.showModal = true
  }

  const sendMessage = (msg) => {
    InputStore.input = msg.text
    chatStore.showAttachModal = false;
    chatStore.tab = 1;
    try{
      inputStore.inputRef()
    }catch (e) {
      Log(e)
    }
  }


  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={()=>sendMessage(item)}
        style={{flexDirection: 'row', alignItems: 'center',  paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#EEEEEE' }}>
          <Text style={{flex: 1, flexWrap: 'wrap', fontWeight: '500', fontSize: 15, color: colors.neutralText}}>
            {item.text}
          </Text>
        <TouchableOpacity
          onPress={()=>showUpdate(item)}
          style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/ic_edit_quick_message.png')} style={{width: 16, height: 16,  resizeMode: 'contain'}} resizeMode={'contain'}/>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return(
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      bottomInset={77+insets.bottom}
      snapPoints={snapPoints}
      onDismiss={() => {
        if(chatStore.tab === 1){
          chatStore.showAttachModal = false
        }
      }}
    >
      <View style={{height: 56, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8FA'}}>
        <Text style={{ position: 'absolute', width: '100%', textAlign: 'center', fontWeight: '600', fontSize: 17, color: '#44494D'}} >Chat nhanh</Text>
        <TouchableOpacity
          onPress={()=>{
            chatStore.showAttachModal = false
          }}
          style={{width: 56, height: 56, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/ic_close.png')} style={{width: 24, height: 24, resizeMode: 'contain'}} resizeMode={'contain'}/>

        </TouchableOpacity>
        <View style={{flex: 1}}/>
        {
          quickMessageStore.data.length>0?
            <TouchableOpacity
              onPress={()=>{
                quickMessageStore.currentMessage = {}
                quickMessageStore.showModal = true
              }}
              style={{paddingHorizontal: 16, height: 56, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 15, fontWeight: '600', color: '#3B7CEC'}}>Thêm mới</Text>
            </TouchableOpacity>:
            <View
              style={{paddingHorizontal: 16, height: 56}}>
            </View>
        }
      </View>
      {
        quickMessageStore.data.length ===0 &&
        <View style={{flex: 1,}}>
          <Image source={require('../../assets/ic_quick_message_empty.png')} style={{width: 124, height: 99, alignSelf: 'center' }}/>
          <Text style={{color: colors.neutralText, fontSize: 15, fontWeight: '500', textAlign: 'center'}}>Bạn chưa có tin nhắn chat nhanh</Text>
          <TouchableOpacity
            onPress={()=>{
              quickMessageStore.showModal = true
            }}
            style={{ position: 'absolute', bottom: 56, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16,  backgroundColor: colors.primary, borderRadius: 10 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Tạo tin nhắn nhanh</Text>
          </TouchableOpacity>
        </View>
      }
    <BottomSheetFlatList
      data={quickMessageStore.data}
      renderItem={renderItem}
      ItemSeparatorComponent={()=><View style={{height: 1, backgroundColor: ''} }/>}
       />
      <QuickMessageModal/>
    </BottomSheetModal>
  )
})

const ImageMessage =observer(function ImageMessage ( props) {
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const bottomSheetModalRef = useRef();

  useEffect(()=>{
      bottomSheetModalRef.current?.present();

    return()=>{
      bottomSheetModalRef.current?.dismiss();
    }
  }, [])



  return(
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        bottomInset={77+insets.bottom}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
        onDismiss={() => {
          chatStore.images = []
          if(chatStore.tab === 0){
            chatStore.showAttachModal = false
            chatStore.tab = 1;
          }
        }}
      >
        <CameraRollPicker
          assetType={'All'}
          groupTypes={"All"}
          include={['playableDuration', 'filename', 'fileExtension']}
          selected={chatStore.images}
          callback={(images) => {

            chatStore.images = images
          }} />
      </BottomSheetModal>

    </>

  )
})

const LocationMessage =observer(function LocationMessage ( props) {
  const bottomSheetModalRef = useRef();
  const insets = useSafeAreaInsets();

  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0
  })


  const requestPermission = (callback)=>{
    const permission = Platform.OS ==='android'?PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION:PERMISSIONS.IOS.LOCATION_WHEN_IN_USE

    request(permission).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:

          break;
        case RESULTS.DENIED:

          break;
        case RESULTS.LIMITED:

          break;
        case RESULTS.GRANTED:

          callback()
          break;
        case RESULTS.BLOCKED:

          break;
      }
    });
  }

  useEffect(()=>{

      bottomSheetModalRef.current?.present();

    requestPermission(()=>{
      Geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition( {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          })


        },
        (error) => {
          // See error code charts below.

        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    })
    return()=>{
      bottomSheetModalRef.current?.dismiss();
    }
  }, [])

  const sendMap = async () => {
    try{
      chatStore.showAttachModal = false
      chatStore.tab = 1;
      const message = {
        id: uuid.v4(),
        type: "LOCATION",
        location:  {
          latitude: chatStore.location.latitude,
          longitude: chatStore.location.longitude,
        },
        status: "sending",
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: chatStore.conversation_id
      }

      chatStore.data.unshift(message)
      chatStore.sendMessage(message)
    }catch (e) {
      console.log(e)
    }
  }


  return(
    <>
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      bottomInset={77+insets.bottom}
      snapPoints={['80%']}
      onDismiss={() => {
        if(chatStore.tab===3){
          chatStore.showAttachModal = false
          chatStore.tab = 1;
        }
      }}
    >
    <View
      style={{backgroundColor: 'white',
        height: '100%',
        width: '100%',
      }}>
      <MapView
        zoomTapEnabled={false}
        scrollEnabled={true}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          height: '100%',
          width: '100%',
        }}
        region={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onRegionChange={position=>{
          chatStore.location = position
        }}
      >
      </MapView>
      <Image source={require('../../assets/ic_map_pin.png')}
             style={{width: 30, height: 30, resizeMode: 'contain', position: 'absolute', top: '50%', left: '50%',  marginLeft: -15,
               marginTop: -30,}}
             resizeMode="contain"
      />
    </View>

    </BottomSheetModal>
  <TouchableOpacity
    onPress={sendMap}
    style={{ position: 'absolute', zIndex: 99999, bottom: 96+insets.bottom, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16,  backgroundColor: colors.primary, borderRadius: 10 }}>
    <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Chia sẻ vị trí</Text>
  </TouchableOpacity>
   </>

  )
})



export const AttachScreen = observer(function AttachScreen(props) {



  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.xls, types.docx, types.xlsx, types.docx],
      });

      chatStore.showAttachModal = false

      const message = {
        id: uuid.v4(),
        "type": "FILE",
        attachmentLocal: response,
        has_attachment: true,
        "text": '',
        "status": "sending",
        sender: appStore.user.type + '_' + appStore.user.user_id,
        conversation_id: props.data._id
      }
      chatStore.data.unshift(message)
      chatStore.sendMessage(message)
    } catch (err) {
      console.warn(err);
    }
  }

  const requestCameraPermission = async (callback) => {
    try {
      let permission = ''
      if(Platform.OS === 'android'){
        if(Platform.Version>=33){
          const res = PermissionsAndroid.requestMultiple([
            'android.permission.READ_MEDIA_IMAGES',
            'android.permission.READ_MEDIA_VIDEO',
          ]).then(
            (statuses) =>
              statuses['android.permission.READ_MEDIA_IMAGES'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
              statuses['android.permission.READ_MEDIA_VIDEO'] ===
              PermissionsAndroid.RESULTS.GRANTED,
          );
          res.then(res=>{
            if(res){
              callback()
            }
          })
          return;
        }
        permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }else{
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      }


      const result = await request(permission)
      switch (result) {
        case RESULTS.UNAVAILABLE:

          break;
        case RESULTS.DENIED:

          break;
        case RESULTS.LIMITED:

          break;
        case RESULTS.GRANTED:

          //
          // bottomSheetRef.current?.present();
         callback()
          break;
        case RESULTS.BLOCKED:

          break;
      }
    } catch (err) {
      Log(err);
    }
  };

  const getImageMessage = () => {
    if(chatStore.tab === 0 ){
      if(!chatStore.tabImage){
        chatStore.tabImage = <ImageMessage {...props}/>
      }
      return chatStore.tabImage
    }else{
      return <View/>
    }

  }

  const getQuickMessage = () => {
    if(chatStore.tab === 1 ){
      if(!chatStore.tabQuickMessage){
        chatStore.tabQuickMessage =  <QuickMessage {...props}/>
      }
      return chatStore.tabQuickMessage
    }else{
      return <View/>
    }
  }

  const getLocationMessage = () => {
    if(chatStore.tab === 3 ){
      if(!chatStore.tabLocationMessage){
        chatStore.tabLocationMessage =  <LocationMessage {...props}/>
      }
      return chatStore.tabLocationMessage
    }else{
      return <View/>
    }
  }




  return(<>
    {
      chatStore.showAttachModal &&
      <SafeAreaView>
          {
            getImageMessage()
          }
        {
          getQuickMessage()
        }
        {
          getLocationMessage()
        }
        <View style={{ bottom:  0, width:  '100%',  height: 77,  position: 'absolute',backgroundColor: 'white', flexDirection: 'row', borderTopWidth: 1, borderColor: '#DCE6F0' }}>
          <TouchableOpacity
            onPress={()=>{
              requestCameraPermission(()=>{
                chatStore.tab = 0
              })
            }}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===0?require('../../assets/nav_photo_video_active.png'):require('../../assets/nav_photo_video.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===0?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Ảnh,Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              chatStore.tab = 1
            }}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===1?require('../../assets/nav_quick_message_active.png'):require('../../assets/nav_quick_message_active.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain', tintColor: chatStore.tab===1?colors.primary: colors.sending}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===1?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Chat nhanh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDocumentSelection}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===2?require('../../assets/nav_document.png'):require('../../assets/nav_document.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===2?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Tài liệu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              chatStore.tab = 3
            }}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===3?require('../../assets/nav_location_active.png'):require('../../assets/nav_location.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===3?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Gửi vị trí</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

    }

  </>)
})


export const Input = observer(function Input() {
  const inputRef= useRef(null)
  useEffect(()=>{
    inputStore.inputRef = () => {
      try {
        inputRef.current?.focus();
      } catch (e) {
        Log(e);
      }
    };
  }, [])
  return (
    <TextInput
      ref={inputRef}
      placeholder={appStore.lang.chat.input_message}
      placeholderTextColor={'#B5B4B8'}
      multiline={true}
      onChangeText={(text) => {
        inputStore.input = text;
      }}
      value={inputStore.input}
      style={{
        fontSize: 15,
        color: colors.primaryText,
        flex: 1,
        minHeight: 56,
        paddingTop: 18,
        padding: 12,
        fontFamily: 'SVN-GilroyMedium',
      }}
    />
  )
})
