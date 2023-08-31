import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  SafeAreaView,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '../bottomSheet/bottom-sheet';
import chatStore from '../../screens/chat/ChatStore';
import { MText as Text } from '../index';
import quickMessageStore from '../../screens/chat/QuickMessageStore';
import colors from '../../Styles';
import listChatStore from '../../screens/listchat/ListChatStore';
import appStore from '../../screens/AppStore';
import { formatTimeLastMessage } from '../../utils';
import { chatVT } from '../../index';
import { Navigation } from 'react-native-navigation';
import services from '../../services';

const BottomSheetChatOptionsVTM = React.forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['40%'], []);
  const bottomSheetRef = useRef();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState({});
  const [isSender, setIsSender] = useState(true);

  useImperativeHandle(
    ref, // forwarded ref
    () => {
      return {
        updateData(data, order, orderType) {
          setData(data);
          setOrder(order);
          setIsSender(orderType!==4)
        },
        present() {
          bottomSheetRef.current?.present();
        },
        dismiss() {
          bottomSheetRef.current?.dismiss();
        },
      }; // the forwarded ref value
    },
    []
  );




  const toChatWithCustomer = async (order_code, type) => {
    try {
      ref?.current?.dismiss();
    } catch (e) {}
    appStore.createConversation(
      {
        order_number: order_code,
        chat_type: type,
      },
      (conversation) => {
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
              order: order,
            },
          },
        });
      },
      (error) => alert(error)
    );
  };



  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={() => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => ref?.current?.dismiss()}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#00000059',
              }}
            />
          );
        }}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => {}}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={()=>{

            }}
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                height: 48,
                width: 48,
                resizeMode: 'center',
                marginRight: 12,
              }}
            >
              <Image
                style={{ height: 48, width: 48, resizeMode: 'center' }}
                source={require('../../assets/ic_sms.png')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: colors.primaryText,
                }}
              >{`Tin nhắn văn bản (SMS)`}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>toChatWithCustomer(order.ma_phieugui, 'SENDER')}
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                height: 48,
                width: 48,
                resizeMode: 'center',
                marginRight: 12,
              }}
            >
              <Image
                style={{ height: 48, width: 48, resizeMode: 'center' }}
                source={require('../../assets/ic_sms.png')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: colors.primaryText,
                }}
              >{`Chat với người - Gửi hàng`}</Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: colors.neutralText,
                  paddingTop: 4,
                }}
              >
                {order.SENDER_FULLNAME}
              </Text>
            </View>
          </TouchableOpacity>

        </SafeAreaView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

export default BottomSheetChatOptions;
