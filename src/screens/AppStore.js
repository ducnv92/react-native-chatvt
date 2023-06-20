import {observable, action} from 'mobx';
import services from "../services";
import * as MyAsyncStorage from "../utils/MyAsyncStorage";
import {USER} from "../utils/MyAsyncStorage";
import socket from "../socket";
import vi from "../locales/vi.json";
import en from "../locales/en.json";
import {Log} from "../utils";

class AppStore {
   user = {};
   isLoading = false;
   isError = false;
   error = 0;
   data = {};
   lang = vi;
   env = "DEV";
   appId = "VTPost"; //VTMan || VTPost

  changeLanguage(lang) {
    this.lang = lang==='EN'? en:vi
  }


    async Auth(params, onSuccess, onError) {
    try {
      this.isLoading = true;
      const response = await services.create().auth(params);

      Log(response);
      this.isLoading = false;
      if (response.status === 201) {
        if (response.data.status === 200) {
          if (response.data.data) {
            this.user = response.data.data;
            MyAsyncStorage.save(USER, {...response.data.data, ...{vtp_token: params.token}})
            socket.init()
            this.isError = false;
            if (onSuccess) {
              onSuccess(response.data.data);
            }
          }
        }
      } else {
        this.isLoading = false;
        this.isError = true;
        if (onError) {
          onError('');
        }
      }
    } catch (error) {

      this.isLoading = false;
      this.isError = true;
      if (onError) {
        onError(JSON.stringify(error));
      }
      Log(error);
    }
  }

   createConversationLoading = false;
   createConversationError = false;


  async createConversation(params, onSuccess, onError) {
    try {
      const response = await services.create().createConversation(params);

      Log(response);
      this.createConversationLoading = false;
      if (response.status === 201) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if (onSuccess) {
              onSuccess(response.data.data);
            }
          }
        }else{
          if (onError) {
            onError(response.data?.message);
          }
        }
      } else {
        this.createConversationLoading = false;
        this.createConversationError = true;
        if (onError) {
          onError('');
        }
      }
    } catch (error) {

      this.createConversationLoading = false;
      this.createConversationError = true;
      if (onError) {
        onError(error);
      }
      Log(error);
    }
  }
}

const appStore = new AppStore();

export default appStore;
