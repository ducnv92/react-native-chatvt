import apisauce, { ApisauceInstance } from 'apisauce';
import * as Endpoint from './Endpoint';
import { USER } from '../utils/MyAsyncStorage';
import * as MyAsyncStorage from '../utils/MyAsyncStorage';
import appStore from '../screens/AppStore';

export async function getHeader() {
  const user = await MyAsyncStorage.load(USER);
  if (user) {
    return {
      headers: {
        ...{
          Authorization: `Bearer ${user.token}`,

        }, ...(appStore.appId === 'VTPost' ? { vtp_token: user.client_token } : { vtm_token: user.client_token })
      },
    };
  }
}
export async function getHeaderVTM() {
  const user = await MyAsyncStorage.load(USER);
  if (user) {
    return {
      headers: {
        'x-access-token': `${user.client_token}`,
      },
    };
  }
}

const create = (baseURL = Endpoint.API_BASE) => {
  if (appStore.appId === 'Admin') {
    baseURL = Endpoint.API_BASE_ADMIN;
  }

  const api = apisauce.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  api.addAsyncResponseTransform((response) => async () => {
    const { config, message, problem } = response;
    if (problem === 'NETWORK_ERROR') {
      config.retry -= 1;
      const delayRetryRequest = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, config.retryDelay || 1000);
      });
      return delayRetryRequest.then(() => apisauce.create(config));
    } else {
      return response;
    }
  });

  const apiMultipart = apisauce.create({
    baseURL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000,
  });

  apiMultipart.addAsyncResponseTransform((response) => async () => {
    const { config, message, problem } = response;
    if (problem === 'NETWORK_ERROR') {
      config.retry -= 1;
      const delayRetryRequest = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, config.retryDelay || 1000);
      });
      return delayRetryRequest.then(() => apisauce.create(config));
    } else {
      return response;
    }
  });

  const authVTP = (data) => api.post(Endpoint.AUTH_VTP, data);
  const authVTM = (data) => api.post(Endpoint.AUTH_VTM, data);
  const getConversations = async (data) =>
    api.get(Endpoint.CONVERSATION_ME, data, await getHeader());
  const getConversationsAdmin = async (data) =>
    api.get(Endpoint.CONVERSATION_ADMIN, data, await getHeader());
  const conversationPin = async (data) =>
    api.post(
      Endpoint.CONVERSATION_PIN(data.conversation_id),
      data,
      await getHeader()
    );
  const conversationUnPin = async (data) =>
    api.delete(
      Endpoint.CONVERSATION_PIN(data.conversation_id),
      data,
      await getHeader()
    );
  const conversationHide = async (data) =>
    api.post(
      Endpoint.CONVERSATION_HIDE(data.conversation_id),
      data,
      await getHeader()
    );
  const conversationMessages = async (data) =>
    api.get(
      Endpoint.CONVERSATION_MESSAGES(data.conversation_id),
      data,
      await getHeader()
    );
  const sendMessage = async (data) =>
    api.post(
      Endpoint.SEND_MESSAGE(data.conversation_id),
      data,
      await getHeader()
    );
  const uploadFile = async (data, onUploadProgress) =>
    apiMultipart.post(Endpoint.UPLOAD_FILE, data, {
      ...(await getHeader()),
      ...{
        retry: 3,
        onUploadProgress,
      },
    });
  const downloadFile = async (data) =>
    api.get(Endpoint.DOWNLOAD_FILE, data, await getHeader());
  const createConversationVTM = async (data) =>
    api.post(Endpoint.CREATE_CONVERSATION_WITH_VTM, data, await getHeader());
  const createConversationVTP = async (data) =>
    api.post(Endpoint.CREATE_CONVERSATION_WITH_VTP, data, await getHeader());
  const onlineState = async (data) =>
    api.post(Endpoint.ONLINE_STATE, data, await getHeader());
  const orderValidate = async (data) =>
    api.post(Endpoint.ORDER_VALIDATE, data, await getHeader());
  const getConversationPin = async (data) =>
    api.get(Endpoint.GET_CONVERSATION_PIN, data, await getHeader());
  const conversationMute = async (data) =>
    api.post(
      Endpoint.CONVERSATION_MUTE(data.conversation_id),
      data,
      await getHeader()
    );
  const conversationReact = async (data) =>
    api.post(
      Endpoint.CONVERSATION_REACT(data.conversation_id, data.message_id),
      data,
      await getHeader()
    );

  const createQuickMessage = async (data) =>
    api.post(Endpoint.QUICK_MESSAGE_CREATE, data, await getHeader());
  const updateQuickMessage = async (data) =>
    api.put(Endpoint.QUICK_MESSAGE_UPDATE(data._id), data, await getHeader());
  const deleteQuickMessage = async (data) =>
    api.delete(
      Endpoint.QUICK_MESSAGE_UPDATE(data._id),
      data,
      await getHeader()
    );
  const listQuickMessage = async (data) =>
    api.get(Endpoint.QUICK_MESSAGE_LIST, data, await getHeader());
  const vtpConversationWithCS = async (data) =>
    api.post(Endpoint.VTP_CONVERSATION_WITH_CS, data, await getHeader());
  const vtmConversationWithCS = async (data) =>
    api.post(Endpoint.VTM_CONVERSATION_WITH_CS, data, await getHeader());
  const vtpConversationWithReceiver = async (data) =>
    api.post(Endpoint.VTP_CREATE_WITH_RECEIVER, data, await getHeader());
  const vtmConversationWithReceiver = async (data) =>
    api.post(Endpoint.VTM_CREATE_WITH_RECEIVER, data, await getHeader());

  const loginAdmin = async (data) => api.post(Endpoint.ADMIN_LOGIN, data);
  const loginVTP = async (data) => api.post(Endpoint.VTP_Login, data);
  const loginVTPClient = async (data) =>
    api.post(Endpoint.VTP_Login_Client, data);
  const loginVTM = async (data) => api.post(Endpoint.VTM_Login, data);
  const getConversationDetail = async (data) =>
    api.get(
      Endpoint.CONVERSATION(data.conversation_id),
      null,
      await getHeader()
    );
  const getConversationAttachments = async (data) =>
    api.get(
      Endpoint.CONVERSATION_ATTACHMENTS(data.conversation_id),
      data,
      await getHeader()
    );

  const getVTMCustomerByOrder = async (data) =>
    api.get(Endpoint.VTM_CUSTOMER_BY_ORDER, data, await getHeaderVTM());

  return {
    getVTMCustomerByOrder,
    vtpConversationWithReceiver,
    vtmConversationWithReceiver,
    getConversationAttachments,
    getConversationDetail,
    vtpConversationWithCS,
    vtmConversationWithCS,
    loginVTP,
    loginVTPClient,
    loginVTM,
    loginAdmin,
    createQuickMessage,
    updateQuickMessage,
    deleteQuickMessage,
    listQuickMessage,
    conversationReact,
    conversationMute,
    getConversationPin,
    orderValidate,
    onlineState,
    createConversationVTM,
    createConversationVTP,
    uploadFile,
    downloadFile,
    authVTP,
    authVTM,
    getConversations,
    getConversationsAdmin,
    conversationPin,
    conversationUnPin,
    conversationHide,
    conversationMessages,
    sendMessage,
  };
};

export default {
  create,
};
