import io from 'socket.io-client';
import {load, USER} from "../utils/MyAsyncStorage";
import listChatStore from "../screens/listchat/ListChatStore";
import chatStore from "../screens/chat/ChatStore";
import {Log} from "../utils";
import {runInAction} from "mobx";
import appStore from "../screens/AppStore";


class Socket{
  URL = 'https://dev-receiverchat.viettelpost.vn';

  constructor() {
  }

  onConnect = ()=>{
    Log('socket onConnected')
  }
  onDisconnect = ()=>{
    Log('socket onDisconnect')
  }
  onUserMessage = (event)=>{
    console.log('socket', event)

    try{
      const right =  event?.message.sender === (appStore.user.type + '_' + appStore.user.user_id);

      try{
        runInAction(()=>{
          listChatStore.dataPin  = [...listChatStore.dataPin.map(c=>{
            if(c._id===event?.message?.conversation_id){
              if(!right) {
                c.settings = c.settings.map(setting => {
                  setting.unread_count += 1
                  return setting
                })
              }
              c.message  = event.message
            }
            return c
          })]
          listChatStore.dataPin = [...listChatStore.dataPin]
        })
      }catch (e) {
        console.log(e)
      }

      //Handler conversation
      try{
        runInAction(()=>{
          listChatStore.data  = listChatStore.data.map(c=>{
            if(c._id===event?.message?.conversation_id){
              if(!right){
                c.settings = c.settings.map(setting=>{
                  setting.unread_count+=1
                  return setting
                })
              }
              c.message  = event.message
            }
            return c
          })
          listChatStore.data = [...listChatStore.data]
        })
      }catch (e) {
        console.log(e)
      }



      //Handler message

      if(chatStore.conversation_id === event.message?.conversation_id){
        const message = chatStore.data.find(m=>m._id===event?.message?._id)
        if(!message && !right){

          runInAction(()=>{
            chatStore.data = [event.message, ...chatStore.data]
            chatStore.data = [...chatStore.data]
          })
        }
      }


    }catch (e) {
      Log(e)
    }


  }

  onUserStateMessage = (event)=>{
    console.log('socket state', event)

    try{
      runInAction(()=>{
        listChatStore.dataPin  = [...listChatStore.dataPin.map(c=>{
          if(c.sender===event?.full_user_id){
            c.detail_participants = c.detail_participants.map(pa=>{
              if(pa.full_user_id===event.full_user_id){
                pa['state'] = [event.state]
              }
              return pa
            })
          }
          return c
        })]
        listChatStore.dataPin = [...listChatStore.dataPin]
      })
    }catch (e) {
      console.log(e)
    }

    //Handler conversation
    try{
      runInAction(()=>{
        listChatStore.data  = listChatStore.data.map(c=>{
          if(c.sender===event?.full_user_id){
            c.detail_participants = c.detail_participants.map(pa=>{
              if(pa.full_user_id===event.full_user_id){
                pa['state'] = [event.state]
              }
              console.log('pa', pa)
              return pa
            })
          }
          return c
        })
        listChatStore.data = [...listChatStore.data]
      })
    }catch (e) {
      console.log(e)
    }
  }


  async init(){

    const user  = await load(USER)
    Log( user)
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
      this.socket.on('USER_STATE', this.onUserStateMessage);
    }else {
      // alert('Kết nối Socket ko thành công.')
    }
  }



}

const mSocket = new Socket()

export default mSocket
