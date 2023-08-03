import {observable, action, makeAutoObservable} from 'mobx';
import services, {getHeader} from "../../services";
import {Log} from "../../utils";
import uuid from "react-native-uuid";
import ImageResizer from "../../components/resizeImage";
import uploadProgress from './uploadProgress';

class InputStore {
  input = '';
  inputRef = null;

  constructor() {
    makeAutoObservable(this);
  }


}

const inputStore = new InputStore();

export default inputStore;
