import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import { Log } from '../../utils';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import colors from '../../Styles';
import appStore from '../AppStore';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import DocumentPicker, {types} from "../../components/documentPicker";
import uuid from "react-native-uuid";
import Geolocation from 'react-native-geolocation-service';
import quickMessageStore from "./QuickMessageStore";


const QuickMessage =observer(function QuickMessage ( props) {
  const snapPoints = useMemo(() => ['40%', '80%'], []);
  const bottomSheetModalRef = useRef(null);
  const [isCreate, setIsCreate] = useState(false)
  const [textInput, onChangeText] = useState('')
  const [currentMessage, setCurrentMessage] = useState({})

  useEffect(()=>{
    console.log('quickMessage', props)
    quickMessageStore.getData({})
    bottomSheetModalRef.current?.present();
  }, [])

  const showUpdate = (message) => {
    useCallback(()=>{
      setIsCreate(true)
    }, [currentMessage])
    setCurrentMessage(message)
  }

  const sendMessage = (msg) => {
    chatStore.input = msg.text
    chatStore.showAttachModal = false;
    chatStore.tab = 1;
    try{
      chatStore.inputRef()
    }catch (e) {
      Log(e)
    }
  }

  const updateQuickMessage = () => {
    if(currentMessage._id){
      quickMessageStore.update({
        ...currentMessage,
        ...{
          text: textInput
        }
      }, ()=>{
        setIsCreate(false)
        setCurrentMessage({})
      })
    }else{
      quickMessageStore.create({
        text: textInput,
        type: "MESSAGE",
      }, ()=>{
        setIsCreate(false)
        setCurrentMessage({})
      })
    }
  }

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={()=>sendMessage(item)}
        style={{flexDirection: 'row', padding: 16 }}>
          <Text style={{flex: 1, flexWrap: 'wrap', fontWeight: '500', fontSize: 15, color: colors.neutralText}}>
            {item.text}
          </Text>
        <TouchableOpacity
          onPress={()=>showUpdate(item)}
          style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/ic_edit_quick_message.png')} style={{width: 16, height: 16,  resizeMode: 'contain'}} resizeMode={'contain'}/>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return(
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      bottomInset={77}
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
              onPress={()=>setIsCreate(true)}
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
            onPress={()=>setIsCreate(true)}
            style={{ position: 'absolute', bottom: 56, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16,  backgroundColor: colors.primary, borderRadius: 10 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Tạo tin nhắn nhanh</Text>
          </TouchableOpacity>
        </View>
      }
    <FlatList
      data={quickMessageStore.data}
      renderItem={renderItem}
      ItemSeparatorComponent={()=><View style={{height: 1, backgroundColor: ''} }/>}
       />
      <Modal
        visible={isCreate}
        transparent={true}
        animationType={'fade'}
      >
        <SafeAreaView style={{flex: 1, backgroundColor: '#00000059',  justifyContent: 'flex-end'}}>
          <>
            <View style={{height: 56, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8FA'}}>
              <Text style={{ position: 'absolute', width: '100%', textAlign: 'center', fontWeight: '600', fontSize: 17, color: '#44494D'}} >Tạo tin chat nhanh</Text>
              <TouchableOpacity
                onPress={()=>{
                  setIsCreate(false)
                }}
                style={{width: 56, height: 56, alignItems: 'center', justifyContent: 'center', }}>
                <Image source={require('../../assets/ic_close.png')} style={{width: 24, height: 24, resizeMode: 'contain'}} resizeMode={'contain'}/>

              </TouchableOpacity>
              <View style={{flex: 1}}/>

            </View>
            <View style={{backgroundColor: 'white'}}>
              <TextInput
                value={textInput}
                multiline={true}
                placeholder={'Nội dung tin nhắn'}
                numberOfLines={10}
                style={{textAlignVertical: 'top',   margin: 16, borderColor: '#DCE6F0', borderWidth: 1, borderRadius: 10, padding: 12 }}
                onChangeText={onChangeText}
              />
              <TouchableOpacity
                onPress={updateQuickMessage}
                style={{ margin: 16, alignItems: 'center', justifyContent: 'center', padding: 16,  backgroundColor: colors.primary, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Lưu chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </>
        </SafeAreaView>
      </Modal>
    </BottomSheetModal>
  )
})

const ImageMessage =observer(function ImageMessage ( props) {
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const bottomSheetModalRef = useRef(null);

  useEffect(()=>{
    bottomSheetModalRef.current?.present();
  }, [])

  const sendImages = async () => {
    try{
      chatStore.showAttachModal = false

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
      chatStore.sendMessage(message)
      chatStore.images = []
    }catch (e) {
      console.log(e)
    }
  }


  return(
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        bottomInset={77}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
        onDismiss={() => {
          chatStore.images = []
          if(chatStore.tab === 0){
            chatStore.showAttachModal = false
          }
        }}
      >
        <CameraRollPicker
          groupTypes={'All'}
          assetType={'All'}
          include={['playableDuration', 'filename', 'fileExtension']}
          selected={chatStore.images}
          callback={(images) => {
            console.log('image picked', images)
            chatStore.images = images
          }} />
      </BottomSheetModal>
      {
        chatStore.images.length > 0 &&
        <TouchableOpacity
          onPress={sendImages}
          style={{ position: 'absolute', zIndex: 99999, bottom: 92, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16, margin: 16, backgroundColor: colors.primary, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{appStore.lang.chat.send}</Text>
        </TouchableOpacity>
      }
    </>

  )
})

const LocationMessage =observer(function LocationMessage ( props) {
  const bottomSheetModalRef = useRef(null);

  const [location, setLocation] = useState({coords: {
      longitude: 0,
      latitude: 0,
    }})

  const requestPermission = (callback)=>{
    const permission = Platform.OS ==='android'?PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION:PERMISSIONS.IOS.LOCATION_WHEN_IN_USE

    request(permission).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          callback()
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    });
  }

  useEffect(()=>{

    bottomSheetModalRef.current?.present();
    requestPermission(()=>{
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position)
          console.log(position);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    })
  }, [])

  const sendMap = () => {
    const message = {
      id: uuid.v4(),
      type: "LOCATION",
      location: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
      status: "sending",
      sender: appStore.user.type + '_' + appStore.user.user_id,
      conversation_id: props.item._id
    }
    console.log('map', message)
    chatStore.data.unshift(message)
    chatStore.sendMessage(message)
  }


  return(
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      bottomInset={77}
      snapPoints={['40%']}
      onDismiss={() => {
        if(chatStore.tab===3){
          console.log('showAttachModal', 'onDismiss')
          chatStore.showAttachModal = false
        }
      }}
    >
    <View
      style={{backgroundColor: 'white',
        height: '100%',
        width: '100%',
      }}>
      <MapView
        zoomEnabled={false}
        zoomTapEnabled={false}
        scrollEnabled={false}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          height: '100%',
          width: '100%',
        }}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          style={{width: 24, height: 24}}
          coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}}
          image={require('../../assets/ic_map_pin.png')}
        />
      </MapView>
      <TouchableOpacity
        onPress={sendMap}
        style={{ position: 'absolute', zIndex: 99999, bottom: 16, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16,  backgroundColor: colors.primary, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Chia sẻ vị trí hiện tại</Text>
      </TouchableOpacity>
    </View>
    </BottomSheetModal>

  )
})



export const AttachScreen = observer(function AttachScreen(props) {



  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.xls, types.docx, types.xlsx, types.docx],
      });

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
      console.log('document', message);
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
        permission = Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }else{
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      }


      const result = await request(permission)
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          // console.log(bottomSheetRef)
          // bottomSheetRef.current?.present();
         callback()
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    } catch (err) {
      Log(err);
    }
  };



  return(<>
    {
      chatStore.showAttachModal &&
      <SafeAreaView>
          <>{
            chatStore.tab === 0 &&
            <ImageMessage {...props}/>
          }
          </>
        <>
        {

          chatStore.tab === 1 &&
            <QuickMessage {...props}/>

        }
        </>
        <>

        {
          chatStore.tab === 3 &&

            <LocationMessage {...props}/>
        }
        </>
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
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
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
