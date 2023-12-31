import { observable, action, makeAutoObservable, toJS } from 'mobx';
import services, { getHeader } from '../../services';
import { Log } from '../../utils';
import uuid from 'react-native-uuid';
import ImageResizer from '../../components/resizeImage';
import uploadProgress from './uploadProgress';
import InputStore from './InputStore';
import AnimatedSoundBars from '../../components/waveView';
import appStore from '../AppStore';
var _ = require('lodash');

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
  keyboardEmoji = false;
  data = [];
  images = [];
  queue = [];
  showAttachModal = false;
  location = {
    latitude: 0,
    longitude: 0,
  };

  tabImage;
  tabQuickMessage;
  tabLocationMessage;
  quote;

  intervalSound;
  pauseSound;
  canSend = true;
  messageCanSend = '';

  soundBarsRefs = {};
  progress = '0';

  constructor() {
    makeAutoObservable(this);
  }

  onChangeTextChat(emoji) {
    this.input += emoji;
  }

  resetData() {
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
    this.canSend = true;
  }

  async getData(params, onSuccess, onError) {
    this.conversation_id = params.conversation_id;
    try {
      if (
        this.page !== 0 &&
        (this.isLoading || this.isLoadingMore || !this.canLoadMore)
      ) {
        return;
      }
      this.page += 1;
      if (this.page === 1) {
        this.isLoading = true;
        this.canLoadMore = false;
      } else {
        this.isLoadingMore = true;
      }
      const response = await services.create().conversationMessages({
        ...params,
        ...{
          page: this.page,
        },
      });

      this.isLoading = false;
      this.isLoadingMore = false;

      Log(response);

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if (this.page === 1) {
              this.data = response.data.data;
              if (this.quote !== undefined) {
                this.data = [chatStore.quote, ...this.data];
              }
            } else {
              this.data = [...this.data, ...response.data.data];
            }
            this.canLoadMore = response.data.data.length > 0;
            this.isError = false;
            if (onSuccess) {
              onSuccess(this.data);
            }
          }
        } else {
          // alert(response.data.message)
        }
      } else {
        this.isLoading = false;
        this.isLoadingMore = false;
        this.isError = true;
        // if (onError) {
        //   onError('');
        // }
      }
    } catch (error) {
      this.isLoading = false;
      this.isLoadingMore = false;
      this.isError = true;
      // if (onError) {
      //   onError(JSON.stringify(error));
      // }
      Log(error);
    }
  }

  async getDataBackground() {
    try {
      services
        .create()
        .conversationMessages({
          conversation_id: this.conversation_id,
          page: 1,
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.status === 200) {
              if (response.data.data) {
                this.data = _.unionBy(
                  response.data.data,
                  toJS(this.data),
                  '_id'
                );
              }
            }
          }
        });
    } catch (error) {
      Log(error);
    }
  }

  async checkCanSend() {
    try {
      services
        .create()
        .checkCanSend({
          conversation_id: this.conversation_id,
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.status === 200) {
              this.canSend = response.data.data;
              this.messageCanSend = response.data.message;
            }
          }
        });
    } catch (error) {
      Log(error);
    }
  }

  async getOrderInfoVTM(order_number) {
    try {
      if (appStore.appId !== 'VTPost') {
        const response = await services.create().getOrderInfoVTM({
          order_number: order_number,
        });
        if (response.status === 200) {
          if (response.data.status === 200 && response.data.data) {
            if (
              this.quote &&
              response.data.data?.order_number === this.quote.order_number
            ) {
              this.quote.order_info.vtp_order = {
                ...this.quote.order_info.vtp_order,
                ...{
                  product_name: response.data.data?.product_name,
                  status_name: response.data.data?.status_name,
                },
              };
              this.quote = { ...this.quote };
            }
            // if (response.data.data) {
            //   this.data = _.unionBy(response.data.data, toJS(this.data), "_id");
            // }
          }
        }
      }
    } catch (error) {
      Log(error);
    }
  }

  delay = (delayInms) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };

  async sendMessage(params) {
    try {
      InputStore.inputRef?.current?.focus();
    } catch (e) {}

    const quoteCopy = { ...this.quote };
    if (this.quote) {
      this.quote = undefined;
      await this.sendMessage(quoteCopy);
    }

    let attachment_ids = [];
    if (params.attachmentLocal) {
      const formData = new FormData();
      for (let i = 0; i < params.attachmentLocal.length; i++) {
        let extension = params.attachmentLocal[i].extension;

        if (params.attachmentLocal[i].name == null) {
          extension = params.attachmentLocal[i].uri
            .split('.')
            .pop()
            .toLowerCase();
        } else {
          extension = params.attachmentLocal[i].name
            .split('.')
            .pop()
            .toLowerCase();
        }

        extension = extension?.toLowerCase();
        let fileUri = '';
        if (extension === 'mov' || extension === 'mp4') {
          fileUri = params.attachmentLocal[i].uri;

          formData.append('files', {
            name: uuid.v4() + '.' + extension,
            uri: fileUri,
            type: 'video/' + extension,
          });
        } else if (
          extension === 'doc' ||
          extension === 'pdf' ||
          extension === 'xls'
        ) {
          try {
            fileUri = params.attachmentLocal[i].uri;

            formData.append('files', {
              name: uuid.v4() + '.' + extension,
              uri: fileUri,
              type: params.attachmentLocal[i].type,
            });
          } catch (e) {}
        } else if (
          extension === 'jpg' ||
          extension === 'png' ||
          extension === 'jpeg' ||
          extension === 'heic'
        ) {
          let absolutePath = params.attachmentLocal[i].uri;
          // if (Platform.OS === 'android'){

          if (
            params.attachmentLocal[i].width >= 900 ||
            params.attachmentLocal[i].height >= 900
          ) {
            try {
              const result = await ImageResizer.createResizedImage(
                absolutePath,
                900,
                900,
                'JPEG',
                80,
                0
              );
              fileUri = result.uri;
            } catch (e) {
              fileUri = absolutePath;
            }
          } else {
            fileUri = absolutePath;
          }

          try {
            formData.append('files', {
              name: uuid.v4() + '.' + extension,
              uri: fileUri,
              type: 'image/' + extension,
            });
          } catch (e) {}
        } else {
          try {
            formData.append('files', {
              name: params.attachmentLocal[i].name,
              uri: params.attachmentLocal[i].uri,
              type: 'image/' + extension,
            });
          } catch (e) {}
        }
      }

      const response = await services
        .create()
        .uploadFile(formData, (progress) => {
          this.progress = Math.round((100 * progress.loaded) / progress.total);
        });
      try {
        if (response.data.data) {
          attachment_ids = response.data.data.map((a) => a._id);
        }
      } catch (e) {
        if (response.status === 201) {
          return;
        }
        this.data = this.data.map((item) => {
          if (item.id === params.id && item.id) {
            item.status = 'error';
          }
          return item;
        });
        return;
      }
    }
    const response = await services
      .create()
      .sendMessage({ ...params, ...{ attachment_ids: attachment_ids } });
    Log(response);

    if (response.status === 201 && response.data.status === 200) {
      this.data = [
        ...this.data.map((item) => {
          if (item.id === params.id && item.id) {
            item.status = 'sent';
            item.attachmentLocal = [];
            item.attachments = response.data.data?.message?.attachments
              ? response.data.data?.message?.attachments
              : [];
            // item.id = undefined
            item._id = response.data.data?.message?._id;
          }
          return item;
        }),
      ];
    } else {
      this.data = this.data.map((item) => {
        if (item.id === params.id && item.id) {
          item.status = 'error';
        }
        return item;
      });
    }
  }
}

const chatStore = new ChatStore();

export default chatStore;
