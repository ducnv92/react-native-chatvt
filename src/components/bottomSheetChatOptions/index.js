import React, { useMemo, useRef } from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider } from '../bottomSheet/bottom-sheet';
import chatStore from '../../screens/chat/ChatStore';
import { MText as Text } from '../index';
import quickMessageStore from '../../screens/chat/QuickMessageStore';
import colors from '../../Styles';
import listChatStore from '../../screens/listchat/ListChatStore';
import appStore from '../../screens/AppStore';
import { formatTimeLastMessage } from '../../utils';
const BottomSheetChatOptions = React.forwardRef( (props, ref)=> {
  const snapPoints = useMemo(() => ['30%'], []);
  return (
    <BottomSheetModalProvider
    >
      <BottomSheetModal
        ref={ref}
        backdropComponent={()=>{
          return <View style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000059'}}/>
        }}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => {

        }}
      >
        <SafeAreaView>
          <TouchableOpacity
            onPress={()=>{


            }}
            style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
            </View>
            <View style={{flex: 1,}}>
                <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{'nguyen van duc'}</Text>
                <Text  style={{ fontSize: 15, fontWeight: '400', color: colors.neutralText, paddingTop: 4}}>{'Nugyen Van A'}</Text>

            </View>
          </TouchableOpacity>
          <View style={{backgroundColor: 'white', height: 1,}}><View style={{backgroundColor: '#E5E5E5', height: 1, marginLeft: 76, marginRight: 16}}></View></View>
          <TouchableOpacity
            onPress={()=>{


            }}
            style={{flexDirection: 'row', backgroundColor:'white', paddingVertical: 12, paddingHorizontal: 16}}>
            <View style={{height: 48, width: 48, resizeMode: 'center',marginRight: 12  }}>
              <Image style={{height: 48, width: 48, resizeMode: 'center' }} source={require('../../assets/avatar_default.png')} />
            </View>
            <View style={{flex: 1,}}>
              <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{'nguyen van duc'}</Text>
              <Text  style={{ fontSize: 15, fontWeight: '400', color: colors.neutralText, paddingTop: 4}}>{'Nugyen Van A'}</Text>

            </View>
          </TouchableOpacity>

        </SafeAreaView>
      </BottomSheetModal>
</BottomSheetModalProvider>

  )
})

export default BottomSheetChatOptions
