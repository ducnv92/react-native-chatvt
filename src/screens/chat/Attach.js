import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import { Log } from '../../utils';
import { Dimensions, FlatList, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import colors from '../../Styles';
import appStore from '../AppStore';


const CameraRoll =observer(function CameraRoll ( props) {

  return(
    <CameraRollPicker
      groupTypes={'All'}
      include={['playableDuration', 'filename', 'fileExtension']}
      selected={chatStore.images}
      callback={(images) => {
        console.log('image picked', images)
        chatStore.images = images
      }} />
  )
})

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
    {/*<View style={{ bottom:  80, width:  '100%',  height: 76,  backgroundColor: 'red', position: 'absolute', }}>*/}

    {/*</View>*/}
    <BottomSheetModal
      ref={ref}
      index={0}
      bottomInset={0}
      snapPoints={snapPoints}
      // onChange={handleSheetChanges}
      onDismiss={() => {
        chatStore.images = []
      }}
    >
      {
        chatStore.tab === 0 && <CameraRoll/>
      }
      {
        chatStore.tab === 1 && <QuickMessage/>
      }
    </BottomSheetModal>
  </>)
})
