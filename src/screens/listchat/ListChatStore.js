import {observable, action, makeAutoObservable, toJS} from 'mobx';
import services from "../../services";
import {Log} from "../../utils";
import appStore from '../AppStore';
import _ from "lodash";

class ListChatStore {
   isLoading = false;
   isLoadingMore = false;
   canLoadMore = true;
   isError = false;
   error = 0;
   page = 0;
   search = '';
   data = [];
   dataPin = [];

  constructor() {
    makeAutoObservable(this);
  }


  async getData(params, onSuccess, onError) {

    try {
      if((this.isLoading || this.isLoadingMore) && this.page!==0 ){
        return
      }
      this.page+=1;
      params = {...params, ...{search: this.search, page: this.page}}

      if(this.page === 1){
        this.data = []
        this.dataPin = []
        this.isLoading = true;
        this.canLoadMore = true;
        if(appStore.appId!=='Admin')
          this.getConversationPin(params)
      }else{
        if(!this.canLoadMore){
          return
        }
        this.isLoadingMore = true;
      }
      let response
      if(appStore.appId==='Admin'){
        response = await services.create().getConversationsAdmin(params);
      }else{
        response = await services.create().getConversations(params);
      }


      Log(response);

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if(this.page===1){
              this.data = response.data.data;
            }else{
              this.data = [...this.data, ...response.data.data];
            }
            this.canLoadMore = response.data.data.length
            this.isLoading = false;
            this.isLoadingMore = false;
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

  async getDataBackground() {
    try {
      services.create().getConversations({
        page: 1
      }).then(response=>{
        if (response.status === 200) {
          if (response.data.status === 200) {
            if (response.data.data) {
              this.data = [..._.unionBy(response.data.data, toJS(this.data), "_id")];
            }
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
    try {
      services.create().getConversationPin({
        page: 1
      }).then(response=>{
        if (response.status === 200) {
          if (response.data.status === 200) {
            if (response.data.data) {
              this.dataPin = _.unionBy(response.data.data, toJS(this.dataPin), "_id");
            }
          }
        }
      })

    } catch (error) {
      console.log(error)
    }
  }



  async pin(params, onSuccess, onError) {

      const response = await services.create().conversationPin(params);
    Log(response);
    if (response.status === 200||response.status === 201) {
          if (response.data.status === 200) {
            if(onSuccess)
              onSuccess()
            return
          }
        }

    }


  async unPin(params, onSuccess, onError) {

      const response = await services.create().conversationUnPin(params);
    Log(response);
    if (response.status === 200||response.status === 201) {
          if (response.data.status === 200) {
            if(onSuccess)
            onSuccess()
            return
          }
        }

    }

  async mute(params, onSuccess, onError) {

      const response = await services.create().conversationMute(params);
    Log(response);
    if (response.status === 200||response.status === 201) {
          if (response.data.status === 200) {
            if(onSuccess)
            onSuccess()
          }
        }

    }

  async hide(params, onSuccess, onError) {

    const response = await services.create().conversationHide(params);
    Log(response);
    if (response.status === 200||response.status === 201) {
      if (response.data.status === 200) {
        if(onSuccess)
          onSuccess()
      }
    }

  }


  async getConversationPin(params) {

    const response = await services.create().getConversationPin(params);
    Log(response);
    if (response.status === 200||response.status === 201) {
      if (response.data.status === 200) {
          this.dataPin = response.data.data
      }
    }

  }

}

const listChatStore = new ListChatStore();

export default listChatStore;
