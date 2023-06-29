import io from 'socket.io-client';
import {load, USER} from "../utils/MyAsyncStorage";
import listChatStore from "../screens/listchat/ListChatStore";
import chatStore from "../screens/chat/ChatStore";
import {Log} from "../utils";
import {runInAction} from "mobx";
import appStore from "../screens/AppStore";


class Socket{
  URL = 'http://146.190.193.226:80';

  constructor() {
   }

  onConnect = ()=>{
    Log('socket onConnected')
  }
  onDisconnect = ()=>{
    Log('socket onDisconnect')
  }
  onUserMessage = (event)=>{
    console.log('event', event)
    try{
      Log(event)
      //Handler conversation
      runInAction(()=>{
        listChatStore.data  = listChatStore.data.map(c=>{
          if(c._id===event?.message?.conversation_id){
            c.message = event.message
          }
          return c
        })
      })




      //Handler message

      if(chatStore.conversation_id === event.message?.conversation_id){
      const message = chatStore.data.find(m=>m._id===event?.message?._id)
        Log(message)
        if(!message){

          const right =  event?.message.sender === (appStore.user.type + '_' + appStore.user.user_id);
          runInAction(()=>{
            if(!right){
              chatStore.data.unshift(event.message)
              chatStore.data = [...chatStore.data]
            }

          })

        }
      }


    }catch (e) {
      Log(e)
    }


  }

   async init(){

    const user  = await load(USER)
     Log('socket', user)
     if(user && !this.socket){
       this.socket = io.connect(this.URL, {
         reconnection: true,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 5000,
         transports: ['websocket'],
         extraHeaders: {
           Authorization: user.token
         }
       });
       this.socket.on('connect', this.onConnect);
       this.socket.on('disconnect', this.onDisconnect);
       this.socket.on('USER_MESSAGE', this.onUserMessage);
     }

   }



}

const mSocket = new Socket()

export default mSocket
