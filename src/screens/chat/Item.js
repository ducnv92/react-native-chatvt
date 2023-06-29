import React, {useEffect, useState} from 'react'
import appStore from "../AppStore";
import {ActivityIndicator, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import colors from "../../Styles";
import moment from "moment/moment";
import ParsedText from "react-native-parsed-text";
import {orderStatus} from "../../utils";
import {createThumbnail} from "react-native-create-thumbnail";
import ImageViewing from "../../components/imageView/ImageViewing";
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const VideoItem = function (props) {
  const [thumbnail, setThumbnail] = useState('')
  const [isPause, setIsPause] = useState(true)
  useEffect(() => {
    const createThumb = async () => {
      console.log('createThumbnail', props.url)

      const fileName = props.url.slice(props.url.lastIndexOf('/') + 1, props.url.length)

      const response = await createThumbnail({ url: props.url, format: 'jpeg', cacheName: fileName, timeStamp: 0 })
      console.log('createThumbnail', response)
      setThumbnail(response.path)

    }

    createThumb()
    return () => {
      setIsPause(true)
      console.log("cleaned up");
    };
  }, [])

  return (
    <View>
      {
        isPause ?
          <View style={props.style}>
            {!thumbnail ? (
              <ActivityIndicator size="large" />
            ) : (
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => setIsPause(false)}
              >
                <FastImage
                  style={props.style}
                  source={thumbnail ? { uri: thumbnail } : {}}
                />
                <FastImage source={require('../../assets/ic_play.png')} style={{width: 56, height: 56, position: 'absolute', }}/>
              </TouchableOpacity>
            )}
          </View>
          :
          <TouchableOpacity
            onPress={() => setIsPause(true)}
          >
            <Video
              source={{ uri: props.url }}
              resizeMode={'contain'}
              paused={isPause}
              allowsExternalPlayback
              poster={thumbnail}
              style={props.style}
            >

            </Video>
          </TouchableOpacity>

      }
    </View>
  )
}



const MessageItem = function (props) {
  const item = props.item
  const right =  item.sender === (appStore.user.type + '_' + appStore.user.user_id);
  const [images, setImages] = useState([])
  const [imageVisible, setImageVisible] = useState(false);


  const handleUrlPress = (url, matchIndex) => {
    Linking.openURL(url);
  }

  const handlePhonePress = (phone, matchIndex /*: number*/) => {
    // alert(`${phone} has been pressed!`);
  }

  const handleNamePress = (name, matchIndex /*: number*/) => {
    // alert(`Hello ${name}`);
  }

  const handleEmailPress = (email, matchIndex /*: number*/) => {
    // alert(`send email to ${email}`);
  }


  const renderText = (matchingString, matches) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }


  return (
    <>
      {
        item.has_attachment ?
        <View style={{ marginVertical: 8, marginHorizontal: 16, }}>
          <View style={{ flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            {
              item.status === 'error' && right &&
              <Image source={require('../../assets/ic_send_error.png')}
                     style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 14 }} />
            }

            <View style={{ borderRadius: 10, overflow: 'hidden', maxWidth: '75%', }}>
              {
                item.attachmentLocal && (
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: right ? 'flex-end' : 'flex-start',
                  }}>
                    {
                      item.attachmentLocal.map(attach => {

                        if (attach.includes('jpg') || attach.includes('png') || attach.includes('jpeg')) {
                          return <Image source={{ uri: attach }} style={{
                            backgroundColor: "#F2F2F2",
                            borderRadius: 5,
                            overflow: 'hidden',
                            width: item.attachmentLocal.length === 1 ? 200 : 120,
                            height: item.attachmentLocal.length === 1 ? 200 : 120
                          }} />
                        }
                        if (attach.includes('.mov') || attach.includes('.mp4')) {
                          return (<VideoItem source={{ uri: attach }}
                                             url={attach}
                                             resizeMode={'contain'}
                                             allowsExternalPlayback
                                             style={{
                                               width: 200,
                                               height: 200,
                                               backgroundColor: '#f2f2f2',
                                               borderRadius: 10,
                                               marginVertical: 16
                                             }}
                          >

                          </VideoItem>)
                        }
                        return <View />
                      })
                    }
                  </View>
                )
              }
              {
                item.attachments && (
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: right ? 'flex-end' : 'flex-start',
                  }}>
                    {
                      item.attachments.map(attach => {

                        if (attach.url.includes('jpg') || attach.url.includes('png') || attach.url.includes('jpeg')) {
                          return <TouchableOpacity
                            key={attach.url}
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
                              borderWidth: 0.5,
                              borderColor: '#f2f2f2',
                              backgroundColor: "#F2F2F2",
                              borderRadius: 5,
                              overflow: 'hidden',
                              width: item.attachments.length === 1 ? 200 : 120,
                              height: item.attachments.length === 1 ? 200 : 120
                            }} />
                          </TouchableOpacity>
                        }

                        if (attach.url.includes('.mov') || attach.url.includes('.mp4')) {
                          return <VideoItem url={attach.url}
                                            style={{
                                              backgroundColor: "#F2F2F2",
                                              borderRadius: 5,
                                              overflow: 'hidden',
                                              width: item.attachments.length === 1 ? 200 : 120,
                                              height: item.attachments.length === 1 ? 200 : 120
                                            }} />
                        }

                      })
                    }
                  </View>
                )
              }
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            <Text style={{
              fontWeight: '400',
              fontSize: 10,
              color: colors.neutralText,
              marginTop: 4,
              textAlign: right ? 'right' : 'left'
            }}>{new Date(item.created_at).getFullYear() < new Date().getFullYear() ? moment(item.created_at).format('DD/MM/YYYY') : moment(item.created_at).fromNow().includes('days') ? `${moment(item.created_at).format('DD/MM')}` : moment(item.created_at).fromNow().includes('day') ? `${moment(item.created_at).format('DD/MM')}` : moment(item.created_at).format('HH:mm')}</Text>
          </View>
          {/*{*/}
          {/*  item.status ==='sending' &&*/}
          {/*  <Text style={{fontWeight: '500', fontSize: 15, color: colors.neutralText,  marginTop: 8, textAlign: right?'right': 'left'}}>{'Đang gửi...'}</Text>*/}
          {/*}*/}
          {
            item.status === 'error' &&
            <Text style={{
              fontWeight: '500',
              fontSize: 15,
              color: colors.primary,
              marginTop: 8,
              textAlign: right ? 'right' : 'left'
            }}>{appStore.lang.chat.send_error}</Text>
          }
        </View>:
          <View style={{ marginVertical: 8, marginHorizontal: 16, }}>
            <View style={{ flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
              {
                item.status === 'error' && right &&
                <Image source={require('../../assets/ic_send_error.png')}
                       style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 14 }} />
              }
              <View style={{
                backgroundColor: appStore.appId === 'VTPost' ? (right ? colors.primary : "#F2F2F2") : (right ? colors.bgVTM : "#F2F2F2"),
                padding: 12,
                borderRadius: 10,
                maxWidth: '75%'
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
                    fontWeight: '400',
                    fontSize: 15,
                    color: appStore.appId === 'VTPost' ? (right ? 'white' : colors.primaryText) : colors.primaryText
                  }}
                  parse={
                    [
                      { type: 'url', style: styles.url, onPress: handleUrlPress },
                      { type: 'phone', style: styles.phone, onPress: handlePhonePress },
                      { type: 'email', style: styles.email, onPress: handleEmailPress },
                      // {pattern: /Bob|David/,              style: styles.name, onPress: handleNamePress},
                      // {pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: handleNamePress, renderText: renderText},
                      // {pattern: /42/,                     style: styles.magicNumber},
                      { pattern: /#(\w+)/, style: styles.hashTag },
                    ]
                  }
                  childrenProps={{ allowFontScaling: false }}
                >{item.text}</ParsedText>
              </View>

            </View>
            {
              item.status === 'sending' &&
              <Text style={{
                fontWeight: '500',
                fontSize: 15,
                color: colors.sending,
                marginTop: 8,
                textAlign: right ? 'right' : 'left'
              }}>{appStore.lang.chat.sending + '...'}</Text>
            }
            {
              item.status === 'error' &&
              <Text style={{
                fontWeight: '500',
                fontSize: 15,
                color: colors.primary,
                marginTop: 8,
                textAlign: right ? 'right' : 'left'
              }}>{appStore.lang.chat.send_error}</Text>
            }
          </View>

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
  )


}

const OrderItem = function (props) {
  const item = props.item

  return (
    <View>
      <View style={{ backgroundColor: colors.blueBG, padding: 12, marginVertical: 8 }}>
        <View style={{ flexDirection: 'row', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 16,
              color: colors.primaryText
            }}>{item.order_info.order_number}</Text>
            <View style={{
              paddingVertical: 5,
              paddingHorizontal: 8,
              borderRadius: 28,
              backgroundColor: '#EB960A',
              marginHorizontal: 8
            }}>
              <Text style={{
                fontWeight: '600',
                fontSize: 11,
                color: 'white'
              }}>{orderStatus(item.order_info.order_status)}</Text>
            </View>
          </View>
        </View>
        <Text style={{
          fontWeight: '600',
          fontSize: 17,
          color: colors.primaryText,
          marginTop: 10
        }}>{item.order_info.receiver_full_name} - {item.order_info.receiver_phone}</Text>
        <Text style={{
          fontWeight: '500',
          fontSize: 15,
          color: colors.neutralText,
          marginTop: 2
        }}>{item.order_info.product}</Text>

      </View>
      {
        item.status === 'sending' &&
        <Text style={{
          fontWeight: '500',
          fontSize: 15,
          color: colors.neutralText,
          marginTop: 8
        }}>{appStore.lang.chat.sending + '...'}</Text>
      }
    </View>
  )

}


export class ChatItem extends React.Component{

  constructor(props) {
    super(props);
    this.state = {

    }
    this.item = this.props.item
    this.right =  this.item.sender === (appStore.user.type + '_' + appStore.user.user_id);
  }

  render() {
    if (this.item.type === 'MESSAGE') {
      return (<MessageItem item={this.props.item}/>)
    }
    if (this.item.type === 'CREATED_QUOTE_ORDER') {
      return (<OrderItem item={this.props.item}/>)
    }
  }


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
    fontWeight: 'bold'
  },

  magicNumber: {
    // fontSize: 42,
  },

  hashTag: {
    fontStyle: 'italic',
  },
});
