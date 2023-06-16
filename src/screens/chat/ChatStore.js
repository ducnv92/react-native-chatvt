import {observable, action, makeObservable} from 'mobx';
import services from "../../services";

class ChatStore {
   isLoading = false;
   isLoadingMore = false;
   canLoadMore = true;
   isError = false;
   error = 0;
   page = 0;
   conversation_id = '';
   data = [];
   images = [];

  constructor() {
    makeObservable(this);
  }

  async getData(params, onSuccess, onError) {

    try {
      if(this.page!==0 &&(this.isLoading || this.isLoadingMore || !this.canLoadMore)){
        return
      }
      this.page+=1;
      if(this.page === 1){
        this.conversation_id = params.conversation_id
        this.isLoading = true;
        this.canLoadMore = false;
      }else{
        this.isLoadingMore = true;
      }
      const response = await services.create().conversationMessages({
        ...params,
        ...{
          page: this.page
        }
      });

      console.log(response)

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
            this.canLoadMore = response.data.data.length>0
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



  async sendMessage(params) {

    let attachment_ids = []
    if(params.attachmentLocal){
      const formData = new FormData()
      for (let i = 0; i < params.attachmentLocal.length; i++) {
        formData.append("files", {
          name: params.attachmentLocal[i].slice(params.attachmentLocal[i].lastIndexOf('/')+1, params.attachmentLocal[i].length),
          uri: params.attachmentLocal[i],
          type: 'image/jpg',
        })

      }
      const response = await services.create().uploadFile(formData);
      console.log(response)
      if(response.data.data){
        attachment_ids = response.data.data.map(a=>a._id)
      }
    }

    const response = await services.create().sendMessage({...params, ...{attachment_ids: attachment_ids}});

    console.log(response)
    if(response.status===201 && response.data.status === 200){
      this.data = this.data.map(item=>{
        if(item.id===params.id){
          item.status = 'sent'
          item._id = response.data.data._id
        }
        if(item.sender!==undefined)
        return item
      })
    }else{
      this.data = this.data.map(item=>{
        if(item.id===params.id){
          item.status = 'error'
        }
        return item
      })
    }

  }


}

const chatStore = new ChatStore();

export default chatStore;