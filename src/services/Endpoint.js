import appStore from '../screens/AppStore';

export const API_BASE = appStore.env==='DEV'? 'https://stag-apichat.viettelpost.vn': 'https://apichat.viettelpost.vn';
export const API_BASE_ADMIN = appStore.env==='DEV'?'https://stag-apichat.viettelpost.vn/admin':'https://apichat.viettelpost.vn/admin';
//Auth
exports.AUTH_VTP = `/auth/vtp`;
exports.AUTH_VTM = `/auth/vtman`;
exports.ONLINE_STATE = `/auth/state`;

//Conversation
exports.SEND_MESSAGE = (conversation_id) =>
  `/conversation/${conversation_id}/message`;
exports.CONVERSATION_MESSAGES = (conversation_id) =>
  `/conversation/${conversation_id}/messages`;
exports.CREATE_CONVERSATION_WITH_VTM = `/conversation/find-create-with-vtm`;
exports.CREATE_CONVERSATION_WITH_VTP = `/conversation/find-create-with-vtp`;
exports.CONVERSATION_ME = `/conversation/me`;
exports.CONVERSATION_ADMIN = `/conversation/list`;
exports.CONVERSATION_PIN = (conversation_id) =>
  `/conversation/${conversation_id}/pin`;
exports.CONVERSATION = (conversation_id) => `/conversation/${conversation_id}`;
exports.CONVERSATION_HIDE = (conversation_id) =>
  `/conversation/${conversation_id}/hide`;
exports.CONVERSATION_MUTE = (conversation_id) =>
  `/conversation/${conversation_id}/notification-settings`;
exports.ORDER_VALIDATE = `/conversation/order-validate`;
exports.GET_CONVERSATION_PIN = `/conversation/pin/conversation`;
exports.VTP_CONVERSATION_WITH_CS = `/conversation/vtp/find-create-with-cs`;
exports.VTM_CONVERSATION_WITH_CS = `/conversation/vtm/find-create-with-cs`;
exports.VTP_CREATE_WITH_RECEIVER = `/conversation/vtp/find-create-with-receiver`;
exports.VTM_CREATE_WITH_RECEIVER = `/conversation/vtm/find-create-with-receiver`;
exports.GET_STICKER = `/sticker/album/list`;
exports.CONVERSATION_REACT = (conversation_id, message_id) =>
  `/conversation/${conversation_id}/${message_id}/reaction`;
exports.CONVERSATION_ATTACHMENTS = (conversation_id) =>
  `/conversation/${conversation_id}/attachments`;
exports.GET_ORDER_INFO = (order_number) =>
  `/conversation/vtm/bill-info/${order_number}`;

//Space
exports.UPLOAD_FILE = `${API_BASE}/space/upload`;
exports.DOWNLOAD_FILE = `${API_BASE}/space/download`;

//quick-message
exports.QUICK_MESSAGE_CREATE = `/quick-message/create`;
exports.QUICK_MESSAGE_UPDATE = (conversation_id) =>
  `/quick-message/${conversation_id}`;
exports.CHECK_CAN_SEND = (conversation_id) =>
  `/conversation/${conversation_id}/able-send`;
exports.QUICK_MESSAGE_LIST = `/quick-message/list`;

//Admin
exports.ADMIN_LOGIN = `${API_BASE}/admin/login`;

//VTP
exports.VTP_Login = `https://apiexsso.viettelpost.vn/api/Login/LoginUserPass`;
exports.VTP_Login_Client = `https://apivtp-dev.viettelpost.vn/api/user/ssoUpdateUser`;

//VTM
exports.VTM_Login = `https://devapp.viettelpost.vn/api/user/loginWithPhone`;
exports.VTM_CUSTOMER_BY_ORDER = `https://dev-2.viettelpost.vn/bill/cus-info`;
