import {observable, action, makeAutoObservable} from 'mobx';
import services, {getHeader} from "../../services";
import {Log} from "../../utils";

import * as mime from "react-native-mime-types";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as Endpoint from "../../services/Endpoint";
import * as MyAsyncStorage from "../../utils/MyAsyncStorage";
import { USER } from "../../utils/MyAsyncStorage";
import {Platform} from "react-native";
import uuid from "react-native-uuid";
import {useRef} from "react";
import {lookup} from "react-native-mime-types";
var RNFS = require('react-native-fs');
import CameraRoll from "../../components/cameraRollPicker/CameraRoll";

class ChatStore {
  isLoading = false;
  isLoadingMore = false;
  canLoadMore = true;
  isError = false;
  error = 0;
  page = 0;
  tab = 1;
  conversation_id = '';
  input = '';
  inputRef = null;
  keyboardEmoji = false;
  data = [];
  images = [];
  showAttachModal = false;
  location = {
    latitude: 0,
    longitude: 0,
  };

  tabImage;
  tabQuickMessage;
  tabLocationMessage;


  constructor() {
    makeAutoObservable(this);
  }

  resetData(){
    this.isLoading = false;
    this.isLoadingMore = false;
    this.canLoadMore = true;
    this.isError = false;
    this.error = 0;
    this.page = 0;
    this.tab = 1;
    this.conversation_id = '';
    this.input = '';
    this.data = [];
    this.images = [];
    this.showAttachModal = false;
  }


  async getData(params, onSuccess, onError) {
    this.conversation_id = params.conversation_id
    try {
      if (this.page !== 0 && (this.isLoading || this.isLoadingMore || !this.canLoadMore)) {
        return
      }
      this.page += 1;
      if (this.page === 1) {
        this.data = []
        this.isLoading = true;
        this.canLoadMore = false;
      } else {
        this.isLoadingMore = true;
      }
      const response = await services.create().conversationMessages({
        ...params,
        ...{
          page: this.page
        }
      });

      Log(response)

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if (this.page === 1) {
              this.data = response.data.data;
            } else {
              this.data = [...this.data, ...response.data.data];
            }
            this.isLoading = false;
            this.isLoadingMore = false;
            this.canLoadMore = response.data.data.length > 0
            this.isError = false;
            if (onSuccess) {
              onSuccess(this.data);
            }
          }
        }
      } else {
        this.isLoading = false;
        this.isLoadingMore = false;
        this.isError = true;
        if (onError) {
          onError('');
        }
      }
    } catch (error) {
      this.isLoading = false;
      this.isLoadingMore = false;
      this.isError = true;
      if (onError) {
        onError(JSON.stringify(error));
      }
      Log(error);
    }
  }

  delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }

  async sendMessage(params) {

    Log(params)
    let attachment_ids = []
    if (params.attachmentLocal) {
      const formData = new FormData()
      for (let i = 0; i < params.attachmentLocal.length; i++) {

        let extension = params.attachmentLocal[i].extension


          if(params.attachmentLocal[i].name==null){
            extension = params.attachmentLocal[i].uri.split(".").pop().toLowerCase();
          }else{
            extension = params.attachmentLocal[i].name.split(".").pop().toLowerCase();
          }

        extension = extension?.toLowerCase();
        let fileUri = ''
        if (extension === 'mov' || extension === 'mp4') {
          fileUri = params.attachmentLocal[i].uri

          formData.append("files", {
            name: uuid.v4()+'.'+extension,
            uri: fileUri,
            type: 'video/'+extension,
          })

        }else if(extension === 'doc' || extension === 'pdf'|| extension==='xls'){
          try{
            fileUri = params.attachmentLocal[i].uri

            formData.append("files", {
              name: uuid.v4()+'.'+extension,
              uri: fileUri,
              type: params.attachmentLocal[i].type,
            })
          }catch (e) {

          }

        }
        else if(extension === 'jpg' ||extension ==='png'||extension ==='jpeg'||extension ==='heic'){

          let absolutePath = params.attachmentLocal[i].uri
          // if (Platform.OS === 'android'){

            if(params.attachmentLocal[i].width>=900 || params.attachmentLocal[i].height>=900 ){
              try{
                const result = await ImageResizer.createResizedImage(
                  absolutePath,
                  900,
                  900,
                  'JPEG',
                  80,
                  0
                )
                console.log('result', JSON.stringify(result))
                fileUri = result.uri
              }catch (e) {
                fileUri = absolutePath
                console.log(e)
              }
          }else{
            fileUri = absolutePath
          }


          try{
            formData.append("files", {
              name: uuid.v4()+'.'+extension,
              uri: fileUri,
              type: 'image/'+extension,
            })
          }catch (e) {

          }

        }
        else{

          try{
            formData.append("files", {
              name: params.attachmentLocal[i].name,
              uri: params.attachmentLocal[i].uri,
              type: 'image/'+extension,
            })


          }catch (e) {

          }
        }
      }

      const response = await services.create().uploadFile(formData);
      Log(response)
      try {
        if (response.data.data) {
          attachment_ids = response.data.data.map(a => a._id)
        }
      } catch (e) {
        if (response.status === 201) {
          return

        }
        this.data = this.data.map(item => {
          if (item.id === params.id) {
            item.status = 'error'
          }
          return item
        })
        return
      }

    }
    const response = await services.create().sendMessage({ ...params, ...{ attachment_ids: attachment_ids } });
    Log(response)

    if (response.status === 201 && response.data.status === 200) {
      this.data = [...this.data.map((item) => {
        if (item.id === params.id) {
          item.status = 'sent'
        }
        return item
      })]
    } else {
      this.data = this.data.map(item => {
        if (item.id === params.id) {
          item.status = 'error'
        }
        return item
      })
    }

  }


}

const chatStore = new ChatStore();

export default chatStore;
