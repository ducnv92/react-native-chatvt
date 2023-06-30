import {observable, action, makeAutoObservable} from 'mobx';
import services, {getHeader} from "../../services";
import {Log} from "../../utils";

import * as mime from "react-native-mime-types";
import ImageResizer from '@bam.tech/react-native-image-resizer';
// import { backgroundUpload } from 'react-native-compressor';
import * as Endpoint from "../../services/Endpoint";
import * as MyAsyncStorage from "../../utils/MyAsyncStorage";
import { USER } from "../../utils/MyAsyncStorage";
var RNFS = require('react-native-fs');

class ChatStore {
  isLoading = false;
  isLoadingMore = false;
  canLoadMore = true;
  isError = false;
  error = 0;
  page = 0;
  conversation_id = '';
  data = [];
  images = [];

  constructor() {
    makeAutoObservable(this);
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
    console.log('add send', params)

    let attachment_ids = []
    if (params.attachmentLocal) {
      const formData = new FormData()
      for (let i = 0; i < params.attachmentLocal.length; i++) {
        const mimeFile = mime.lookup(params.attachmentLocal[i])
        console.log('mimeFile', mimeFile)
        let fileUri = ''
        if (mimeFile.includes('video')) {
          console.log('Compression Progress: ', params.attachmentLocal[i]);

          // const result = await Video.compress(
          //   params.attachmentLocal[i],
          //   {
          //     compressionMethod: 'auto',
          //   },
          //   (progress) => {
          //       console.log('Compression Progress: ', progress);
          //   }
          // );
          // console.log('Compression Progress: ', result);
          fileUri = params.attachmentLocal[i]
          const fileName = fileUri.slice(fileUri.lastIndexOf('/') + 1, fileUri.length)

          formData.append("files", {
            name: fileName,
            uri: fileUri,
            type: 'video/mp4',
          })
        }else{
          const result = await ImageResizer.createResizedImage(
            params.attachmentLocal[i],
            1000,
            1000,
            'JPEG',
            80,
            0
          )
          console.log('compresser', result)

          // const result = await Image.compress(
          //   params.attachmentLocal[i],
          //   {
          //     compressionMethod: 'auto',
          //   },
          //   (progress) => {
          //       console.log('Compression Progress: ', progress);
          //   }
          // );
          // console.log('Compression Progress: ', result);
          fileUri = result

          // const user = await MyAsyncStorage.load(USER)

          //
          // const uploadResult = await backgroundUpload(
          //   Endpoint.UPLOAD_FILE,
          //   fileUri,
          //   { httpMethod: 'POST',  headers: {
          //       Authorization: `Bearer ${user.token}`,
          //       'Content-Type': 'multipart/form-data',
          //     }, },
          //   (written, total) => {
          //     console.log(written, total);
          //   }
          // );
          // console.log('uploadResult', uploadResult)

          const fileName = fileUri.slice(fileUri.lastIndexOf('/') + 1, fileUri.length)
          let match = /\.(\w+)$/.exec(fileName);
          let type = match ? `image/${match[1]}` : `image`;
          formData.append("files", {
            name: fileName,
            uri: fileUri,
            type: 'image/jpg',
          })
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
      console.log(this.data[0])
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
