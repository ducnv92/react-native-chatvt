import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView, Linking, Dimensions,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import colors from '../../Styles';
import Swipeable from 'react-native-swipeable';
import appStore from "../AppStore";
import moment from "moment";
import {Navigation} from 'react-native-navigation';
import Image from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {formatTimeLastMessage, scale} from "../../utils";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import attachsStore from "./AttachsStore";
import uuid from "react-native-uuid";
import {VideoItem} from "../chat/Item";
import ImageViewing from "../../components/imageView/ImageViewing";
import {MText as Text} from '../../components'


export const AttachsScreen = observer(function AttachsScreen(props) {
  const conversation = props.data;
  const receiver = props.receiver;
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState([])
  const [imageVisible, setImageVisible] = useState(false);

  const loadData = ()=>{
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



  const renderItem = ({item, index}) => {
      const attach = item
      if(attachsStore.currentTab===0){
        if (attach.url.toLowerCase().includes('jpg') || attach.url.toLowerCase().includes('png') || attach.url.toLowerCase().includes('jpeg')|| attach.url.toLowerCase().includes('heic')) {
          return <TouchableOpacity
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

            <Image source={{uri: attach.url}} style={{
              borderWidth: 0.5,
              borderColor: '#f2f2f2',
              backgroundColor: "#F2F2F2",
              borderRadius: 5,
              overflow: 'hidden',
              width: Dimensions.get('window').width/3,
              height: Dimensions.get('window').width/3
            }}/>
          </TouchableOpacity>
        }

        if (attach.url.toLowerCase().includes('.mov') || attach.url.toLowerCase().includes('.mp4')) {
          return <VideoItem
            {...props}
            url={attach.url}
            style={{
              backgroundColor: "#F2F2F2",
              borderRadius: 5,
              overflow: 'hidden',
              width: Dimensions.get('window').width/3,
              height: Dimensions.get('window').width/3
            }}/>
        }
      }else{
        return (
          <TouchableOpacity
            onPress={()=>{
              try{
                Linking.openURL(item.url)
              }catch (e) {
                console.log(e)
              }
            }}
            style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#DCE6F0",
            backgroundColor: '#F8F8FA',
            paddingHorizontal: 8,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            {attach.type.includes('pdf') && (
              <Image source={require('../../assets/file_pdf.png')}
                     style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
            )}
            {(attach.type.includes('.doc')||attach.url.includes('.docx')) && (
              <Image source={require('../../assets/file_doc.png')}
                     style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
            )}
            {(attach.type.includes('.xls')||attach.url.includes('.xlsx')) && (
              <Image source={require('../../assets/file_xls.png')}
                     style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
            )}
            {/*<View>*/}
            <Text numberOfLines={1} style={{
              fontSize: 15,
              flex: 1,
              color: "#44494D"
            }}>
              {attach.key.replace("conversation/", "")}
            </Text>
            {/*<Text style={{*/}
            {/*  fontSize: 13,*/}
            {/*  color: "#828282",*/}
            {/*  marginTop: 5*/}
            {/*}}>*/}
            {/*  {(attach?.size / (1024 * 1024)).toFixed(2)} Mb*/}
            {/*</Text>*/}
            {/*</View>*/}
          </TouchableOpacity>

        )
      }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
      <View style={{height: scale(64), backgroundColor: colors.primary,}}>


          <TouchableOpacity
            onPress={() => {
                Navigation.pop(props.componentId)
            }}
            style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{height: 36, width: 36, resizeMode: 'contain',}}
                     source={require('../../assets/ic_close_attach.png')}/>
          </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', backgroundColor: 'white',  }}>
        <Text style={{fontWeight: '600', fontSize: 20, marginTop: insets.top+118-scale(64),color: colors.primaryText,}}>{(receiver?.first_name + " " + receiver?.last_name)}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {
            receiver?.state?.includes('ONLINE') &&
            <View style={{ height: 8, width: 8, borderRadius: 4, marginRight: 8, backgroundColor: '#30F03B' }} />
          }

          <Text style={{ fontWeight: '500', fontSize: 13, color: colors.neutralText, textAlign: 'center' }}>{
            conversation?.type==='PAIR' && receiver?.type === 'VTMAN' && appStore.lang.common.postman
          }
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', height: 74, backgroundColor: 'white', paddingTop: 24}}>
        <TouchableOpacity
          onPress={()=>{
            attachsStore.currentTab = 0
            attachsStore.page = 0;
            loadData()
          }}
          style={{flex: 1, height: 50, justifyContent: 'center', borderBottomWidth: 2, borderColor: attachsStore.currentTab===0? colors.primary:'#DCE6F0'}}>
          <Text style={{fontWeight: '600', fontSize: 17, color: attachsStore.currentTab===0? colors.primary:colors.primaryText, textAlign: 'center'}}>Ảnh/Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{
            attachsStore.currentTab = 1
            attachsStore.page = 0;
            loadData()
          }}
          style={{flex: 1, height: 50, justifyContent: 'center', borderBottomWidth: 2, borderColor: attachsStore.currentTab===1? colors.primary:'#DCE6F0'}}>
          <Text style={{borderLeftWidth: 1, borderColor: '#DCE6F0',fontWeight: '600', fontSize: 17, color: attachsStore.currentTab===1? colors.primary:colors.primaryText, textAlign: 'center'}}>Tài liệu</Text>
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#f2f2f2', height: 8}}/>

        <FlatList
          key={(attachsStore.currentTab ===0 ? '0' : '1')}
          refreshing={attachsStore.isLoading}
          onRefresh={() => {
            attachsStore.page = 0;
            loadData()
          }}
          keyExtractor={(item) => item._id}
          numColumns={attachsStore.currentTab ===0?3:1}
          onEndReached={() => loadData()}
          style={{flex: 1, backgroundColor: 'white'}}
          data={attachsStore.data}
          renderItem={renderItem}
        />
      <Image style={{height: 94, width: 94, top:insets.top+20,  resizeMode: 'contain', position: 'absolute', alignSelf: 'center'}}
             source={require('../../assets/avatar_default.png')}/>
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

