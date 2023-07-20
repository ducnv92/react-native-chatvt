import {observable, action, makeAutoObservable} from 'mobx';
import services from "../../services";
import {Log} from "../../utils";

class AttachsStore {
   isLoading = false;
   isLoadingMore = false;
   canLoadMore = true;
   isError = false;
   error = 0;
   page = 0;
   currentTab = 0;
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
        this.data = []
      }else{
        if(!this.canLoadMore){
          return
        }
        this.isLoadingMore = true;
      }
      params = {...params, ...{type: this.currentTab === 0? 'IMG_VIDEO': 'OTHER_FILE'}}
      let response = await services.create().getConversationAttachments(params);
      Log(response);

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
            if(this.page===1){
              this.data =  response.data.data.map(m=>{
                return m.attachments
              }).flat(3);
            }else{
              this.data = [...this.data, ...response.data.data.map(m=>{
                return m.attachments
              }).flat(3)];
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
}

const attachsStore = new AttachsStore();

export default attachsStore;
