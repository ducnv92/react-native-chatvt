import React, { memo, useEffect, useState } from 'react';
import appStore from '../AppStore';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../../Styles';
import moment from 'moment/moment';
import ParsedText from 'react-native-parsed-text';
import { groupBy, orderStatus } from '../../utils';
import { createThumbnail } from '../../components/createThumbnail';
import ImageViewing from '../../components/imageView/ImageViewing';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { toJS } from 'mobx';
import { createMapLink, createOpenLink } from 'react-native-open-maps';
import Popover from 'react-native-popover-view';
import services from '../../services';
import { utils } from 'prettier/doc';
import uuid from 'react-native-uuid';
import { observer } from 'mobx-react-lite';
import { Navigation } from 'react-native-navigation';
import SoundPlayer from '../../components/playSound';
import { MText as Text } from '../../components';
import FileViewer from '../../components/viewFile';
import RNFS from 'react-native-fs';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import uploadProgress from './uploadProgress';
import Image from 'react-native-fast-image';

const MapItem = function (props) {
  const right =
    props.item.sender === appStore.user.type + '_' + appStore.user.user_id;

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
      <ContainChatItem {...props}>
        <View
          style={{
            height: 178,
            width: 290,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: colors.blueBG,
          }}
        >
          <MapView
            zoomEnabled={false}
            zoomTapEnabled={false}
            scrollEnabled={false}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
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
                resizeMode="contain"
              />
            </Marker>
          </MapView>
        </View>
      </ContainChatItem>
    </View>
  );
};
const VoiceItem = function (props) {
  const right =
    props.item.sender === appStore.user.type + '_' + appStore.user.user_id;
  const [isPlay, setIsPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

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
      <ContainChatItem {...props}>
        <View
          style={{
            height: 56,
            width: 251,
            borderRadius: 10,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: colors.primary,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              try {
                if (isPlay) {
                  SoundPlayer.stop();
                  setIsPlay(false);
                } else {
                  try {
                    const _onFinishedPlayingSubscription =
                      SoundPlayer.addEventListener(
                        'FinishedPlaying',
                        (finishedPlaying) => {
                          setIsPlay(false);
                          _onFinishedPlayingSubscription.remove();
                          _onFinishedLoadingSubscription.remove();
                          _onFinishedLoadingFileSubscription.remove();
                          _onFinishedLoadingURLSubscription.remove();
                        }
                      );
                    const _onFinishedLoadingSubscription =
                      SoundPlayer.addEventListener(
                        'FinishedLoading',
                        (success) => {
                          // setIsLoading(false)
                          // setIsPlay(true)
                        }
                      );
                    const _onFinishedLoadingFileSubscription =
                      SoundPlayer.addEventListener(
                        'FinishedLoadingFile',
                        (success) => {
                          setIsLoading(false);
                          setIsPlay(false);
                        }
                      );
                    const _onFinishedLoadingURLSubscription =
                      SoundPlayer.addEventListener(
                        'FinishedLoadingURL',
                        ({ success, url }) => {
                          try {
                            if (
                              success &&
                              (props.item.attachmentLocal?.length > 0
                                ? props.item.attachmentLocal[0].uri
                                : props.item.attachments[0]?.url) === url
                            ) {
                              setIsLoading(false);
                              setIsPlay(true);
                            }
                          } catch (e) {
                            console.log(e);
                          }
                        }
                      );
                    SoundPlayer.playUrl(
                      props.item.attachmentLocal?.length > 0
                        ? props.item.attachmentLocal[0].uri
                        : props.item.attachments[0]?.url
                    );
                  } catch (e) {
                    console.log(e);
                  }
                }
              } catch (e) {
                console.log(e);
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
                  : require('../../assets/ic_play.png')
              }
              style={{ height: 32, width: 32, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
          <Image
            source={require('../../assets/ic_wave_white.png')}
            style={{ flex: 1, height: 32, resizeMode: 'contain' }}
          />
          {/*<Text style={{fontWeight: '500', fontSize: 15, color: 'white'}}>{`0:05`}</Text>*/}
        </View>
      </ContainChatItem>
    </View>
  );
};

export const VideoItem = function (props) {
  const [thumbnail, setThumbnail] = useState('');
  const [isPause, setIsPause] = useState(true);
  useEffect(() => {
    const createThumb = async () => {
      try {
        const fileName = props.url.slice(
          props.url.lastIndexOf('/') + 1,
          props.url.length
        );

        const response = await createThumbnail({
          url: props.url,
          format: 'jpeg',
          cacheName: fileName,
          timeStamp: 0,
        });

        setThumbnail(response.path);
      } catch (e) {}
    };

    createThumb();
    return () => {
      setIsPause(true);
    };
  }, []);

  return (
    <View>
      {isPause ? (
        <View style={props.style}>
          {!thumbnail ? (
            <ActivityIndicator size="large" />
          ) : (
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center' }}
              onPress={() => setIsPause(false)}
            >
              <FastImage
                style={props.style}
                source={thumbnail ? { uri: thumbnail } : {}}
              />
              {!props.url.includes('file://') && (
                <FastImage
                  source={require('../../assets/ic_play.png')}
                  style={{ width: 56, height: 56, position: 'absolute' }}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ContainChatItem {...props}>
          <TouchableOpacity onPress={() => setIsPause(true)}>
            <Video
              source={{ uri: props.url }}
              resizeMode={'contain'}
              paused={isPause}
              allowsExternalPlayback
              poster={thumbnail}
              style={props.style}
            ></Video>
          </TouchableOpacity>
        </ContainChatItem>
      )}
    </View>
  );
};

const MessageItem = function (props) {
  const item = props.item;
  const right =
    item.sender === appStore.user.type + '_' + appStore.user.user_id;
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
        <View style={{ marginVertical: 4, marginHorizontal: 16 }}>
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
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 14,
                }}
              />
            )}

            <View
              style={{ borderRadius: 10, overflow: 'hidden', maxWidth: '75%' }}
            >
              {item.attachmentLocal && item.attachmentLocal.length>0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: right ? 'flex-end' : 'flex-start',
                  }}
                >
                  {item.attachmentLocal.map((File) => {
                    const attach = File.uri;
                    if (
                      attach.toLowerCase().includes('jpg') ||
                      attach.toLowerCase().includes('png') ||
                      attach.toLowerCase().includes('jpeg') ||
                      attach.toLowerCase().includes('heic')
                    ) {
                      return (
                        <TouchableOpacity
                          key={attach}
                          onPress={() => {
                            setImages([
                              {
                                uri: attach,
                              },
                            ]);
                            setImageVisible(true);
                          }}
                        >
                          <Image
                            source={{ uri: attach }}
                            style={{
                              backgroundColor: '#F2F2F2',
                              borderRadius: 5,
                              overflow: 'hidden',
                              width:
                                item.attachmentLocal.length === 1 ? 200 : 120,
                              height:
                                item.attachmentLocal.length === 1 ? 200 : 120,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              position: 'absolute',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 16,
                              top: item.attachmentLocal.length === 1 ? 65 : 35,
                            }}
                          >
                            <AnimatedProgressWheel
                              size={30}
                              animateFromValue={0}
                              progress={
                                uploadProgress.progress[item.id]
                                  ? uploadProgress.progress[item.id]
                                  : 0
                              }
                              width={3}
                              color={colors.primary}
                              backgroundColor={'#FFFFFFA3'}
                              fullColor={colors.primary}
                            ></AnimatedProgressWheel>
                            <Image
                              source={require('../../assets/ic_cancel_upload.png')}
                              style={{
                                width: 16,
                                height: 16,
                                position: 'absolute',
                                alignSelf: 'center',
                                justifySelf: 'center',
                              }}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      );
                    }
                    if (
                      attach.toLowerCase().includes('.mov') ||
                      attach.toLowerCase().includes('.mp4')
                    ) {
                      return (
                        <View>
                          <VideoItem
                            key={attach}
                            {...props}
                            source={{ uri: attach }}
                            url={attach}
                            resizeMode={'contain'}
                            allowsExternalPlayback
                            style={{
                              width: 200,
                              height: 200,
                              backgroundColor: '#f2f2f2',
                              borderRadius: 10,
                              marginVertical: 16,
                            }}
                          ></VideoItem>
                          <TouchableOpacity
                            style={{
                              position: 'absolute',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 16,
                              top: item.attachmentLocal.length === 1 ? 84 : 84,
                            }}
                          >
                            <AnimatedProgressWheel
                              size={30}
                              animateFromValue={0}
                              progress={
                                uploadProgress.progress[item.id]
                                  ? uploadProgress.progress[item.id]
                                  : 0
                              }
                              width={3}
                              color={colors.primary}
                              backgroundColor={'#FFFFFFA3'}
                              fullColor={colors.primary}
                            ></AnimatedProgressWheel>
                            <Image
                              source={require('../../assets/ic_cancel_upload.png')}
                              style={{
                                width: 16,
                                height: 16,
                                position: 'absolute',
                                alignSelf: 'center',
                                justifySelf: 'center',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    return <View />;
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
                    if (
                      attach.url.toLowerCase().includes('jpg') ||
                      attach.url.toLowerCase().includes('png') ||
                      attach.url.toLowerCase().includes('jpeg') ||
                      attach.url.toLowerCase().includes('heic')
                    ) {
                      return (
                        <TouchableOpacity
                          style={{
                            width: item.attachments.length === 1 ? 200 : 120,
                            height: item.attachments.length === 1 ? 200 : 120,
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
                        >
                          <Image
                            source={{ uri: attach.url }}
                            style={{
                              borderWidth: 0.5,
                              borderColor: '#f2f2f2',
                              backgroundColor: '#F2F2F2',
                              borderRadius: 5,
                              overflow: 'hidden',
                              width: item.attachments.length === 1 ? 200 : 120,
                              height: item.attachments.length === 1 ? 200 : 120,
                            }}
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
                          url={attach.url}
                          style={{
                            backgroundColor: '#F2F2F2',
                            borderRadius: 5,
                            overflow: 'hidden',
                            width: item.attachments.length === 1 ? 200 : 120,
                            height: item.attachments.length === 1 ? 200 : 120,
                          }}
                        />
                      );
                    }
                  })}
                </View>
              )}
            </View>
          </View>
          <ContainChatItem {...props}>
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
                {new Date(item.created_at).getFullYear() <
                new Date().getFullYear()
                  ? moment(item.created_at).format('DD/MM/YYYY')
                  : moment(item.created_at).fromNow().includes('days')
                  ? `${moment(item.created_at).format('DD/MM')}`
                  : moment(item.created_at).fromNow().includes('day')
                  ? `${moment(item.created_at).format('DD/MM')}`
                  : moment(item.created_at).format('HH:mm')}
              </Text>
            </View>
            {/*{*/}
            {/*  item.status ==='sending' &&*/}
            {/*  <Text style={{fontWeight: '500', fontSize: 15, color: colors.neutralText,  marginTop: 8, textAlign: right?'right': 'left'}}>{'Đang gửi...'}</Text>*/}
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
          </ContainChatItem>
        </View>
      ) : (
        <View style={{ marginVertical: 4, marginHorizontal: 16 }}>
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
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 14,
                }}
              />
            )}
            <View
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
                borderRadius: 10,
                maxWidth: '75%',
                borderWidth: right ? 0 : 1,
                borderColor: '#DCE6F0',
              }}
            >
              <ContainChatItem {...props}>
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
              </ContainChatItem>
            </View>
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
        </View>
      )}
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

const DocumentItem = function (props) {
  const item = props.item;
  const right =
    item.sender === appStore.user.type + '_' + appStore.user.user_id;
  return (
    <>
      {item.has_attachment && (
        <View style={{ marginVertical: 4, marginHorizontal: 16 }}>
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
                  width: 16,
                  height: 16,
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
                          {attach.type.includes('pdf') && (
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
                          {(attach.type.includes('doc') ||
                            attach.type.includes('docx')) && (
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
                          {(attach.type.includes('xlsx') ||
                            attach.type.includes('xls')) && (
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
                            {attach.key.replace('conversation/', '')}
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
              {new Date(item.created_at).getFullYear() <
              new Date().getFullYear()
                ? moment(item.created_at).format('DD/MM/YYYY')
                : moment(item.created_at).fromNow().includes('days')
                ? `${moment(item.created_at).format('DD/MM')}`
                : moment(item.created_at).fromNow().includes('day')
                ? `${moment(item.created_at).format('DD/MM')}`
                : moment(item.created_at).format('HH:mm')}
            </Text>
          </View>
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

const OrderItem = function (props) {
  const item = props.item;
  const order = item.order_info?.vtp_order;

  let productNames = '';

  try {
    if (order.PRODUCT_NAME) {
      productNames = order.PRODUCT_NAME;
    } else {
      productNames = order.LIST_ITEM.map((p) => {
        return p.PRODUCT_QUANTITY + 'x' + p.PRODUCT_NAME;
      }).join(' + ');
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <TouchableOpacity
      onPress={() => {
        try {
          Navigation.push(appStore.componentId, {
            component: {
              id: 'chat',
              name: 'OrderInfomationtScreen',
              passProps: {
                orderId: item.order_info?.order_number?item.order_info?.order_number:order?.ORDER_NUMBER,
                isSender: true,
              },
              options: {
                bottomTabs: {
                  visible: false,
                },
              },
            },
          });
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                color: colors.primaryText,
              }}
            >
              {item.order_info?.order_number?item.order_info?.order_number:order?.ORDER_NUMBER}
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
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 11,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {orderStatus(order?.ORDER_STATUS)}
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
      (p) => p.full_user_id === user_id
    );
    if (find) {
      return find.first_name + ' ' + find.last_name;
    }
    if (user_id.includes('ADMIN')) {
      return 'Admin';
    }
    return user_id;
  }

  render() {
    const right =
      this.item.sender === appStore.user.type + '_' + appStore.user.user_id;

    let messageView;
    if (this.item.type === 'MESSAGE') {
      messageView = <MessageItem item={this.props.item} />;
    }
    if (
      this.item.type === 'CREATED_QUOTE_ORDER' ||
      this.item.type === 'QUOTE_ORDER'
    ) {
      messageView = <OrderItem item={this.props.item} />;
      return messageView;
    }
    if (this.item.type === 'LOCATION') {
      messageView = <MapItem item={this.props.item} />;
    }
    if (this.item.type === 'FILE') {
      messageView = <DocumentItem item={this.props.item} />;
    }
    if (this.item.type === 'VOICE') {
      messageView = <VoiceItem item={this.props.item} />;
    }

    if (!right && this.props.conversation.type === 'GROUP') {
      return (
        <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
          <Image
            source={require('../../assets/avatar_default.png')}
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
                marginLeft: 16,
              }}
            >
              {this.getFullName(this.item.sender)}
            </Text>
            {messageView}
          </View>
        </View>
      );
    }

    if (right) {
      return (
        <View style={{ paddingVertical: 2 }}>
          {messageView}
          {this.item.read_by?.length > 0 && this.props.index===0  && (
              <View
                style={{
                  marginRight: 16,
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
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
                        source={require('../../assets/avatar_default.png')}
                      />
                    }
                  </>
                ))}
              </View>
            )}
        </View>
      );
    } else {
      return <View style={{ paddingVertical: 2 }}>{messageView}</View>;
    }
  }
}

function ContainChatItem(props) {
  const [showPopover, setShowPopover] = useState(false);
  const [reactions, setReactions] = useState(props.item?.reactions);
  const [reactObject, setReactObject] = useState(new Map());

  useEffect(() => {
    setReactObject(
      reactions ? groupBy(reactions, (react) => react.type) : new Map()
    );
  }, [reactions]);

  const reaction = async (react) => {
    setShowPopover(false);
    let is_enable = true;
    const currentReact = reactions.find(
      (r) => r.user_id === appStore.user.type + '_' + appStore.user.user_id
    );
    if (currentReact?.type === react) {
      is_enable = false;
    }
    const response = await services.create().conversationReact({
      is_enable: is_enable,
      reaction_type: react,
      conversation_id: props.item.conversation_id,
      message_id: props.item._id,
    });
    if (response.data.status === 200) {
      if (is_enable) {
        setReactions([
          ...reactions,
          {
            type: react,
            user_id: appStore.user.type + '_' + appStore.user.user_id,
          },
        ]);
      } else {
        setReactions(
          reactions.filter(
            (r) =>
              r.user_id !== appStore.user.type + '_' + appStore.user.user_id
          )
        );
      }
    }
  };
  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          try {
            if (props.item.type === 'FILE') {
              // console.log(props.item.attachments[0].url)
              // const extension = getUrlExtension(props.item.attachments[0].url);
              //
              // const localFile = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}.${extension}`;
              //
              // const options = {
              //   fromUrl: props.item.attachments[0].url,
              //   toFile: localFile,
              // };
              // RNFS.downloadFile(options)
              //   .promise.then(() => FileViewer.open(localFile))
              //   .then(() => {
              //     // success
              //   })
              //   .catch((error) => {
              //     console.log(error)
              //     // error
              //   });
              // FileViewer.open(props.item.attachments[0].url);
              Linking.openURL(props.item.attachments[0].url);
            }
            if (props.item.type === 'LOCATION') {
              try {
                Linking.openURL(
                  createMapLink({
                    provider: 'google',
                    latitude: props.item?.location?.latitude,
                    longitude: props.item?.location?.longitude,
                  })
                );
              } catch (e) {
                console.log(e);
              }
            }
          } catch (e) {
          }
        }}
        onLongPress={() => {
          if (props.item.type !== 'FILE' && props.item.type !== 'LOCATION')
            setShowPopover(true);
        }}
      >
        {props.children}

        {reactions?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              zIndex: 99,
              borderWidth: 1,
              borderColor: 'white',
              position: 'absolute',
              bottom: -16,
              right: -16,
              borderRadius: 10,
              padding: 1,
              backgroundColor: '#F8F8FA',
            }}
          >
            {reactObject.get('LIKE') && (
              <FastImage
                source={require('../../assets/emoji_1.png')}
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 4,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('LOVE') && (
              <FastImage
                source={require('../../assets/emoji_2.png')}
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 4,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('WOW') && (
              <FastImage
                source={require('../../assets/emoji_4.png')}
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 4,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('SAD') && (
              <FastImage
                source={require('../../assets/emoji_5.png')}
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 4,
                }}
                resizeMode={'contain'}
              />
            )}
            {reactObject.get('ANGRY') && (
              <FastImage
                source={require('../../assets/emoji_7.png')}
                style={{ width: 16, height: 16, resizeMode: 'contain' }}
                resizeMode={'contain'}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
      <Popover
        reactions={reactions}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
        backgroundStyle={{ backgroundColor: 'transparent' }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 34,
            backgroundColor: 'white',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            margin: 10,
            elevation: 5,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => reaction('LIKE')}
          >
            <FastImage
              source={require('../../assets/emoji_1.png')}
              style={{
                width: 30,
                height: 30,
                marginRight: 16,
                resizeMode: 'contain',
              }}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{ marginHorizontal: 8 }}
            onPress={() => reaction('LOVE')}
          >
            <FastImage
              source={require('../../assets/emoji_2.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginRight: 16,

              }}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{ marginHorizontal: 8 }}
            onPress={() => reaction('WOW')}
          >
            <FastImage
              source={require('../../assets/emoji_4.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginRight: 16,

              }}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{ marginHorizontal: 8 }}
            onPress={() => reaction('SAD')}
          >
            <FastImage
              source={require('../../assets/emoji_5.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginRight: 16,

              }}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{ marginHorizontal: 8 }}
            onPress={() => reaction('ANGRY')}
          >
            <FastImage
              source={require('../../assets/emoji_7.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
              }}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
        </View>
      </Popover>
    </>
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
