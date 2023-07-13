import { Navigation } from 'react-native-navigation';
import appStore from "./screens/AppStore";
// import {ChatStack} from './App.js'
import {ListChatScreen} from "./screens/listchat";
import {ChatScreen} from "./screens/chat";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import * as MyAsyncStorage from './utils/MyAsyncStorage';
import { USER } from './utils/MyAsyncStorage';
import socket from './socket';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import hoistNonReactStatics from 'hoist-non-react-statics';
import colors from "./Styles";
import React from 'react'
import { StatusBar } from 'react-native';

function safeAreaProviderHOC(
  Component
){

  function Wrapper(props) {
    return (
      <SafeAreaProvider style={[{flex: 1}]}>
        <StatusBar
          backgroundColor={colors.primary}
        />
        <Component {...props} />
      </SafeAreaProvider>
    );
  }

Wrapper.displayName = `safeAreaProviderHOC(${
  Component.displayName || Component.name
})`;

// @ts-ignore - hoistNonReactStatics uses old version of @types/react
hoistNonReactStatics(Wrapper, Component);

return Wrapper;
}


class ChatVT {
  AsyncStorage;

  interval;
  /** */
  init(env, storage, lang, appId,  token, tokenSSO, onSuccess, onError){
    Navigation.registerComponent('ListChatScreen', () => gestureHandlerRootHOC(safeAreaProviderHOC(ListChatScreen)));
    Navigation.registerComponent('ChatScreen', () => gestureHandlerRootHOC(safeAreaProviderHOC(ChatScreen)));

    this.AsyncStorage = storage
    appStore.appId = appId
    appStore.env = env
    appStore.changeLanguage(lang)

    appStore.Auth({
      token: token,
      token_sso: tokenSSO
    }, (res)=>{
      // if(this.interval){
      //   clearInterval(this.interval)
      // }
      // this.interval = setInterval(()=>{
      //   appStore.onlineState()
      // }, 30000)
      if(onSuccess)
      onSuccess(res)
    }, onError)



  }

  toListChat(componentId){
    appStore.componentId = componentId
    Navigation.push(componentId, {
      component: {
        name: 'ListChatScreen',
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
      }
    })
  }

  toChat(componentId, orderChat){
    appStore.componentId = componentId
    if(orderChat){
      appStore.createConversation(orderChat, (conversation)=>{
        Navigation.push(componentId, {
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
              data: conversation
            }
          }
        })

      }, error=>alert(error) )
    }

  }

  handleNotification(data){
    if(appStore.appId==='VTPost'){
      const dataTest = {
        "id": "0",
        "title":"Tên nhóm chat",
        "content":"chat mesage",
        "type": 3,
        "status":0,
        "time":1666952956000,
        "ref": "group:<abc>",
        "owner": "<cus_id>",
        "app": "vtp"
    }

    }else{
      const dataTest = {
        "action": "NONE/HEN_NHAN/....",
        "content": "Thủ đô của Việt Nam là Hà Nội",
        "icon": "string",
        "mapExt": {
          "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string"
        },
        "receiverID": 528493,
        "senderID": 0,
        "title": "Thông báo"
      }
    }
  }

  /** Lang: 'VN' | 'EN' */
  changeLanguage(lang){
    appStore.changeLanguage(lang)
  }

  loginAdmin(componentId, storage, username, password, onSuccess, onError){
    appStore.componentId = componentId
    Navigation.registerComponent('ListChatScreen', () => gestureHandlerRootHOC(ListChatScreen));
    Navigation.registerComponent('ChatScreen', () => gestureHandlerRootHOC(ChatScreen));

    appStore.loginAdmin({username, password}, async data=>{
      this.AsyncStorage = storage
      appStore.appId = "Admin"
      appStore.env = "DEV"
      appStore.changeLanguage("VI")
      await MyAsyncStorage.save(USER, data)
      await socket.init()

      Navigation.push(componentId, {
        component: {
          name: 'ListChatScreen',
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
        }
      })
    })
  }

  loginVTP(componentId, storage, username, password, onSuccess, onError){
    Navigation.registerComponent('ListChatScreen', () => gestureHandlerRootHOC(ListChatScreen));
    Navigation.registerComponent('ChatScreen', () => gestureHandlerRootHOC(ChatScreen));

    appStore.loginVTP({ username, password}, async data=>{
      this.init(
          'DEV',
        storage,
          'VN',
          "VTPost",
          data.TokenKey,
          data.TokenSSO,
          onSuccess
        );
    })
  }



  loginVTM(componentId, storage, username, password, onSuccess, onError){
    Navigation.registerComponent('ListChatScreen', () => gestureHandlerRootHOC(ListChatScreen));
    Navigation.registerComponent('ChatScreen', () => gestureHandlerRootHOC(ChatScreen));

    appStore.loginVTM({  "phone": username,
      "ma_buucuc":  password}, async data=>{
      this.init(
        'DEV',
        storage,
        'VN',
        "VTMan",
        data.token,
        '',
        onSuccess
      );
    })
  }

}
export const chatVT = new ChatVT()
export const ListChat = ListChatScreen
