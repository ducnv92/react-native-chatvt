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
  stickerLocal = {
    "64fd39c81c31d84495df73df": require('../../assets/gifs/0.gif'),
    "64fd39c81c31d84495df73e1": require('../../assets/gifs/1.gif'),
    "64fd39c81c31d84495df73e3": require('../../assets/gifs/2.gif'),
    "64fd39c81c31d84495df73e5": require('../../assets/gifs/3.gif'),
    "64fd39c81c31d84495df73e7": require('../../assets/gifs/4.gif'),
    "64fd39c81c31d84495df73e9": require('../../assets/gifs/5.gif'),
    "64fd39c81c31d84495df73eb": require('../../assets/gifs/6.gif'),
    "64fd39c81c31d84495df73ed": require('../../assets/gifs/7.gif'),
    "64fd39c81c31d84495df73ef": require('../../assets/gifs/8.gif'),
    "64fd39c81c31d84495df73f1": require('../../assets/gifs/9.gif'),
    "64fd39c81c31d84495df73f3": require('../../assets/gifs/10.gif'),
    // "64fd39c81c31d84495df73df": require('../../assets/gifs/11.gif'),
  }

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
       this.data?.map(category=>{
         category.stickers?.map(sticker=>{
           if(sticker._id===id || sticker.attachment_id === id){
             stickerFound = sticker
           }
         })
       })
      console.log('sticker', stickerFound)

      if(stickerFound && this.stickerLocal[stickerFound.attachment_id]){
        console.log(this.stickerLocal[stickerFound.attachment_id])
        return this.stickerLocal[stickerFound.attachment_id]
      }
      console.log('uri', stickerFound?.attachment?.url?stickerFound?.attachment?.url:'')
      return {uri: stickerFound?.attachment?.url?stickerFound?.attachment?.url:''}
    }catch (e) {
      console.log(e)
      return  {uri: ''}
    }
  }



}

const stickerStore = new StickerStore();

export default stickerStore;
