import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import { Log } from '../../utils';
import { Dimensions, FlatList, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import colors from '../../Styles';
import appStore from '../AppStore';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import DocumentPicker, {types} from "../../components/documentPicker";
import uuid from "react-native-uuid";
import Geolocation from 'react-native-geolocation-service';


const QuickMessage =observer(function QuickMessage ( props) {
  const snapPoints = useMemo(() => ['40%', '80%'], []);
  const bottomSheetModalRef = useRef(null);

  useEffect(()=>{
    bottomSheetModalRef.current?.present();
  }, [])

  const renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', padding: 16 }}>
          <Text style={{flex: 1,}}>
            sdfhhdfkhdsjkfh
          </Text>
        <TouchableOpacity
          style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/ic_edit_quick_message.png')} style={{width: 16, height: 16,  resizeMode: 'contain'}} resizeMode={'contain'}/>
        </TouchableOpacity>
      </View>
    )
  }

  return(
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      bottomInset={76}
      snapPoints={snapPoints}
      onDismiss={() => {
        if(chatStore.tab === 1){
          chatStore.showAttachModal = false
        }
      }}
    >
    <FlatList
      data={[12, 2, 3, ]}
      renderItem={renderItem}
       />
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
        bottomInset={76}
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

const LocationMessage =observer(function QuickMessage ( props) {
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
      bottomInset={76}
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
        style={{ position: 'absolute', zIndex: 99999, bottom: 16, left: 16, right: 16, alignItems: 'center', justifyContent: 'center', padding: 16, margin: 16, backgroundColor: colors.primary, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{appStore.lang.chat.send}</Text>
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


  return(<>
    {
      chatStore.showAttachModal &&
      <>
          <>{
            chatStore.tab === 0 &&
            <ImageMessage {...props}/>
          }
          </>
        <>
        {

          chatStore.tab === 1 &&
            <QuickMessage/>

        }
        </>
        <>

        {
          chatStore.tab === 3 &&

            <LocationMessage {...props}/>
        }
        </>
        <View style={{ bottom:  0, width:  '100%',  height: 76,  position: 'absolute',backgroundColor: 'white', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={()=>{
              chatStore.tab = 0
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
      </>

    }

  </>)
})
