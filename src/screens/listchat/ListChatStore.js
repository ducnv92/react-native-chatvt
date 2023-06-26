import {observable, action, makeAutoObservable} from 'mobx';
import services from "../../services";
import {Log} from "../../utils";

class ListChatStore {
   isLoading = false;
   isLoadingMore = false;
   canLoadMore = true;
   isError = false;
   error = 0;
   page = 0;
   search = '';
   data = [];

  constructor() {
    makeAutoObservable(this);
  }


  async getData(params, onSuccess, onError) {

    try {
      if((this.isLoading || this.isLoadingMore) && this.page!==0 ){
        return
      }
      this.page+=1;
      if(this.page === 1){
        this.isLoading = true;
        this.canLoadMore = true;
      }else{
        if(!this.canLoadMore){
          return
        }
        this.isLoadingMore = true;
      }
      params = {...params, ...{search: this.search, page: this.page}}
      const response = await services.create().getConversations(params);

      Log(response);

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if(params.page===1){
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


  async pin(params, onSuccess, onError) {

      const response = await services.create().conversationPin(params);
    Log(response);
        if (response.status === 200) {
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
        if (response.status === 200) {
          if (response.data.status === 200) {
            if(onSuccess)
            onSuccess()
            return
          }
        }

    }

  async hide(params, onSuccess, onError) {

      const response = await services.create().conversationHide(params);
    Log(response);
        if (response.status === 200) {
          if (response.data.status === 200) {
            if(onSuccess)
            onSuccess()
            return
          }
        }

    }

}

const listChatStore = new ListChatStore();

export default listChatStore;
