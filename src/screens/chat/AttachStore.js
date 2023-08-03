import {observable, action, makeAutoObservable} from 'mobx';
import services, {getHeader} from "../../services";
import {Log} from "../../utils";
import uuid from "react-native-uuid";
import ImageResizer from "../../components/resizeImage";
import uploadProgress from './uploadProgress';

class AttachStore {
  images = [];

  constructor() {
    makeAutoObservable(this);
  }


}

const attachStore = new AttachStore();

export default attachStore;
