import {observable, action, makeAutoObservable} from 'mobx';
import services from "../../services";
import {Log} from "../../utils";
import appStore from '../AppStore';

class QuickMessageStore {
   isLoading = false;
   isError = false;

   data = [];

  constructor() {
    makeAutoObservable(this);
  }


  async getData(params, onSuccess, onError) {

    try {
      this.isLoading = true
      const response = await services.create().listQuickMessage(params);
      Log(response);

      if (response.status === 200) {
        if (response.data.status === 200) {
          if (response.data.data) {
              this.data = response.data.data;

            this.isLoading = false;
            this.isError = false;
            if (onSuccess) {
              onSuccess(this.data);
            }
          }
        }
      } else {
        this.isLoading = false;
        this.isError = true;
        if (onError) {
          onError('');
        }
      }
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      if (onError) {
        onError(JSON.stringify(error));
      }
      Log(error);
    }
  }

  async create(params, onSuccess, onError) {
    const response = await services.create().createQuickMessage(params);
    Log(response);

    if (response.status === 200) {
      if (response.data.status === 200) {
        this.getData({})
      }
    }
  }

  async update(params, onSuccess, onError) {
    const response = await services.create().updateQuickMessage(params);
    Log(response);

    if (response.status === 200) {
      if (response.data.status === 200) {
        this.getData({})
        onSuccess()
      }
    }
  }
  async delete(params, onSuccess, onError) {
    const response = await services.create().updateQuickMessage(params);
    Log(response);
    if (response.status === 200) {
      if (response.data.status === 200) {
        onSuccess()
        this.getData({})
      }
    }
  }

}

const quickMessageStore = new QuickMessageStore();

export default quickMessageStore;
