import {observable, action, makeAutoObservable} from 'mobx';


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

  }

}

const listChatStore = new ListChatStore();

export default listChatStore;
