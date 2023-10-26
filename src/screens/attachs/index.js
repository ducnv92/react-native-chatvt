import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView, Linking, Dimensions,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import colors from '../../Styles';
import Swipeable from 'react-native-swipeable';
import appStore from "../AppStore";
import moment from "moment";
import { Navigation } from 'react-native-navigation';
import Image from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTimeLastMessage, scale } from "../../utils";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import attachsStore from "./AttachsStore";
import uuid from "react-native-uuid";
import { VideoItem } from "../chat/Item";
import ImageViewing from "../../components/imageView/ImageViewing";
import { MText as Text } from '../../components'

export const AttachsScreen = observer(function AttachsScreen(props) {
  const conversation = props.data;
  const receiver = props.receiver;
  // const insets = useSafeAreaInsets();
  const [images, setImages] = useState([])
  const [imageVisible, setImageVisible] = useState(false);

  const loadData = () => {
    attachsStore.getData({
      conversation_id: conversation?._id
    })
  }


  useEffect(() => {
    attachsStore.data = [];
    attachsStore.currentTab = 0;
    attachsStore.page = 0;
    loadData()
  }, [])



  const renderItem = ({ item, index }) => {
    const attach = item
    if (attachsStore.currentTab === 0) {
      if (attach.url.toLowerCase().includes('jpg') || attach.url.toLowerCase().includes('png') || attach.url.toLowerCase().includes('jpeg') || attach.url.toLowerCase().includes('heic')) {
        return <TouchableOpacity
          style={{backgroundColor: 'black'}}
          onPress={() => {
            setImages([
              {
                uri: attach.url
              }
            ])
            setImageVisible(
              true
            )
          }}>

          <Image source={{ uri: attach.url }} style={{
            borderWidth: 2,
            // borderColor: '#f2f2f2',
            // backgroundColor: "#F2F2F2",
            overflow: 'hidden',
            width: Dimensions.get('window').width / 3,
            height: Dimensions.get('window').width / 3
          }} />
        </TouchableOpacity>
      }

      if (attach.url.toLowerCase().includes('.mov') || attach.url.toLowerCase().includes('.mp4')) {
        return <VideoItem
          {...props}
          url={attach.url}
          style={{
            borderWidth: 2,
            overflow: 'hidden',
            backgroundColor: 'black',
            width: Dimensions.get('window').width / 3,
            height: Dimensions.get('window').width / 3
          }} />
      }
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            try {
              Linking.openURL(item.url)
            } catch (e) {
              console.log(e)
            }
          }}
          style={{
            // borderRadius: 8,
            // borderWidth: 1,
            // borderColor: "#DCE6F0",
            // backgroundColor: '#F8F8FA',
            paddingHorizontal: 12,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {attach.url.includes('pdf') && (
            <Image source={require('../../assets/file_pdf.png')}
              style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 14 }} />
          )}
          {(attach.url.includes('.doc') || attach.url.includes('.docx')) && (
            <Image source={require('../../assets/file_doc.png')}
              style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 14 }} />
          )}
          {(attach.url.includes('.xls') || attach.url.includes('.xlsx')) && (
            <Image source={require('../../assets/file_xls.png')}
              style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 14 }} />
          )}
          <View style={{
            flex: 1,
          }}>
            <Text numberOfLines={1} style={{
              fontSize: 15,
              fontWeight: '600',
              color: "#44494D"
            }}>
              {attach.key.replace("conversation/", "")}
            </Text>
            <Text style={{
              fontSize: 13,
              fontWeight: '500',
              color: "#828282",
              marginTop: 8
            }}>
              {moment(attach.created_at).format('HH:mm DD/MM/YYYY')}
            </Text>
          </View>

        </TouchableOpacity>

      )
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <View style={{ height: 66, backgroundColor: colors.primary, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            Navigation.pop(props.componentId)
          }}
          style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ height: 36, width: 36, resizeMode: 'contain', }}
            source={require('../../assets/ic_close_attach.png')} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', backgroundColor: 'white', }}>
        <Text style={{ fontWeight: '600', fontSize: 20, marginTop: 72, color: colors.primaryText, paddingHorizontal: 16, textAlign: 'center' }}>{(receiver?.last_name?receiver?.last_name:''+" " + receiver?.first_name?receiver?.first_name: '')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {/*{*/}
          {/*  receiver?.state?.includes('ONLINE') &&*/}
          {/* <View style={{ height: 8, width: 8, borderRadius: 4, marginRight: 8, backgroundColor: '#30F03B' }} />*/}
          {/*} */}

          <Text style={{ fontWeight: '500', fontSize: 13, color: colors.neutralText, textAlign: 'center' }}>{
            conversation?.type === 'PAIR' && receiver?.type === 'VTMAN' && appStore.lang.common.postman
          }
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <TouchableOpacity onPress={() => {
            try {
              Linking.openURL(`tel:${receiver?.phone}`)
            } catch (e) {
              console.log(e)
            }
          }}>
            <Image style={{ height: 48, width: 48, resizeMode: 'contain' }}
              source={require('../../assets/ic_call.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => {
            Navigation.pop(props.componentId)
          }}>
            <Image style={{ height: 48, width: 48, resizeMode: 'contain' }}
              source={require('../../assets/ic_message.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => {
            alert('Tính năng đang phát triển')
          }}>
            <Image style={{ height: 48, width: 48, resizeMode: 'contain' }}
              source={require('../../assets/ic_star.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 74, backgroundColor: 'white', paddingTop: 24 }}>
        <TouchableOpacity
          onPress={() => {
            attachsStore.currentTab = 0
            attachsStore.page = 0;
            loadData()
          }}
          style={{ flex: 1, height: 50, justifyContent: 'center', borderBottomWidth: 2, borderColor: attachsStore.currentTab === 0 ? colors.primary : '#DCE6F0' }}>
          <Text style={{ fontWeight: '600', fontSize: 17, color: attachsStore.currentTab === 0 ? colors.primary : colors.primaryText, textAlign: 'center' }}>Ảnh, video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            attachsStore.currentTab = 1
            attachsStore.page = 0;
            loadData()
          }}
          style={{ flex: 1, height: 50, justifyContent: 'center', borderBottomWidth: 2, borderColor: attachsStore.currentTab === 1 ? colors.primary : '#DCE6F0' }}>
          <Text style={{ borderLeftWidth: 1, borderColor: '#DCE6F0', fontWeight: '600', fontSize: 17, color: attachsStore.currentTab === 1 ? colors.primary : colors.primaryText, textAlign: 'center' }}>Tài liệu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        key={(attachsStore.currentTab === 0 ? '0' : '1')}
        refreshing={attachsStore.isLoading}
        onRefresh={() => {
          attachsStore.page = 0;
          loadData()
        }}
        keyExtractor={(item) => item._id}
        numColumns={attachsStore.currentTab === 0 ? 3 : 1}
        onEndReached={() => loadData()}
        style={{ flex: 1, paddingTop: 8, backgroundColor: 'white'}}
        data={attachsStore.data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: attachsStore.currentTab === 0?'black':'white', height: attachsStore.currentTab === 0?2:1 }}>
            {
              attachsStore.currentTab === 1 &&
              <View
                style={{
                  backgroundColor: '#E5E5E5',
                  height: 1,
                  marginLeft: 66,
                  marginRight: 16,
                }}
              ></View>
            }
          </View>
        )}
        ListEmptyComponent={() => {
          if(attachsStore.isLoading)
            return null
          return (
            <View style={{ alignItems: 'center', marginTop: 50, backgroundColor: 'white', height: '100%' }}>
              {attachsStore.currentTab === 0 ? (
                <Image style={{ width: 102, height: 102, resizeMode: 'contain' }}
                  source={require('../../assets/ic_no_picture.png')} />
              ) : (
                <Image style={{ width: 102, height: 102, resizeMode: 'contain' }}
                  source={require('../../assets/ic_no_file.png')} />
              )}
              <Text style={{ fontWeight: '500', fontSize: 15, color: '#828282' }}>{attachsStore.currentTab === 0 ? "Chưa có ảnh, video được gửi trong hội thoại " : "Chưa có tài liệu được gửi trong hội thoại "}</Text>
            </View>
          )
        }}
      />

      <View style={{ height: 94, width: 94, marginTop: 20, resizeMode: 'contain', position: 'absolute', alignSelf: 'center' }}>
        {
          receiver?.type === 'VTMAN' ? (
            <Image style={{ height: 94, width: 94, resizeMode: 'contain' }}
              source={require('../../assets/avatar_default.png')} />
          ) : (
            <Image style={{ height: 94, width: 94, resizeMode: 'contain' }}
              source={require('../../assets/avatar_default_customer.png')} />
          )
        }
        {
          receiver.state?.includes('ONLINE') &&
          <Image style={{ height: 12, width: 12, resizeMode: 'center', position: 'absolute', top: 70, left: 60 }} source={require('../../assets/ic_online.png')} />
        }

      </View>


      <ImageViewing
        images={images}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
    </SafeAreaView>
  );
})

