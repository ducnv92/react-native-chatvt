// @ts-ignore
import appStore from "./screens/AppStore";

import App from './App.js'
export const ChatApp = App

class ChatVT {
  navigation
  /** */
  init(navigation, token, tokenSSO, onSuccess, onError){
    this.navigation = navigation
    appStore.Auth({
      token: token,
      token_sso: tokenSSO
    }, onSuccess, onError)
  }

  createChat(vtm_user_ids, order_number ){
    appStore.createConversation({
      vtm_user_ids: vtm_user_ids,
      order_number: order_number
    }, (conversation)=>{
      this.navigation.push('ChatScreen',conversation)
    })
  }

  toListChat(){
    this.navigation.navigate('ListChatScreen');
  }
}

export const chatVT = new ChatVT()

