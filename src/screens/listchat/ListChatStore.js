import {observable, action, makeObservable} from 'mobx';
import services from "../../services";

class ListChatStore {
  @observable isLoading = false;
  @observable isLoadingMore = false;
  @observable canLoadMore = true;
  @observable isError = false;
  @observable error = 0;
  @observable page = 0;
  @observable data = [];

  constructor() {
    makeObservable(this);
  }

  @action
  async getData(params, onSuccess, onError) {

    try {
      if(this.isLoading || this.isLoadingMore){
        return
      }
      this.page+=1;
      if(this.page === 1){
        this.isLoading = true;
        this.canLoadMore = false;
      }else{
        this.isLoadingMore = true;
      }
      const response = await services.create().getConversations(params);

      console.log(response);

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if(this.page===1){
              this.data = response.data.data;
            }else{
              this.data = [...this.data, ...response.data.data];
            }
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
      console.log(error);
    }
  }

  @action
  async pin(params, onSuccess, onError) {

      const response = await services.create().conversationPin(params);
      console.log(response);
        if (response.status === 200) {
          if (response.data.status === 200) {
            if(onSuccess)
              onSuccess()
            return
          }
        }

    }

    @action
  async unPin(params, onSuccess, onError) {

      const response = await services.create().conversationUnPin(params);
      console.log(response);
        if (response.status === 200) {
          if (response.data.status === 200) {
            if(onSuccess)
            onSuccess()
            return
          }
        }

    }
  @action
  async hide(params, onSuccess, onError) {

      const response = await services.create().conversationHide(params);
      console.log(response);
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
