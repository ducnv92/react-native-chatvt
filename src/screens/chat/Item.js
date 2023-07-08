import React, {memo, useEffect, useState} from 'react';
import appStore from "../AppStore";
import {
  ActivityIndicator,
  Image,
  Linking, Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import colors from "../../Styles";
import moment from "moment/moment";
import ParsedText from "react-native-parsed-text";
import {groupBy, orderStatus} from "../../utils";
import {createThumbnail} from "../../components/createThumbnail";
import ImageViewing from "../../components/imageView/ImageViewing";
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {toJS} from 'mobx';
import {createMapLink, createOpenLink} from 'react-native-open-maps';
import Popover from 'react-native-popover-view';
import services from "../../services";
import {utils} from "prettier/doc";

const MapItem = memo(function (props) {
  const right = props.item.sender === (appStore.user.type + '_' + appStore.user.user_id);

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: right ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
    }}>
      <View

        style={{
          height: 178,
          width: 290,
          borderRadius: 10,
          overflow: 'hidden', backgroundColor: colors.blueBG
        }}>
        <MapView
          zoomEnabled={false}
          zoomTapEnabled={false}
          scrollEnabled={false}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            height: 178,
            width: 290,
            borderRadius: 10,
            overflow: 'hidden'
          }}
          region={{
            latitude: props.item.location.latitude,
            longitude: props.item.location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            style={{width: 24, height: 24}}
            coordinate={{latitude: props.item.location.latitude, longitude: props.item.location.longitude}}
            image={require('../../assets/ic_map_pin.png')}
          />
        </MapView>
      </View>
      <Emoj {...props}/>
    </View>

  )
})


const VideoItem = memo(function (props) {
  const [thumbnail, setThumbnail] = useState('')
  const [isPause, setIsPause] = useState(true)
  useEffect(() => {
    const createThumb = async () => {
      console.log('createThumbnail', props.url)

      const fileName = props.url.slice(props.url.lastIndexOf('/') + 1, props.url.length)

      const response = await createThumbnail({url: props.url, format: 'jpeg', cacheName: fileName, timeStamp: 0})
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
              <ActivityIndicator size="large"/>
            ) : (
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => setIsPause(false)}
              >
                <FastImage
                  style={props.style}
                  source={thumbnail ? {uri: thumbnail} : {}}
                />
                <FastImage source={require('../../assets/ic_play.png')}
                           style={{width: 56, height: 56, position: 'absolute',}}/>
              </TouchableOpacity>
            )}
          </View>
          :
          <TouchableOpacity
            onPress={() => setIsPause(true)}
          >
            <Video
              source={{uri: props.url}}
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
})


const MessageItem = memo(function (props) {
  const item = props.item
  const right = item.sender === (appStore.user.type + '_' + appStore.user.user_id);
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
          <View style={{marginVertical: 8, marginHorizontal: 16,}}>
            <View style={{flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center'}}>
              {
                item.status === 'error' && right &&
                <Image source={require('../../assets/ic_send_error.png')}
                       style={{width: 16, height: 16, resizeMode: 'contain', marginRight: 14}}/>
              }

              <View style={{borderRadius: 10, overflow: 'hidden', maxWidth: '75%',}}>
                {
                  item.attachmentLocal && (
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 4,
                      justifyContent: right ? 'flex-end' : 'flex-start',
                    }}>
                      {
                        item.attachmentLocal.map(File => {
                          const attach = File.uri
                          if (attach.includes('jpg') || attach.includes('png') || attach.includes('jpeg')) {
                            return <Image source={{uri: attach}} style={{
                              backgroundColor: "#F2F2F2",
                              borderRadius: 5,
                              overflow: 'hidden',
                              width: item.attachmentLocal.length === 1 ? 200 : 120,
                              height: item.attachmentLocal.length === 1 ? 200 : 120
                            }}/>
                          }
                          if (attach.includes('.mov') || attach.includes('.mp4')) {
                            return (<VideoItem source={{uri: attach}}
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
                          return <View/>
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

                              <Image source={{uri: attach.url}} style={{
                                borderWidth: 0.5,
                                borderColor: '#f2f2f2',
                                backgroundColor: "#F2F2F2",
                                borderRadius: 5,
                                overflow: 'hidden',
                                width: item.attachments.length === 1 ? 200 : 120,
                                height: item.attachments.length === 1 ? 200 : 120
                              }}/>
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
                                              }}/>
                          }

                        })
                      }
                    </View>
                  )
                }
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center'}}>
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
            <Emoj {...props}/>
          </View> :
          <View style={{marginVertical: 8, marginHorizontal: 16,}}>
            <View
              style={{flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center'}}>
              {
                item.status === 'error' && right &&
                <Image source={require('../../assets/ic_send_error.png')}
                       style={{width: 16, height: 16, resizeMode: 'contain', marginRight: 14}}/>
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
                      {type: 'url', style: styles.url, onPress: handleUrlPress},
                      {type: 'phone', style: styles.phone, onPress: handlePhonePress},
                      {type: 'email', style: styles.email, onPress: handleEmailPress},
                      // {pattern: /Bob|David/,              style: styles.name, onPress: handleNamePress},
                      // {pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: handleNamePress, renderText: renderText},
                      // {pattern: /42/,                     style: styles.magicNumber},
                      {pattern: /#(\w+)/, style: styles.hashTag},
                    ]
                  }
                  childrenProps={{allowFontScaling: false}}
                >{item.text}</ParsedText>
              </View>

            </View>
            <Emoj {...props}/>

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


})

const DocumentItem = memo(function (props) {
  const item = props.item
  const right = item.sender === (appStore.user.type + '_' + appStore.user.user_id);
  return (
    <>
      {
        item.has_attachment && (
          <View style={{marginVertical: 8, marginHorizontal: 16}}>
            <View style={{flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center'}}>
              {
                item.status === 'error' && right &&
                <Image source={require('../../assets/ic_send_error.png')}
                       style={{width: 16, height: 16, resizeMode: 'contain', marginRight: 14}}/>
              }

              <View style={{maxWidth: '85%',}}>
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
                          return (
                            <View style={{
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
                              {attach.type.includes('.doc') && (
                                <Image source={require('../../assets/file_doc.png')}
                                       style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
                              )}
                              {attach.type.includes('.xls') && (
                                <Image source={require('../../assets/file_xls.png')}
                                       style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
                              )}
                              <View>
                                <Text numberOfLines={1} style={{
                                  fontSize: 15,
                                  color: "#44494D"
                                }}>
                                  {attach.name}
                                </Text>
                                <Text style={{
                                  fontSize: 13,
                                  color: "#828282",
                                  marginTop: 5
                                }}>
                                  {(attach.size / (1024 * 1024)).toFixed(2)} Mb
                                </Text>
                              </View>
                            </View>
                          )

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
                          return (
                            <View style={{
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
                              {attach.url.includes('pdf') && (
                                <Image source={require('../../assets/file_pdf.png')}
                                       style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
                              )}
                              {attach.url.includes('.doc') && (
                                <Image source={require('../../assets/file_doc.png')}
                                       style={{width: 42, height: 42, resizeMode: 'contain', marginRight: 14}}/>
                              )}
                              {attach.url.includes('.sheet') && (
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
                            </View>
                          )
                        })
                      }
                    </View>
                  )
                }
              </View>
              <Emoj {...props}/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center'}}>
              <Text style={{
                fontWeight: '400',
                fontSize: 10,
                color: colors.neutralText,
                marginTop: 4,
                textAlign: right ? 'right' : 'left'
              }}>{new Date(item.created_at).getFullYear() < new Date().getFullYear() ? moment(item.created_at).format('DD/MM/YYYY') : moment(item.created_at).fromNow().includes('days') ? `${moment(item.created_at).format('DD/MM')}` : moment(item.created_at).fromNow().includes('day') ? `${moment(item.created_at).format('DD/MM')}` : moment(item.created_at).format('HH:mm')}</Text>
            </View>
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
        )
      }
    </>
  )
})

const OrderItem = memo(function (props) {
  const item = props.item

  return (
    <View>
      <View style={{backgroundColor: colors.blueBG, padding: 12, marginVertical: 8}}>
        <View style={{flexDirection: 'row',}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{
              fontWeight: '600',
              fontSize: 16,
              color: colors.primaryText
            }}>{item.order_info?.order_number}</Text>
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
              }}>{orderStatus(item.order_info?.order_status)}</Text>
            </View>
          </View>
        </View>
        <Text style={{
          fontWeight: '600',
          fontSize: 17,
          color: colors.primaryText,
          marginTop: 10
        }}>{item.order_info?.receiver_full_name} - {item.order_info?.receiver_phone}</Text>
        <Text style={{
          fontWeight: '500',
          fontSize: 15,
          color: colors.neutralText,
          marginTop: 2
        }}>{item.order_info?.product}</Text>

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

})


export class ChatItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showPopover: false
    }
    this.item = this.props.item
    this.right = this.item.sender === (appStore.user.type + '_' + appStore.user.user_id);
  }

  async reaction(react){
    this.setState({
      showPopover: false
    })
    const response = await services.create().conversationReact({
      is_enable: true,
      reaction_type: react,
      conversation_id: this.item.conversation_id,
      message_id: this.item._id,
    });
    console.log(response)
  }

  render() {
    let messageView
    if (this.item.type === 'MESSAGE') {
      messageView = (<MessageItem item={this.props.item}/>)
    }
    if (this.item.type === 'CREATED_QUOTE_ORDER') {
      messageView = (<OrderItem item={this.props.item}/>)
    }
    if (this.item.type === 'LOCATION') {
      messageView = (<MapItem item={this.props.item}/>)
    }
    if (this.item.type === 'FILE') {
      messageView = (<DocumentItem item={this.props.item}/>)
    }

    // let setting = {}
    // try {
    //   const mySetting = this.item.settings.find(i => i.user_id === (appStore.user.type + '_' + appStore.user.user_id))
    //   setting = mySetting ? mySetting : {}
    // } catch (e) {
    //   console.log(e)
    // }



    return (
      <Popover
        isVisible={this.state.showPopover}
        onRequestClose={() => this.setState({showPopover: false})}
        backgroundStyle={{backgroundColor: 'transparent'}}
        from={(sourceRef, showPopover) => (
          <TouchableOpacity
            onPress={() => {
              try {
                if (this.item.type === "FILE") {
                  Linking.openURL(this.item.attachments[0].url)
                }
                if (this.item.type === "LOCATION") {
                  try {
                    Linking.openURL(createMapLink({
                      provider: 'google',
                      latitude: this.item.location.latitude,
                      longitude: this.item.location.longitude
                    }))
                  } catch (e) {
                    console.log(e)
                  }
                }
              } catch (e) {
                console.log(e)
              }

            }}
            onLongPress={()=>this.setState({showPopover: true})}
          >
            {messageView}
          </TouchableOpacity>

        )}>
        <View style={{flexDirection: 'row', gap: 10, padding: 10, borderRadius: 24, backgroundColor: '#252526', overflow: 'hidden'}}>
          <TouchableWithoutFeedback
            onPress={()=>this.reaction('LIKE')}
          >
            <Image source={require('../../components/reactions/Images/like.gif')}
                   style={{width: 64, height: 64, resizeMode: 'contain'}} resizeMode={'contain'}/>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={()=>this.reaction('LOVE')}
          >
            <Image source={require('../../components/reactions/Images/love.gif')}
                   style={{width: 64, height: 64, resizeMode: 'contain'}} resizeMode={'contain'}/>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={()=>this.reaction('WOW')}
          >
            <Image source={require('../../components/reactions/Images/wow.gif')}
                   style={{width: 64, height: 64, resizeMode: 'contain'}} resizeMode={'contain'}/>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={()=>this.reaction('SAD')}
          >
            <Image source={require('../../components/reactions/Images/sad.gif')}
                   style={{width: 64, height: 64, resizeMode: 'contain'}} resizeMode={'contain'}/>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={()=>this.reaction('ANGRY')}
          >
            <Image source={require('../../components/reactions/Images/angry.gif')}
                   style={{width: 64, height: 64, resizeMode: 'contain'}} resizeMode={'contain'}/>
          </TouchableWithoutFeedback>
        </View>
      </Popover>
    )
  }


}
class Emoj extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grouped:  groupBy(this.props.item.reactions, react => react.type)
    }
    console.log('LIKE', this.state.grouped)
  }

  render(){
    return(
      <View style={{flexDirection: 'row', gap: 4,  zIndex: 99, borderWidth: 1, borderColor: 'white', position: 'absolute', bottom: -14, right: 16, borderRadius: 10, padding: 4, backgroundColor: '#F8F8FA',  }}>
        {
          this.state.grouped['LIKE'] &&
          <Image source={require('../../components/reactions/Images/ic_like.png')}
                 style={{width: 16, height: 16, resizeMode: 'contain'}} resizeMode={'contain'}/>
        }
        {
          this.state.grouped['LOVE'] &&
          <Image source={require('../../components/reactions/Images/love2.png')}
                 style={{width: 16, height: 16, resizeMode: 'contain'}} resizeMode={'contain'}/>
        }
        {
          this.state.grouped['WOW'] &&

          <Image source={require('../../components/reactions/Images/wow2.png')}
                 style={{width: 16, height: 16, resizeMode: 'contain'}} resizeMode={'contain'}/>
        }
        {
          this.state.grouped['SAD'] &&

          <Image source={require('../../components/reactions/Images/sad2.png')}
                 style={{width: 16, height: 16, resizeMode: 'contain'}} resizeMode={'contain'}/>
        }
        {
          this.state.grouped['ANGRY'] &&
          <Image source={require('../../components/reactions/Images/angry2.png')}
                 style={{width: 16, height: 16, resizeMode: 'contain'}} resizeMode={'contain'}/>
        }
      </View>

    )
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
