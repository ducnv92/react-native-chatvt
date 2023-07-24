import React, { useMemo, useRef } from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal } from '../bottomSheet/bottom-sheet';
import chatStore from '../../screens/chat/ChatStore';
import { MText as Text } from '../index';
import quickMessageStore from '../../screens/chat/QuickMessageStore';
import colors from '../../Styles';
import listChatStore from '../../screens/listchat/ListChatStore';
import appStore from '../../screens/AppStore';
import { formatTimeLastMessage } from '../../utils';

export function BottomSheetChatOptions() {
  const snapPoints = useMemo(() => ['40%'], []);
  const bottomSheetModalRef = useRef();
  return (
    <View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => {
          if (chatStore.tab === 1) {
            chatStore.showAttachModal = false
          }
        }}
      >
        <SafeAreaView>
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
            </View>
            <View style={{flex: 1,}}>
                <Text  style={{ fontSize: 17, fontWeight: '600', color: colors.primaryText}}>{'nguyen van duc'}</Text>
                <Text  style={{ fontSize: 15, fontWeight: '400', color: colors.neutralText, paddingTop: 4}}>{'Nugyen Van A'}</Text>

            </View>
          </TouchableOpacity>

        </SafeAreaView>
      </BottomSheetModal>

    </View>
  )
}
