import {observable, action, makeAutoObservable} from 'mobx';
import services, {getHeader} from "../../services";
import {Log} from "../../utils";
import uuid from "react-native-uuid";
import ImageResizer from "../../components/resizeImage";

class UploadProgress {

  progress = {

  }

  constructor() {
    makeAutoObservable(this);
  }

}

const uploadProgress = new UploadProgress();

export default uploadProgress;
