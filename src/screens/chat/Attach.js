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


const QuickMessage =observer(function QuickMessage ( props) {

  const renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', }}>
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
    <FlatList
      data={[12, 2, 3, ]}
      renderItem={renderItem}
       />
  )
})




export const AttachScreen =forwardRef(function AttachScreen(props, ref) {
  const snapPoints = useMemo(() => ['50%', '80%'], []);
  // const  myRef = useRef(ref);
  //
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     myRef?.current?.present();
  //   }, 500)
  // }, [])

  return(<>
    {
      chatStore.showAttachModal &&
      <>
        {
          chatStore.tab === 0 &&
          <BottomSheet
            ref={ref}
            index={0}
            bottomInset={0}
            snapPoints={snapPoints}
            // onChange={handleSheetChanges}
            onDismiss={() => {
              chatStore.images = []
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
          </BottomSheet>
        }
        <View style={{ bottom:  0, width:  '100%',  height: 76,  position: 'absolute',backgroundColor: 'white', flexDirection: 'row' }}>
          <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===0?require('../../assets/nav_photo_video_active.png'):require('../../assets/nav_photo_video.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===0?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Ảnh,Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===1?require('../../assets/nav_quick_message_active.png'):require('../../assets/nav_quick_message_active.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===1?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Chat nhanh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===2?require('../../assets/nav_document.png'):require('../../assets/nav_document.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===2?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Tài liệu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={chatStore.tab===3?require('../../assets/nav_location_active.png'):require('../../assets/nav_location.png')}
                   style={{width: 28, height: 28, resizeMode: 'contain'}} resizeMode={'contain'}/>
            <Text style={{color: chatStore.tab===3?colors.primary: colors.neutralText, fontSize: 13, fontWeight: '500', paddingTop: 6}}>Gửi vị trí</Text>
          </TouchableOpacity>
        </View>
      </>

    }

  </>)
})
