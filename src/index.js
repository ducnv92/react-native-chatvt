import appStore from "./screens/AppStore";

import {ChatStack} from './App.js'

class ChatVT {
  navigation
  /** */
  init(lang, token, tokenSSO, onSuccess, onError){
    appStore.Auth({
      token: token,
      token_sso: tokenSSO
    }, onSuccess, onError)
    appStore.changeLanguage(lang)
  }

  /** Lang: 'VN' | 'EN' */
  changeLanguage(lang){
    appStore.changeLanguage(lang)
  }


}
export const chatVT = new ChatVT()
export const AppChat = ChatStack
