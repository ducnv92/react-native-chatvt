import {makeObservable} from 'mobx';
import services from "../services";
import * as MyAsyncStorage from "../utils/MyAsyncStorage";
import {USER} from "../utils/MyAsyncStorage";
import socket from "../socket";

class AppStore {
   user = {};
   isLoading = false;
   isError = false;
   error = 0;
   data = {};


  constructor() {
    makeObservable(this);
  }


  async Auth(params, onSuccess, onError) {
    try {
      this.isLoading = true;
      const response = await services.create().auth(params);

      console.log(response);
      this.isLoading = false;
      if (response.status === 201) {
        if (response.data.status === 200) {
          if (response.data.data) {
            this.user = response.data.data;
            MyAsyncStorage.save(USER, response.data.data)
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
      console.log(error);
    }
  }

   createConversationLoading = false;
   createConversationError = false;


  async createConversation(params, onSuccess, onError) {
    try {
      const response = await services.create().createConversation(params);

      console.log(response);
      this.createConversationLoading = false;
      if (response.status === 201) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if (onSuccess) {
              onSuccess(response.data.data);
            }
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
        onError(JSON.stringify(error));
      }
      console.log(error);
    }
  }
}

const appStore = new AppStore();

export default appStore;
