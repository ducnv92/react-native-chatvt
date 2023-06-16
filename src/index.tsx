// @ts-ignore
import appStore from "./screens/AppStore";



class ChatVT {
  private navigation: any
  /** */
  init(navigation: any, token: string, tokenSSO: string, onSuccess?: Function, onError?: Function){
    this.navigation = navigation
    appStore.Auth({
      token: token,
      token_sso: tokenSSO
    }, onSuccess, onError)
  }

  createChat(vtm_user_ids: Array<number>, order_number: string ){
    appStore.createConversation({
      vtm_user_ids: vtm_user_ids,
      order_number: order_number
    }, (conversation: any)=>{
      this.navigation.push('ChatScreen',conversation)
    })
  }

  toListChat(){
    this.navigation.navigate('ListChatScreen');
  }
}

const chatVT = new ChatVT()

export default chatVT
