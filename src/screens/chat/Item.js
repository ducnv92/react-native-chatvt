import React, { cloneElement, memo, useEffect, useRef, useState } from 'react';
import appStore from '../AppStore';
import {
  ActivityIndicator,
  Dimensions, Image,
  Linking,
  Modal,
  Platform,
  StyleSheet, TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../../Styles';
import moment from 'moment/moment';
import ParsedText from 'react-native-parsed-text';
import {
  DownloadViewFile,
  formatDuration,
  formatTimeLastMessage,
  groupBy,
  participantType,
} from '../../utils';
import { createThumbnail } from '../../components/createThumbnail';
import ImageViewing from '../../components/imageView/ImageViewing';
import FastImage from 'react-native-fast-image';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import { toJS } from 'mobx';
import { createMapLink, createOpenLink } from 'react-native-open-maps';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import services from '../../services';
import { utils } from 'prettier/doc';
import uuid from 'react-native-uuid';
import { observer } from 'mobx-react-lite';
import { Navigation } from 'react-native-navigation';
import SoundPlayer from '../../components/playSound';
import { MText as Text } from '../../components';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import uploadProgress from './uploadProgress';
// import Image from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import VideoViewing from '../../components/videoView/ImageViewing';
import AnimatedSoundBars from '../../components/waveView';
import chatStore from './ChatStore';
import stickerStore from './StickerStore';
import listChatStore from '../listchat/ListChatStore';
var _ = require('lodash');


const MapItem = function(props) {
  const right = props.right;
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: right ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          marginVertical: right?2.5:4,
          marginHorizontal: 10,
        }}
      >
        <ContainChatItem {...props}>
          <View
            style={{
              height: 178,
              width: 290,
              overflow: 'hidden',
              backgroundColor: colors.blueBG,
              borderWidth: right ? 0 : 1,
              borderColor: '#DCE6F0',
              borderRadius: 10,
            }}
          >
            <MapView
              zoomEnabled={false}
              zoomTapEnabled={false}
              scrollEnabled={false}
              provider={(Platform.OS === 'android' || appStore.appId==='VTPost') ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              style={{
                height: 178,
                width: 290,
                borderRadius: 10,
                overflow: 'hidden',
              }}
              region={{
                latitude: props.item?.location?.latitude,
                longitude: props.item?.location?.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              <Marker
                coordinate={{
                  latitude: props.item?.location?.latitude,
                  longitude: props.item?.location?.longitude,
                }}
              >
                <Image
                  source={require('../../assets/ic_map_pin.png')}
                  style={{ width: 30, height: 30, resizeMode: 'contain' }}
                  resizeMode='contain'
                />
              </Marker>
            </MapView>
            <TouchableOpacity
              onPress={()=>{
                try {
                  Linking.openURL(
                    createMapLink({
                      provider: 'google',
                      // latitude: props.item?.location?.latitude,
                      // longitude: props.item?.location?.longitude,
                      query: props.item?.location?.latitude + ',' + props.item?.location?.longitude,
                    }),
                  );
                } catch (e) {
                  
                }
              }}
              style={{position: "absolute",  height: 178,
                width: 290,}}>
            </TouchableOpacity>
          </View>
        </ContainChatItem>
      </View>
      {/*{*/}
      {/*  !props.topMe &&*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      flexDirection: 'row',*/}
      {/*      justifyContent: right ? 'flex-end' : 'flex-start',*/}
      {/*      alignItems: 'center',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        fontWeight: '400',*/}
      {/*        fontSize: 10,*/}
      {/*        marginHorizontal: 16,*/}
      {/*        color: colors.neutralText,*/}
      {/*        marginTop: 4,*/}
      {/*        textAlign: right ? 'right' : 'left',*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {formatTimeLastMessage(props.item.created_at)}*/}
      {/*    </Text>*/}
      {/*  </View>*/}

      {/*}*/}

    </View>
  );
};
const VoiceItem = function(props) {
  const right = props.right;
  const [isPlay, setIsPlay] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const soundbarRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatDuration(props.item.attachmentLocal?.length > 0
    ? (props.item.attachmentLocal.length>0 &&props.item.attachmentLocal[0].duration)
    :(props.item.attachments.length>0 && props.item.attachments[0]?.duration)));
  let _onFinishedPlayingSubscription = null;
  let _onFinishedLoadingSubscription = null;
  let _onFinishedLoadingFileSubscription = null;
  let _onFinishedLoadingURLSubscription = null;

  useEffect(() => {
    return () => {
      if (chatStore.intervalSound) {
        clearInterval(chatStore.intervalSound);
      }
      if (chatStore.pauseSound) {
        chatStore.pauseSound();
      }
    };
  }, []);

  const play = () => {
    if (chatStore.pauseSound) {
      chatStore.pauseSound();
    }
    chatStore.pauseSound = pause;

    pause();
    setIsPlay(true);
    SoundPlayer.playUrl(
      props.item.attachmentLocal?.length > 0
        ? (props.item.attachmentLocal.length>0 &&props.item.attachmentLocal[0].uri)
        : (props.item.attachments.length>0 && props.item.attachments[0]?.url),
    );
    chatStore.intervalSound = setInterval(async () => {
      const info = await SoundPlayer.getInfo(); // Also, you need to await this because it is async
      

      setCurrentTime(formatDuration(info.currentTime));
    }, 1000);
    _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', (props) => {
      
      pause();
      clearInterval(chatStore.intervalSound);
    });
    _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
      
    });
    _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({
                                                                                                success,
                                                                                                name,
                                                                                                type,
                                                                                              }) => {
      

    });
    _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
      
    });
    
  };

  const pause = () => {
    try{

      if(Platform.OS==='android'){
          _onFinishedPlayingSubscription?.remove();
          _onFinishedLoadingSubscription?.remove();
          _onFinishedLoadingURLSubscription?.remove();
          _onFinishedLoadingFileSubscription?.remove();
      }
    SoundPlayer.stop();
    SoundPlayer.unmount();
    clearInterval(chatStore.intervalSound);
      setIsPlay(false);
      
    }catch (e) {
      
    }

  };


  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: right ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          marginVertical: right?2.5:4,
          marginHorizontal: 10,
        }}
      >
        <ContainChatItem {...props}>
          <TouchableOpacity
            onPress={() => setShowTime(!showTime)}
            style={{
              height: 56,
              width: 251,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: right ? colors.primary : '#F2F2F2',
              borderWidth: right ? 0 : 1,
              borderColor: '#DCE6F0',
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (!isPlay) {
                  play();
                } else {
                  pause();
                }
              }}
              style={{
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={
                  isPlay
                    ? require('../../assets/ic_pause.png')
                    : (right ? require('../../assets/ic_play.png') : require('../../assets/ic_play_left.png'))
                }
                style={{ height: 32, width: 32, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
            {
              isPlay ?
                <AnimatedSoundBars isPlay={true} id={props.item?.attachments?.length>0 && props.item?.attachments[0]?.url}
                                   barColor={right ? 'white' : '#44494D66'} /> :
                <AnimatedSoundBars isPlay={false} barColor={right ? 'white' : '#44494D66'} />
            }

            {/*<Image*/}
            {/*  source={require('../../assets/ic_wave_white.png')}*/}
            {/*  style={{ flex: 1, marginHorizontal: 16, height: 16, resizeMode: 'contain', tintColor: right ? 'white' : '#B5B4B8' }}*/}
            {/*  tintColor={right ? 'white' : '#B5B4B8'}*/}
            {/*/>*/}
            <Text style={{
              width: 55,
              textAlign: 'right',
              fontWeight: '500',
              fontSize: 15,
              color: right ? 'white' : colors.neutralText,
            }}>{currentTime}</Text>
          </TouchableOpacity>
        </ContainChatItem>
      </View>
      {
        showTime &&
        <View
          style={{
            flexDirection: 'row',
            justifyContent: right ? 'flex-end' : 'flex-start',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: '400',
              fontSize: 10,
              color: colors.neutralText,
              marginTop: 4,
              marginHorizontal: 16,
              textAlign: right ? 'right' : 'left',
            }}
          >
            {formatTimeLastMessage(props.item.created_at)}
          </Text>
        </View>

      }

    </View>
  );
};

export const VideoItem = function(props) {
  const [thumbnail, setThumbnail] = useState('');
  const [isPause, setIsPause] = useState(true);
  useEffect(() => {
    const createThumb = async () => {
      if (props.thumb_url) {
        setThumbnail(props.thumb_url);
        return;
      }
      try {
        const fileName = props.url.slice(
          props.url.lastIndexOf('/') + 1,
          props.url.length,
        );

        const response = await createThumbnail({
          url: props.url,
          format: 'jpeg',
          cacheName: fileName,
          timeStamp: 0,
        });

        setThumbnail(response.path);
      } catch (e) {
      }
    };

    createThumb();
    return () => {
      setIsPause(true);
    };
  }, []);

  return (
    <View>

      <View style={props.style}>
        {(!thumbnail) ? (
          <ActivityIndicator size='large' />
        ) : (
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setIsPause(false)}
            onLongPress={props.onLongPress}
          >
            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 10, overflow: 'hidden'}}
              source={thumbnail ? { uri: thumbnail } : {}}
            />
            {!props.url.includes('file://') && (
              <Image
                source={require('../../assets/ic_play.png')}
                style={{ width: 56, height: 56, position: 'absolute' }}
              />
            )}
            <Text style={{
              position: 'absolute', fontSize: 14, fontWeight: '500', right: 16, bottom: 16, color: 'white',
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 2,
            }}>{formatDuration(props.duration)}</Text>
          </TouchableOpacity>
        )}
      </View>
      <VideoViewing
        source={{ uri: props.url }}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        visible={!isPause}
        onRequestClose={() => setIsPause(true)}
      />
    </View>
  );
};

const MessageItem = function(props) {
  const item = props.item;
  const right = props.right;
  const [showTime, setShowTime] = useState(false);
  const [images, setImages] = useState([]);
  const [imageVisible, setImageVisible] = useState(false);

  const handleUrlPress = (url, matchIndex) => {
    Linking.openURL(url);
  };

  const handlePhonePress = (phone, matchIndex /*: number*/) => {
    // alert(`${phone} has been pressed!`);
  };

  const handleNamePress = (name, matchIndex /*: number*/) => {
    // alert(`Hello ${name}`);
  };

  const handleEmailPress = (email, matchIndex /*: number*/) => {
    // alert(`send email to ${email}`);
  };

  const renderText = (matchingString, matches) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  };

  return (
    <>
      {item.has_attachment ? (
        <View style={{ marginVertical: right?2.5:4, marginHorizontal: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: right ? 'flex-end' : 'flex-start',
              alignItems: 'center',
            }}
          >
            {item.status === 'error' && right && (
              <Image
                source={require('../../assets/ic_send_error.png')}
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: 'contain',
                  marginRight: 14,
                }}
              />
            )}

            <View
              style={{ borderRadius: 10, borderTopRightRadius: right && props.bottomMe ? 6 : 10 }}
            >
              {item.attachmentLocal && item.attachmentLocal.length > 0 && (
                <View
                  style={{
                    maxWidth: item.attachmentLocal?.length > 1 ? 294 : 200,
                  }}
                >
                  <ContainChatItem {...props} style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderRadius: 10,
                    // overflow: 'hidden',
                  }}>
                    {item.attachmentLocal.map((File, index) => {
                      const attach = File.uri;
                      if (
                        attach.toLowerCase().includes('jpg') ||
                        attach.toLowerCase().includes('png') ||
                        attach.toLowerCase().includes('jpeg') ||
                        attach.toLowerCase().includes('heic')
                      ) {
                        return (
                          <TouchableOpacity
                            style={{
                              // width: item.attachments.length === 1 ? 200 : 145,
                              // height: item.attachments.length === 1 ? 200 : 145,

                            }}
                            key={attach.url}
                            onPress={() => {
                              setImages([
                                {
                                  uri: attach,
                                },
                              ]);
                              setImageVisible(true);
                            }}
                            onLongPress={props.onLongPress}
                          >
                            <Image
                              source={{ uri: attach }}
                              style={{
                                backgroundColor: '#F2F2F2',
                                borderRadius: 5,
                                overflow: 'hidden',
                                width: item.attachmentLocal.length === 1 ? 200 : 145,
                                height: item.attachmentLocal.length === 1 ? 200 : 145,
                                marginLeft: item.attachmentLocal.length > 0 ? ((index + 1) % 2 === 0 ? 4 : 0) : 0,
                                marginTop: item.attachmentLocal.length > 0 ? (index > 1 ? 4 : 0) : 0,
                                resizeMode: 'cover',
                              }}
                              LoadingIndicatorComponent={ActivityIndicator}
                            />
                          </TouchableOpacity>
                        );
                      }
                      if (
                        attach.toLowerCase().includes('.mov') ||
                        attach.toLowerCase().includes('.mp4')
                      ) {
                        return (
                          <VideoItem
                            key={attach}
                            {...props}
                            source={{ uri: attach }}
                            url={attach}
                            resizeMode={'contain'}
                            allowsExternalPlayback
                            style={{
                              width: Dimensions.get('window').width * 0.5,
                              height: Dimensions.get('window').width * 0.5,
                              borderRadius: 10,
                              overflow: 'hidden',
                              marginTop: index>0?4:0
                            }}
                          ></VideoItem>
                        );
                      }
                    })}
                  </ContainChatItem>
                </View>
              )}
              {item.attachments && (
                <View
                  style={{
                    maxWidth: item.attachments?.length > 1 ? 294 : 200,
                  }}
                >
                  <ContainChatItem {...props} style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderRadius: 10,
                    // overflow: 'hidden',
                  }}>
                    {item.attachments.map((attach, index) => {
                      if (
                        attach.url.toLowerCase().includes('jpg') ||
                        attach.url.toLowerCase().includes('png') ||
                        attach.url.toLowerCase().includes('jpeg') ||
                        attach.url.toLowerCase().includes('heic')
                      ) {
                        return (
                          <TouchableOpacity
                            style={{
                              // width: item.attachments.length === 1 ? 200 : 145,
                              // height: item.attachments.length === 1 ? 200 : 145,

                            }}
                            key={attach.url}
                            onPress={() => {
                              setImages([
                                {
                                  uri: attach.url,
                                },
                              ]);
                              setImageVisible(true);
                            }}
                            onLongPress={props.onLongPress}
                          >
                            <Image
                              source={{ uri: attach.url }}
                              style={{
                                borderColor: '#f2f2f2',
                                backgroundColor: '#F2F2F2',
                                borderRadius: 5,
                                overflow: 'hidden',
                                width: item.attachments.length === 1 ? 200 : 145,
                                height: item.attachments.length === 1 ? 200 : 145,
                                marginLeft: item.attachments.length > 0 ? ((index + 1) % 2 === 0 ? 4 : 0) : 0,
                                marginTop: item.attachments.length > 0 ? (index > 1 ? 4 : 0) : 0,
                                resizeMode: 'cover',
                              }}
                              LoadingIndicatorComponent={ActivityIndicator}
                            />
                          </TouchableOpacity>
                        );
                      }

                      if (
                        attach.url.toLowerCase().includes('.mov') ||
                        attach.url.toLowerCase().includes('.mp4')
                      ) {
                        return (
                          <VideoItem
                            {...props}
                            thumb_url={attach.thumb_url}
                            duration={attach.duration}
                            url={attach.url}
                            style={{
                              borderRadius: 10,
                              overflow: 'hidden',
                              width: Dimensions.get('window').width * 0.5,
                              height: Dimensions.get('window').width * 0.5,
                              marginTop: index>0?4:0,
                              marginBottom: item.attachments.length>0 && item.attachments.length-index>1 ?4:0
                            }}
                          />
                        );
                      }
                    })}
                  </ContainChatItem>
                </View>
              )}
            </View>
          </View>
          {
            showTime &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: props.right ? 'flex-end' : 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 10,
                  color: colors.neutralText,
                  marginTop: 4,
                  textAlign: props.right ? 'right' : 'left',
                }}
              >
                {formatTimeLastMessage(item.created_at)}
              </Text>
            </View>

          }
          {item.status === 'error' && (
            <Text
              style={{
                fontWeight: '500',
                fontSize: 15,
                color: colors.primary,
                marginTop: 8,
                textAlign: right ? 'right' : 'left',
              }}
            >
              {appStore.lang.chat.send_error}
            </Text>
          )}
        </View>
      ) : (
        <View style={{ marginVertical: right?2: 3, marginHorizontal: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: right ? 'flex-end' : 'flex-start',
              alignItems: 'center',
            }}
          >
            {item.status === 'error' && right && (
              <Image
                source={require('../../assets/ic_send_error.png')}
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: 'contain',
                  marginRight: 14,
                }}
              />
            )}


            <ContainChatItem {...props}   >

              <TouchableOpacity
                onPress={() => setShowTime(!showTime)}
                style={{
                  backgroundColor:
                    appStore.appId === 'VTPost'
                      ? right
                        ? colors.primary
                        : '#F2F2F2'
                      : right
                        ? colors.bgVTM
                        : '#F2F2F2',
                  padding: 12,
                  maxWidth: Dimensions.get('window').width * 0.75,
                  borderRadius: 10,
                  borderWidth: right ? 0 : 1,
                  borderColor: '#DCE6F0',
                  borderTopRightRadius: (right && props.bottomMe) ? 6 : 10,
                  borderBottomRightRadius: (right && props.topMe) ? 6 : 10,
                  borderTopLeftRadius: (!right && !props.topMe) ? 6 : 10,
                  borderBottomLeftRadius: (!right && !props.bottomMe) ? 6 : 10,
                }}>

                <ParsedText
                  accessible={true}
                  // accessibilityActions={[
                  //   {name: 'cut', label: 'cut'},
                  //   {name: 'copy', label: 'copy'},
                  //   {name: 'paste', label: 'paste'},
                  // ]}
                  // onAccessibilityAction={event => {
                  //   switch (event.nativeEvent.actionName) {
                  //     case 'cut':
                  //       Alert.alert('Alert', 'cut action success');
                  //       break;
                  //     case 'copy':
                  //       Alert.alert('Alert', 'copy action success');
                  //       break;
                  //     case 'paste':
                  //       Alert.alert('Alert', 'paste action success');
                  //       break;
                  //   }
                  // }}
                  style={{
                    fontFamily: 'SVN-GilroyMedium',
                    fontWeight: '500',
                    fontSize: 15,
                    lineHeight: 21,
                    color:
                      appStore.appId === 'VTPost'
                        ? right
                          ? 'white'
                          : colors.primaryText
                        : colors.primaryText,
                  }}
                  parse={[
                    { type: 'url', style: styles.url, onPress: handleUrlPress },
                    // {type: 'phone', style: styles.phone, onPress: handlePhonePress},
                    // {type: 'email', style: styles.email, onPress: handleEmailPress},
                    // {pattern: /Bob|David/,              style: styles.name, onPress: handleNamePress},
                    // {pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: handleNamePress, renderText: renderText},
                    // {pattern: /42/,                     style: styles.magicNumber},
                    // {pattern: /#(\w+)/, style: styles.hashTag},
                  ]}
                  childrenProps={{ allowFontScaling: false }}
                >
                  {item.text}
                </ParsedText>
              </TouchableOpacity>
            </ContainChatItem>

          </View>
          {/*<Emoji {...props}/>*/}

          {item.status === 'sending' && (
            <Text
              style={{
                fontWeight: '500',
                fontSize: 15,
                color: colors.sending,
                marginTop: 8,
                textAlign: right ? 'right' : 'left',
              }}
            >
              {appStore.lang.chat.sending + '...'}
            </Text>
          )}

          {item.status === 'error' && (
            <Text
              style={{
                fontWeight: '500',
                fontSize: 15,
                color: colors.primary,
                marginTop: 8,
                textAlign: right ? 'right' : 'left',
              }}
            >
              {appStore.lang.chat.send_error}
            </Text>
          )}
          {
            showTime &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: right ? 'flex-end' : 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 10,
                  color: colors.neutralText,
                  marginTop: 4,
                  textAlign: right ? 'right' : 'left',
                }}
              >
                {formatTimeLastMessage(item.created_at)}
              </Text>
            </View>

          }

        </View>
      )
      }
      <ImageViewing
        images={images}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
    </>
  );
};

const DocumentItem = function(props) {
  const item = props.item;
  const right = props.right;
  return (
    <>
      {item.has_attachment && (
        <View style={{ marginVertical: right?2.5:4, marginHorizontal: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: right ? 'flex-end' : 'flex-start',
              alignItems: 'center',
            }}
          >
            {item.status === 'error' && right && (
              <Image
                source={require('../../assets/ic_send_error.png')}
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: 'contain',
                  marginRight: 14,
                }}
              />
            )}

            <View style={{ maxWidth: '85%' }}>
              <ContainChatItem {...props}>
                {item.attachmentLocal && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 4,
                      justifyContent: right ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {item.attachmentLocal.map((attach) => {
                      return (
                        <View
                          style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#DCE6F0',
                            backgroundColor: '#F8F8FA',
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          {attach.name?.includes('pdf') && (
                            <Image
                              source={require('../../assets/file_pdf.png')}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                                marginRight: 14,
                              }}
                            />
                          )}
                          {(attach.name?.includes('doc') ||
                            attach.name?.includes('docx')) && (
                            <Image
                              source={require('../../assets/file_doc.png')}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                                marginRight: 14,
                              }}
                            />
                          )}
                          {(attach.name?.includes('xlsx') ||
                            attach.name?.includes('xls')) && (
                            <Image
                              source={require('../../assets/file_xls.png')}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                                marginRight: 14,
                              }}
                            />
                          )}
                          <View>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 15,
                                color: '#44494D',
                              }}
                            >
                              {attach.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                color: '#828282',
                                marginTop: 5,
                              }}
                            >
                              {(attach.size / (1024 * 1024)).toFixed(2)} Mb
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
                {item.attachments && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 4,
                      justifyContent: right ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {item.attachments.map((attach) => {
                      return (
                        <View
                          style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#DCE6F0',
                            backgroundColor: '#F8F8FA',
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          {attach.url.includes('pdf') && (
                            <Image
                              source={require('../../assets/file_pdf.png')}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                                marginRight: 14,
                              }}
                            />
                          )}
                          {(attach.url.includes('.doc') ||
                            attach.url.includes('.docx')) && (
                            <Image
                              source={require('../../assets/file_doc.png')}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                                marginRight: 14,
                              }}
                            />
                          )}
                          {(attach.url.includes('.xls') ||
                            attach.url.includes('.xlsx')) && (
                            <Image
                              source={require('../../assets/file_xls.png')}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                                marginRight: 14,
                              }}
                            />
                          )}
                          {/*<View>*/}
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 15,
                              flex: 1,
                              color: '#44494D',
                              fontFamily: 'SVN-GilroyMedium',
                              fontWeight: '500',
                            }}
                          >
                            {attach.origin_name}
                          </Text>
                          {/*<Text style={{*/}
                          {/*  fontSize: 13,*/}
                          {/*  color: "#828282",*/}
                          {/*  marginTop: 5*/}
                          {/*}}>*/}
                          {/*  {(attach?.size / (1024 * 1024)).toFixed(2)} Mb*/}
                          {/*</Text>*/}
                          {/*</View>*/}
                        </View>
                      );
                    })}
                  </View>
                )}
              </ContainChatItem>
            </View>
          </View>
          {/*{*/}
          {/*  !props.topMe &&*/}
          {/*  <View*/}
          {/*    style={{*/}
          {/*      flexDirection: 'row',*/}
          {/*      justifyContent: right ? 'flex-end' : 'flex-start',*/}
          {/*      alignItems: 'center',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <Text*/}
          {/*      style={{*/}
          {/*        fontWeight: '400',*/}
          {/*        fontSize: 10,*/}
          {/*        color: colors.neutralText,*/}
          {/*        marginTop: 4,*/}
          {/*        textAlign: right ? 'right' : 'left',*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      {formatTimeLastMessage(item.created_at)}*/}
          {/*    </Text>*/}
          {/*  </View>*/}

          {/*}*/}
          {item.status === 'error' && (
            <Text
              style={{
                fontWeight: '500',
                fontSize: 15,
                color: colors.primary,
                marginTop: 8,
                textAlign: right ? 'right' : 'left',
              }}
            >
              {appStore.lang.chat.send_error}
            </Text>
          )}
        </View>
      )}
    </>
  );
};

const OrderItem = function(props) {
  const item = props.item;
  const order = item.order_info?.vtp_order ? item.order_info?.vtp_order : item.order_info?.vtm_bill;

  let productNames = '';

  try {
    if (order?.ORDER_NUMBER) {
      if (order.PRODUCT_NAME) {
        productNames = order.PRODUCT_NAME;
      } else {
        productNames = order.LIST_ITEM.map((p) => {
          return p.PRODUCT_QUANTITY + 'x' + p.PRODUCT_NAME;
        }).join(' + ');
      }
    } else {
      productNames = order.ten_hang?order.ten_hang: order.product_name;
    }

  } catch (e) {
    
  }
  if (item.type === 'CREATED_GROUP_QUOTE_ORDER') {
    return (
      <TouchableOpacity
        onPress={() => {
          try {
            if (appStore.appId === 'VTPost') {
              Navigation.pop('OrderInfomationtScreenID');
              Navigation.push('ChatScreen', {
                component: {
                  id: 'OrderInfomationtScreenID',
                  name: 'OrderInfomationtScreen',
                  passProps: {
                    orderId: item.order_info?.order_number ? item.order_info?.order_number : order?.ORDER_NUMBER,
                    isSender: item.order_info?.sender_phone !== appStore.user?.phone ? 4 : 1,
                  },
                  options: {
                    bottomTabs: {
                      visible: false,
                    },
                  },
                },
              });
            }
          } catch (e) {
            
          }
        }}
      >
        <View
          style={{
            backgroundColor: colors.blueBG,
            padding: 12,
            marginVertical: 8,
          }}
        >
          <View style={{ flexDirection: 'row' }}>

            <View
              style={{
                paddingVertical: 5,
                borderRadius: 28,
                backgroundColor: '#EB960A',
                paddingHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 11,
                  color: 'white',
                  textAlign: 'center',
                }}
                numberOfLines={1}
              >
                {listChatStore.getOrderStatusById(order?.ORDER_STATUS)}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 13,
                flex: 1,
                color: colors.primaryText,
              }}
            >
              Thông báo đơn hàng
            </Text>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 13,
                color: '#E03',
              }}
            >
              {item.order_info?.order_number ? item.order_info?.order_number : order?.ORDER_NUMBER}
            </Text>
          </View>

          <Text
            style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 8,
            }}
          >
            {productNames}
          </Text>
          <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 8 }} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 17,
              color: colors.primaryText,
            }}
          >
            {order?.RECEIVER_FULLNAME} - {order?.RECEIVER_PHONE}
          </Text>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 8,
            }}
          >
            {item.order_info?.tracking_order?.content}
          </Text>
        </View>
        {/*{*/}
        {/*  item.status === 'sending' &&*/}
        {/*  <Text style={{*/}
        {/*    fontWeight: '500',*/}
        {/*    fontSize: 15,*/}
        {/*    color: colors.neutralText,*/}
        {/*    marginTop: 8*/}
        {/*  }}>{appStore.lang.chat.sending + '...'}</Text>*/}
        {/*}*/}
      </TouchableOpacity>
    );
  }

  if (order?.ORDER_NUMBER) {


    return (
      <TouchableOpacity
        onPress={() => {
          try {
            if (appStore.appId === 'VTPost') {
              Navigation.pop('OrderInfomationtScreenID');
              Navigation.push('ChatScreen', {
                component: {
                  id: 'OrderInfomationtScreenID',
                  name: 'OrderInfomationtScreen',
                  passProps: {
                    orderId: item.order_info?.order_number ? item.order_info?.order_number : order?.ORDER_NUMBER,
                    isSender: item.order_info?.sender_phone !== appStore.user?.phone ? 4 : 1,
                  },
                  options: {
                    bottomTabs: {
                      visible: false,
                    },
                  },
                },
              });
            }
          } catch (e) {
            
          }
        }}
      >
        <View
          style={{
            backgroundColor: colors.blueBG,
            padding: 12,
            marginVertical: 8,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 16,
                  color: colors.primaryText,
                }}
              >
                {item.order_info?.order_number ? item.order_info?.order_number : order?.ORDER_NUMBER}
              </Text>
              <View
                style={{
                  paddingVertical: 5,
                  borderRadius: 28,
                  backgroundColor: '#EB960A',
                  marginHorizontal: 8,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: Dimensions.get('screen').width / 2,
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 11,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {listChatStore.getOrderStatusById(order?.ORDER_STATUS)}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 17,
              color: colors.primaryText,
              marginTop: 10,
            }}
          >
            {order?.RECEIVER_FULLNAME} - {order?.RECEIVER_PHONE}
          </Text>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 2,
            }}
          >
            {productNames}
          </Text>
        </View>
        {/*{*/}
        {/*  item.status === 'sending' &&*/}
        {/*  <Text style={{*/}
        {/*    fontWeight: '500',*/}
        {/*    fontSize: 15,*/}
        {/*    color: colors.neutralText,*/}
        {/*    marginTop: 8*/}
        {/*  }}>{appStore.lang.chat.sending + '...'}</Text>*/}
        {/*}*/}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          try {
            if (appStore.appId === 'VTPost') {
              Navigation.push(appStore.componentId, {
                component: {
                  id: 'OrderInfomationtScreenID',
                  name: 'OrderInfomationtScreen',
                  passProps: {
                    orderId: item.order_info?.order_number ? item.order_info?.order_number : order?.ORDER_NUMBER,
                    isSender: item.order_info?.type === 1 ? 4 : 1,
                  },
                  options: {
                    bottomTabs: {
                      visible: false,
                    },
                  },
                },
              });
            }
          } catch (e) {
            alert(e);
          }
        }}
      >
        <View
          style={{
            backgroundColor: colors.blueBG,
            padding: 12,
            marginVertical: 8,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 16,
                  color: colors.primaryText,
                }}
              >
                {item.order_info?.order_number ? item.order_info?.order_number : (order?.ma_phieugui ? order?.ma_phieugui : order?.ORDER_NUMBER)}
              </Text>
              <View
                style={{
                  paddingVertical: 5,
                  borderRadius: 28,
                  backgroundColor: '#EB960A',
                  marginHorizontal: 8,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: Dimensions.get('screen').width / 2,
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 11,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {order?.status_name ? order?.status_name : order?.trang_thai}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 17,
              color: colors.primaryText,
              marginTop: 10,
            }}
          >
            {order?.ten_khnhan ? order?.ten_khnhan : (order.order_sendname ? order.order_sendname : order?.receiver_fullname)} - {order?.tel_khnhan ? order?.tel_khnhan : (order.order_sendtel ? order.order_sendtel : order?.receiver_phone)}
          </Text>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.neutralText,
              marginTop: 2,
            }}
          >
            {order.mota_sp ? order.mota_sp : productNames}
          </Text>
        </View>
        {/*{*/}
        {/*  item.status === 'sending' &&*/}
        {/*  <Text style={{*/}
        {/*    fontWeight: '500',*/}
        {/*    fontSize: 15,*/}
        {/*    color: colors.neutralText,*/}
        {/*    marginTop: 8*/}
        {/*  }}>{appStore.lang.chat.sending + '...'}</Text>*/}
        {/*}*/}
      </TouchableOpacity>
    );

  }
};


const StickerItem = function(props) {
  const right = props.right;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: right ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 16,
      }}
    >
      <FastImage source={stickerStore.getStickerImage(props.item.sticker_ids?.length>0 && props.item.sticker_ids[0])}
                 style={{ width: 86, height: 86, resizeMode: 'contain' }} />
    </View>
  );
};

export class ChatItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: uuid.v4,
      showPopover: false,
    };
    this.item = this.props.item;
    this.right =
      this.item.sender === appStore.user.type + '_' + appStore.user.user_id;
  }

  getFullName(user_id) {
    const find = this.props.conversation?.detail_participants?.find(
      (p) => p.full_user_id === user_id,
    );
    const findP = this.props.conversation?.participants?.find(
      (p) => p.id === user_id,
    );
    if (find) {
      return find.last_name + ' ' + find.first_name + ' - ' + participantType(findP.participant_type);
    }
    if (user_id.includes('ADMIN')) {
      return 'Admin';
    }
    return user_id;
  }

  render() {
    const userIdFull = appStore.user.type + '_' + appStore.user.user_id;
    const right = this.item.sender === userIdFull;

    let topMe = false;
    let bottomMe = false;
    try {
      topMe = this.props.data[this.props.index - 1].sender === this.item.sender && this.props.data[this.props.index - 1].type !== 'QUOTE_ORDER';
    } catch (e) {
    }

    try {
      bottomMe = this.props.data[this.props.index + 1].sender === this.item.sender && this.props.data[this.props.index + 1].type !== 'QUOTE_ORDER';
    } catch (e) {
    }

    let dividerDay =  null
    try {
      if( moment(this.props.data[this.props.index].created_at).endOf('day').diff(moment(this.props.data[this.props.index+1].created_at).startOf('day'), 'days')!==0){
        dividerDay = (
          <View style={{width: '100%', height: 42, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: '100%', height: 1, backgroundColor: '#DCE6F0'}}></View>
            <Text style={{color: '#828282'  , fontSize: 13, fontWeight: '500', padding: 12, backgroundColor: 'white', position: 'absolute'}}>{moment(this.props.data[this.props.index].created_at).format('DD/MM')}</Text>
          </View>
        )
      }
    }catch (e) {
      
    }


    let messageView;
    if (this.item.type === 'MESSAGE') {
      messageView = <MessageItem item={this.props.item} topMe={topMe} bottomMe={bottomMe} right={right} />;
    }
    if (
      this.item.type === 'CREATED_QUOTE_ORDER' ||
      this.item.type === 'CREATED_GROUP_QUOTE_ORDER' ||
      this.item.type === 'QUOTE_ORDER'
    ) {
      messageView = <OrderItem item={this.props.item} right={right} />;
      return messageView;
    }
    if (
      this.item.type === 'STICKER'
    ) {
      messageView = <StickerItem item={this.props.item} right={right} />;
    }
    if (this.item.type === 'LOCATION') {
      messageView = <MapItem item={this.props.item} right={right} />;
    }
    if (this.item.type === 'FILE') {
      messageView = <DocumentItem item={this.props.item} right={right} />;
    }
    if (this.item.type === 'VOICE') {
      messageView = <VoiceItem item={this.props.item} right={right} />;
    }
    if (!right && this.props.conversation.type === 'GROUP') {
      return (
        <View style={{ flexDirection: 'row', paddingVertical: 4, alignItems: 'flex-start' }}>
          <Image
            source={this.item.sender.includes('VTM') ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
            style={{
              width: 32,
              height: 32,
              resizeMode: 'contain',
              marginLeft: 16,
              marginTop: 16,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#828282',
                fontSize: 13,
                fontWeight: '500',
                marginLeft: 10,
                lineHeight: 18,
                marginBottom: 4,
              }}
            >
              {this.getFullName(this.item.sender)}
            </Text>
            {messageView}
          </View>
        </View>
      );
    }




    if (right || this.item.type === 'GROUP') {
      return (
        <View style={{ flexDirection: 'column', paddingVertical: 2 }}>
          {dividerDay}
          {messageView}
          {this.item.read_by?.length > 0 && this.props.index === 0 && (
            <View
              style={{
                marginHorizontal: 16,
                flexDirection: 'row',
                alignSelf: right ? 'flex-end' : 'flex-start',
              }}
            >
              {this.item.read_by?.map((item) => (
                <>
                  {
                    item !== (appStore.user.type + '_' + appStore.user.user_id) &&
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'center',
                        marginLeft: 10,
                      }}
                      source={item.includes('VTM') ? require('../../assets/avatar_default.png') : require('../../assets/avatar_default_customer.png')}
                    />
                  }
                </>
              ))}
            </View>
          )}
        </View>
      );
    } else {
      return <View style={{}}>
        {dividerDay}
        {messageView}</View>;
    }
  }
}

function ContainChatItem(props) {
  const containerRef = useRef();
  const [showPopover, setShowPopover] = useState(false);
  const [reactObject, setReactObject] = useState(props.item?.reactions ? groupBy(props.item?.reactions, (react) => react.type) : new Map());
  const [position, setPosition] = useState({ width: 0, height: 0, x: 0, y: 0 });


  useEffect(() => {
    setReactObject(
      props.item?.reactions ? groupBy(props.item?.reactions, (react) => react.type) : new Map(),
    );
  }, [props.item?.reactions]);

  const onLongPress = () => {
    if (props.item.type !== 'FILE' && props.item.type !== 'LOCATION') {
      containerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({
          width: width,
          height: height,
          x: px,
          y: py,
        });
        setShowPopover(true);
      });
    }
  };

  const reaction = async (react) => {
    try {
      setShowPopover(false);

      const response = await services.create().conversationReact({
        reaction_type: react,
        conversation_id: props.item.conversation_id,
        message_id: props.item._id,
      });
      
      if (response.data.status === 200) {
        // if (is_enable) {
        //   setReactions([
        //     {
        //       type: react,
        //       user_id: appStore.user.type + '_' + appStore.user.user_id,
        //     },
        //   ]);
        // } else {
        //   setReactions(
        //     []
        //   );
        // }
      }
    } catch (e) {
      
    }

  };

  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  return (
    <TouchableHighlight
      underlayColor="white"
      delayLongPress={300}
      ref={containerRef}
      onPress={() => {
        try {
          if (props.item.type === 'FILE') {
            DownloadViewFile(props.item.attachments?.length>0 && props.item.attachments[0].url);
          }
          if (props.item.type === 'LOCATION') {
            try {
              Linking.openURL(
                createMapLink({
                  provider: 'google',
                  // latitude: props.item?.location?.latitude,
                  // longitude: props.item?.location?.longitude,
                  query: props.item?.location?.latitude + ',' + props.item?.location?.longitude,
                }),
              );
            } catch (e) {
              
            }
          }
        } catch (e) {
        }
      }}
      onLongPress={onLongPress}
    >
      <View

        style={[{

        }]}
      >
        <View style={[props.style, { overflow: 'hidden',  flexDirection: 'row',
          alignItems: 'center',
          justifyContent: props.right ? 'flex-end' : 'flex-start', }]}>
          {
            props.children !== null &&
            React.Children.map(props.children, child => React.cloneElement(child != null ? child : <></>, { onLongPress }))
          }
        </View>
        {props.item?.reactions?.length > 0 && (
          <View
            style={[{
              flexDirection: 'row',
              borderColor: 'white',
              position: 'absolute',

            },
              (props.right ? {
                left: props.item?.reactions.length>0?(-props.item?.reactions.length*32):0,
                top: 10,
              } : {
                right: -8-(props.item?.reactions.length*32),
                top: 10,
              })]}
          >
            {reactObject.get('LIKE') && (
              <Image
                source={require('../../assets/emoji_1.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('LOVE') && (
              <Image
                source={require('../../assets/emoji_2.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('FLUSHED_FACE') && (
              <Image
                source={require('../../assets/emoji_3.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('WOW') && (
              <Image
                source={require('../../assets/emoji_4.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('SAD') && (
              <Image
                source={require('../../assets/emoji_5.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('LOUDLY_CRYING') && (
              <Image
                source={require('../../assets/emoji_6.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('ANGRY') && (
              <Image
                source={require('../../assets/emoji_7.png')}
                style={{
                  marginRight: 8,
                  width: 24, height: 24, resizeMode: 'contain',
                }}
                resizeMode={'contain'}
              />
            )}
          </View>
        )}
        <Modal
          visible={showPopover}
          transparent={true}
          onRequestClose={() => setShowPopover(false)}

        >
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => setShowPopover(false)}
            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, }}>
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                paddingVertical: 12,
                top: position.y - 60,
                paddingHorizontal: 16,
                borderRadius: 34,
                backgroundColor: 'white',
                alignSelf: 'center',
                shadowColor: '#0000001a',
                shadowOffset: {
                  width: 4,
                  height: 16,
                },
                shadowOpacity: 1,
                shadowRadius: 8,
                margin: 10,
                elevation: 16,
              }}
            >
              <TouchableOpacity
                style={{alignItems: 'center', marginHorizontal: 8}}
                onPress={() => reaction('LIKE')}
              >
                <Image
                  source={require('../../assets/emoji_1.png')}
                  style={{
                    width: 30,
                    height: 30,

                    resizeMode: 'contain',
                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'LIKE', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }

              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 8, alignItems: 'center' }}
                onPress={() => reaction('LOVE')}
              >
                <Image
                  source={require('../../assets/emoji_2.png')}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',

                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'LOVE', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 8, alignItems: 'center' }}
                onPress={() => reaction('FLUSHED_FACE')}
              >
                <Image
                  source={require('../../assets/emoji_3.png')}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',

                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'FLUSHED_FACE', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 8, alignItems: 'center' }}
                onPress={() => reaction('WOW')}
              >
                <Image
                  source={require('../../assets/emoji_4.png')}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',

                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'WOW', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 8,  alignItems: 'center' }}
                onPress={() => reaction('SAD')}
              >
                <Image
                  source={require('../../assets/emoji_5.png')}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',
                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'SAD', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 8,  alignItems: 'center' }}
                onPress={() => reaction('LOUDLY_CRYING')}
              >
                <Image
                  source={require('../../assets/emoji_6.png')}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',

                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'LOUDLY_CRYING', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 8, alignItems: 'center' }}
                onPress={() => reaction('ANGRY')}
              >
                <Image
                  source={require('../../assets/emoji_7.png')}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',
                  }}
                  resizeMode={'contain'}
                />
                {
                  (_.findIndex(props.item?.reactions, {type: 'ANGRY', user_id: appStore.user.type + '_' + appStore.user.user_id})!==-1)&&
                  <View style={{position: 'absolute', bottom: -9, width: 6, height: 6, marginTop: 3, borderRadius: 3, backgroundColor: colors.primary}}/>
                }
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  url: {
    textDecorationLine: 'underline',
  },

  email: {
    textDecorationLine: 'underline',
  },

  phone: {
    textDecorationLine: 'underline',
  },

  name: {},

  username: {
    fontWeight: 'bold',
  },

  magicNumber: {
    // fontSize: 42,
  },

  hashTag: {
    fontStyle: 'italic',
  },
});
