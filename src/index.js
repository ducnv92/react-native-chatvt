import { Navigation } from 'react-native-navigation';
import appStore from "./screens/AppStore";
// import {ChatStack} from './App.js'
import {ListChatScreen} from "./screens/listchat";
import {ChatScreen} from "./screens/chat";


class ChatVT {
  /** */
  init(lang, token, tokenSSO, onSuccess, onError){
    Navigation.registerComponent('ListChatScreen', () => ListChatScreen);
    Navigation.registerComponent('ChatScreen', () => ChatScreen);

    appStore.Auth({
      token: token,
      token_sso: tokenSSO
    }, onSuccess, onError)
    appStore.changeLanguage(lang)
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
