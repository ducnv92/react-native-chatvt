import { Navigation } from 'react-native-navigation';
import appStore from "./screens/AppStore";
// import {ChatStack} from './App.js'
import {ListChatScreen} from "./screens/listchat";
import {ChatScreen} from "./screens/chat";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

class ChatVT {
  AsyncStorage;

  interval;
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


}
export const chatVT = new ChatVT()
export const ListChat = ListChatScreen
