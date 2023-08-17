import {observer} from "mobx-react-lite";
import React, {useRef, useState} from "react";
import {ActivityIndicator, Image, SafeAreaView, TouchableOpacity, View} from "react-native";
import colors from "../../Styles";
import {scale} from "../../utils";
import {MText as Text, MTextInput as TextInput} from "../../components";
import appStore from "../AppStore";
import listChatStore from "../listchat/ListChatStore";
import { WebView } from 'react-native-webview';
import { Navigation } from 'react-native-navigation';

export const ViewFileScreen = observer(function ViewFileScreen(props) {

  const [loading, setLoading] = useState(true)

  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <View style={{ height: scale(64), backgroundColor: colors.primary }}>
        <View
          style={{
            height: scale(64),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Navigation.pop(props.componentId);
            }}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ height: 36, width: 36, resizeMode: 'contain' }}
              source={require('../../assets/ic_back.png')}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: '600',
              fontSize: scale(17),
              color: 'white',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {props.data.name}
          </Text>
        </View>

      </View>
      <WebView style={{flex: 1}}
               scalesPageToFit
               source={{ uri: 'https://docs.google.com/viewer?url='+props.data.url }}
               onLoad={() =>setLoading(false)}
      />
      {
        loading && <ActivityIndicator size={'large'} style={{position: 'absolute', left: '50%', right: '50%'}}/>
      }
    </SafeAreaView>
  )

}
