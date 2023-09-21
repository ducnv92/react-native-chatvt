import io from 'socket.io-client';
import {load, USER} from "../utils/MyAsyncStorage";
import listChatStore from "../screens/listchat/ListChatStore";
import chatStore from "../screens/chat/ChatStore";
import {Log} from "../utils";
import {runInAction, toJS} from "mobx";
import appStore from "../screens/AppStore";
import {AppState} from "react-native";
import _ from "lodash";


class Socket{
  URL = 'https://stag-receiverchat.viettelpost.vn';

  static instance
  socket
  currentToken
  hasDisconnect

  static getInstance(){
    if(Socket.instance!==undefined){
      return Socket.instance
    }else{
      Socket.instance = new Socket()
      return Socket.instance
    }
  }

  constructor() {
  }

  onConnect = ()=>{
    console.log('socket', 'onConnected')
    this.socket.on('USER_MESSAGE', this.onUserMessage);
    this.socket.on('USER_STATE', this.onUserStateMessage);
    this.socket.on('USER_REACT_MESSAGE', this.onUserReactionMessage);

    if(this.hasDisconnect){
      this.hasDisconnect = false
      listChatStore.getDataBackground();
      if(chatStore.conversation_id){
        chatStore.getDataBackground()
      }
    }
  }
  onDisconnect = ()=>{
    console.log('socket', 'onDisconnect')
    this.hasDisconnect = true
  }
  onUserMessage = (event)=>{
    console.log('socket onUserMessage', event)

    try{
      const right =  event?.message.sender === (appStore.user.type + '_' + appStore.user.user_id);

      try{
        runInAction(()=>{
          listChatStore.dataPin  = [...listChatStore.dataPin.map(c=>{
            if(c._id===event?.message?.conversation_id && c.message._id!==event?.message?._id){
              if(!right && chatStore.conversation_id!==event?.message?.conversation_id) {
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
            if(c._id===event?.message?.conversation_id && c.message._id!==event?.message?._id){
              if(!right && chatStore.conversation_id!==event?.message?.conversation_id){
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

  onUserReactionMessage = (event)=> {
    try{
      if(chatStore.conversation_id===event.conversation._id){
        chatStore.data = chatStore.data.map(m=>{
          if(m._id === event.conversation.message._id){
            m.reactions = event.conversation.message.reactions
          }
          return m
        })
      }
    }catch (e) {

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
    console.log( 'user', user)
    if(user && this.currentToken!==user.token){
      this.socket = io.connect(this.URL, {
        reconnection: true,
        autoConnect: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 9999999,
        transports: ["polling", "websocket", "webtransport"],
        extraHeaders: {
          Authorization: user.token
        },
      });
      this.currentToken = user.token
      this.socket.on('connect', this.onConnect);
      this.socket.on('disconnect', this.onDisconnect);
    }else {
      // alert('Kết nối Socket ko thành công.')
    }
  }



}


export default Socket
