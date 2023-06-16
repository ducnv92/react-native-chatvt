import appStore from "./screens/AppStore";

import ChatStack from './App.js'

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
      this.navigation.navigate('ChatScreen',conversation)
    })
  }

  toListChat(){
    this.navigation.navigate('ListChatScreen');
  }
}
export const chatVT = new ChatVT()
export const AppChat = ChatStack
