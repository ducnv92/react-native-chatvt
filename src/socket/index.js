import io from 'socket.io-client';
import {load, USER} from "../utils/MyAsyncStorage";
import listChatStore from "../screens/listchat/ListChatStore";
import chatStore from "../screens/chat/ChatStore";


class Socket{
  URL = 'http://146.190.193.226:80';

  constructor() {
   }

  onConnect = (event)=>{
    console.log('socket onConnect', event)
  }
  onDisconnect = (event)=>{
    console.log('socket onDisconnect', event)
  }
  onUserMessage = (event)=>{
    try{

      //Handler conversation
      listChatStore.data  = listChatStore.data.map(c=>{
        if(c._id===event?.message?.conversation_id){
          c.message = event.message
        }
        return c
      })



      //Handler message
      if(chatStore.conversation_id === event.message?.conversation_id){
        const message = chatStore.data.find(m=>m._id===event?.message?._id)
        if(!message && message!==undefined){
          console.log('add socket', message)
          chatStore.data.unshift(event.message)
        }
      }


    }catch (e) {
      console.log(e)
    }


  }

   async init(){

    const user  = await load(USER)
    console.log('socket', user)
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
