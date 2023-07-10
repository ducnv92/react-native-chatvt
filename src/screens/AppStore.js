import {observable, action, runInAction} from 'mobx';
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
    this.lang = lang === 'EN' ? en : vi
  }


  async Auth(params, onSuccess, onError) {
    try {

      this.isLoading = true;
      const response = this.appId === 'VTMan' ? await services.create().authVTM(params) : await services.create().authVTP(params);

      Log(response);
      this.isLoading = false;
      if (response.status === 201) {
        if (response.data.status === 200) {
          if (response.data.data) {
            this.user = response.data.data;
            await MyAsyncStorage.save(USER, {...response.data.data, ...{vtp_token: params.token}})
            await socket.init()
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
      let response

      if(appStore.appId==='VTPost'){
        response = await services.create().createConversationVTM(params);
      }else{
        response = await services.create().createConversationVTP(params);
      }

      Log(response);
      this.createConversationLoading = false;
      if (response.status === 201) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if (onSuccess) {
              onSuccess(response.data.data);
            }
          }
        } else {
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


  async onlineState() {

    try {
      const response = await services.create().onlineState({
        time: new Date().getTime()
      });
      Log(response)

    } catch (error) {

    }
  }
  async orderValidate(params, onSuccess, onError) {

    try {
      const response = await services.create().orderValidate(params);
      Log(response)
      if(response.data.status === 200){
        onSuccess()
      }else{
        onError(response.data.message)
      }

    } catch (error) {

    }
  }

  async loginAdmin(params, onSuccess, onError) {

    try {
      const response = await services.create().loginAdmin(params);
      Log(response)
      if(response.data.status === 200){
        onSuccess(response.data.data)
      }else{
        alert(response.data.message)
      }

    } catch (error) {
      alert(error)
    }
  }


  async loginVTP(params, onSuccess, onError) {

    try {
      const response = await services.create().loginVTP({...params, ...{"clientId": "appvtp",
          "clientSecret": "vtp-appvtp"}});
      Log(response)
      if(response.status === 200){

        const responseClient = await services.create().loginVTPClient({
          "Source": 2,
          "Key": "tw498twe89th238Ar5y98erfwsbvsagsdfepiafklE98rbhq38r543890314123rusdf87bq38972438r4378461237eryqwrf9b",
          "TokenSSO": response.data.accessToken,
          "refreshToken": "0f97f1f484f4dfa7fb4084340cdf643ec29cc5e80bc162049fe1cf267fe26934",
          "TokenIdSSO": "",
          "Type": "VTP"
        });
        Log(responseClient)
        if(responseClient.status === 200) {
          responseClient.data.data.TokenSSO = response.data.accessToken
          onSuccess(responseClient.data.data)
        }else{
          alert(responseClient.data.errorMessage)
        }
      }else{
        alert(response.data.message)
      }

    } catch (error) {
      alert(error)
    }
  }


  async loginVTM(params, onSuccess, onError) {

    try {
      const response = await services.create().loginVTM({...params, ...{
          "source": -10,
          "latitude": 0,
          "longtitude": 0,
          "DeviceID": "string",
          "uniqueID": "string"
        }});
      Log(response)
      if(response.status === 200){
          onSuccess(response.data.data)
      }else{
        alert(response.data.message)
      }

    } catch (error) {
      alert(error)
    }
  }
}

const appStore = new AppStore();

export default appStore;
