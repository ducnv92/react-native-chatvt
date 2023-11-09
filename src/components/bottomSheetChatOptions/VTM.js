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
    Modal,
    Linking, Platform
} from "react-native";
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
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [order, setOrder] = useState({});
    const [typeUser, setTypeUser] = useState('');
    const [isSender, setIsSender] = useState(true);

    useImperativeHandle(
        ref, // forwarded ref
        () => {
            return {
                updateData(data, order, orderType, typeUser) {
                    console.log('order', order)
                    setData(data);
                    setOrder(order);
                    setTypeUser(typeUser);
                    setIsSender(typeUser==='SENDER')
                },
                present() {
                    setShow(true)
                },
                dismiss() {
                    setShow(false)
                },
            }; // the forwarded ref value
        },
        []
    );




    const toChatWithCustomer = async (order_code, type) => {
        console.log('type', type)
        try {
            setShow(false)
        } catch (e) {}
        appStore.createConversation(
            {
                order_number: order_code,
                chat_type: type,
                is_postman_receiver: props?.postman_receiver
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
                            order: {...order,
                                ...{
                                    order_number: order_code,
                                    ma_phieugui: order_code,
                                }
                            },
                        },
                    },
                });
            },
            (error) => alert(error)
        );
    };



    return (
        <Modal
            visible={show}
            transparent={true}
            animationType={"fade"}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() =>  setShow(false)}
                style={{
                    flex: 1,
                    backgroundColor: '#00000059',
                }}
            >
                <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={{borderTopLeftRadius: 16,
                        borderTopRightRadius: 16, overflow: 'hidden'}}>
                        <TouchableOpacity
                            onPress={()=>{
                                setShow(false)
                                if(isSender){

                                    Linking.openURL(
                                        `sms:${
                                            order.tel_khgui?order.tel_khgui:order.dienthoai_nguoigui
                                        }${Platform.OS === 'ios' ? '&' : '?'}body=${''}`,
                                    );
                                    return
                                }

                                Linking.openURL(
                                    `sms:${
                                        typeUser ==='SENDER'?order.tel_khgui:order.tel_khnhan
                                    }${Platform.OS === 'ios' ? '&' : '?'}body=${''}`,
                                );
                            }}
                            style={{
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                alignItems: 'center'
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
                                    style={{ height: 48, width: 48, resizeMode: 'contain' }}
                                    source={require('../../assets/ic_sms.png')}
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '600',
                                    color: colors.primaryText,
                                }}
                            >{`Tin nhắn văn bản (SMS)`}</Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: 'white', height: 1 }}>
                            <View
                                style={{
                                    backgroundColor: '#E5E5E5',
                                    height: 1,
                                    marginLeft: 76,
                                    marginRight: 16,
                                }}
                            ></View>
                        </View>
                        <TouchableOpacity
                            onPress={()=>toChatWithCustomer(isSender?(order.ma_vandon?order.ma_vandon:order.ma_phieugui):order.ma_phieugui, typeUser)}
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
                                    style={{ height: 48, width: 48, resizeMode: 'contain' }}
                                    source={typeUser==='SENDER'?require('../../assets/avatar_postman.png'):require('../../assets/avatar_customer.png')}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: colors.primaryText,
                                    }}
                                >{'Chat với người - '+(typeUser ==='SENDER'?'Gửi hàng': 'Nhận hàng')}</Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '500',
                                        color: colors.neutralText,
                                        paddingTop: 4,
                                    }}
                                >
                                    {isSender?(order.ten_khgui?order.ten_khgui:order.ten_nguoigui):(typeUser ==='SENDER'?order.ten_khgui:order.ten_khnhan)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableOpacity>
        </Modal>
    );
});

export default BottomSheetChatOptionsVTM;
