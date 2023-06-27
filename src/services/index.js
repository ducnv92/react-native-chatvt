import apisauce from 'apisauce';
import * as Endpoint from './Endpoint';
import { USER } from '../utils/MyAsyncStorage';
import * as MyAsyncStorage from '../utils/MyAsyncStorage';
import rax from 'retry-axios'

export async function getHeader() {
  const user = await MyAsyncStorage.load(USER)
  if (user) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
        vtp_token: user.vtp_token,
      },
    };
  }
}

const create = (baseURL = Endpoint.API_BASE) => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });


  const apiMultipart = apisauce.create({
    baseURL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000,
  });

  const interceptorId = rax.attach(apiMultipart.axiosInstance)

  const authVTP = (data) => api.post(Endpoint.AUTH_VTP, data );
  const authVTM = (data) => api.post(Endpoint.AUTH_VTM, data );
  const getConversations = async (data) => api.get(Endpoint.CONVERSATION_ME, data, await getHeader() );
  const conversationPin = async (data) => api.post(Endpoint.CONVERSATION_PIN(data.conversation_id), data, await getHeader() );
  const conversationUnPin = async (data) => api.delete(Endpoint.CONVERSATION_PIN(data.conversation_id), data, await getHeader() );
  const conversationHide = async (data) => api.post(Endpoint.CONVERSATION_HIDE(data.conversation_id), data, await getHeader() );
  const conversationMessages = async (data) => api.get(Endpoint.CONVERSATION_MESSAGES(data.conversation_id), data, await getHeader() );
  const sendMessage = async (data) => api.post(Endpoint.SEND_MESSAGE(data.conversation_id), data, await getHeader() );
  const uploadFile = async (data) => apiMultipart.post(Endpoint.UPLOAD_FILE+"?time="+new Date().getTime(), data, await getHeader() );
  const downloadFile = async (data) => api.get(Endpoint.DOWNLOAD_FILE, data, await getHeader() );
  const createConversation = async (data) => api.post(Endpoint.CREATE_CONVERSATION_WITH_VTM, data, await getHeader() );


  return {
    createConversation,
    uploadFile,
    downloadFile,
    authVTP,
    authVTM,
    getConversations,
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
