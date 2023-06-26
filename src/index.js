import { Navigation } from 'react-native-navigation';
import appStore from "./screens/AppStore";
// import {ChatStack} from './App.js'
import {ListChatScreen} from "./screens/listchat";
import {ChatScreen} from "./screens/chat";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

class ChatVT {
  AsyncStorage;
  /** */
  init(env, storage, lang, appId,  token, tokenSSO, onSuccess, onError){
    Navigation.registerComponent('ListChatScreen', () => gestureHandlerRootHOC(ListChatScreen));
    Navigation.registerComponent('ChatScreen', () => gestureHandlerRootHOC(ChatScreen));

    this.AsyncStorage = storage
    appStore.appId = appId
    appStore.env = env
    appStore.changeLanguage(lang)

    appStore.Auth({
      token: token,
      token_sso: tokenSSO
    }, onSuccess, onError)
  }

  toListChat(componentId){
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

  /** Lang: 'VN' | 'EN' */
  changeLanguage(lang){
    appStore.changeLanguage(lang)
  }


}
export const chatVT = new ChatVT()
export const ListChat = ListChatScreen
