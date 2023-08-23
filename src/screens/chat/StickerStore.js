import {observable, action, makeAutoObservable, toJS} from 'mobx';
import services, {getHeader} from "../../services";
import {Log} from "../../utils";
import uuid from "react-native-uuid";
import ImageResizer from "../../components/resizeImage";
import uploadProgress from './uploadProgress';
import _ from "lodash";

class StickerStore {
  images = [];
  stickers = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getStickers() {
    try {
      services.create().getStickers({
        page: 1,
        limit: 1000
      }).then(response=>{
        console.log('getSticker', response)
        if (response.status === 200) {
          if (response.data.status === 200) {
            if (response.data.data) {
              this.data = response.data.data;
            }
          }
        }
      }).catch(e=>console.log(e))
    } catch (error) {
     console.log(error)
    }
  }

  getStickerImage(id){
    try{
      let stickerFound
       this.data.map(category=>{
         category.stickers.map(sticker=>{
           if(sticker._id===id){
             stickerFound = sticker
           }
         })
       })
      return stickerFound?.attachment?.url?stickerFound?.attachment?.url:''
    }catch (e) {
      console.log(e)
      return ''
    }
  }



}

const stickerStore = new StickerStore();

export default stickerStore;
