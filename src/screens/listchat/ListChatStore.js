import {observable, action, makeAutoObservable, toJS} from 'mobx';
import services from "../../services";
import { Log, orderStatus } from '../../utils';
import appStore from '../AppStore';
import _ from "lodash";

class ListChatStore {
   isLoading = false;
   isLoadingPin = false;
   isLoadingMore = false;
   canLoadMore = true;
   isError = false;
   error = 0;
   page = 0;
   search = '';
   data = [];
   dataPin = [];
   orderStatusList = [];

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
    this.isLoadingPin = true
    const response = await services.create().getConversationPin(params);
    Log(response);
    this.isLoadingPin = false
    if (response.status === 200||response.status === 201) {
      if (response.data.status === 200) {
          this.dataPin = _.orderBy(response.data.data, c=>c?.message?.created_at, "desc")
          this.data = _.orderBy(this.data, c=>c?.message?.created_at, "desc")
      }
    }

  }
  async getOrderStatus(params) {
    const response = await services.create().getOrderStatus({});
    Log(response);
    if (response.status === 200||response.status === 201) {
      if (response.data.status === 200) {
        this.orderStatusList = response.data.data
      }
    }
  }

  getOrderStatusById(order_status){
    if(this.orderStatusList&&this.orderStatusList.length>0){
      const status = this.orderStatusList.find(status=>(status.status+'') === (order_status+''))
      if(status){
        return status.name
      }
    }
    return orderStatus(order_status)
  }


}

const listChatStore = new ListChatStore();

export default listChatStore;
