export const API_BASE = 'https://dev-apichat.viettelpost.vn';
export const API_BASE_ADMIN = 'https://dev-apichat.viettelpost.vn/admin';

//Auth
exports.AUTH_VTP = `/auth/vtp`;
exports.AUTH_VTM = `/auth/vtman`;
exports.ONLINE_STATE = `/auth/state`;

//Conversation
exports.SEND_MESSAGE = (conversation_id) => `/conversation/${conversation_id}/message`;
exports.CONVERSATION_MESSAGES = (conversation_id) => `/conversation/${conversation_id}/messages`;
exports.CREATE_CONVERSATION_WITH_VTM = `/conversation/find-create-with-vtm`;
exports.CREATE_CONVERSATION_WITH_VTP =  `/conversation/find-create-with-vtp`;
exports.CONVERSATION_ME = `/conversation/me`;
exports.CONVERSATION_ADMIN = `/conversation/list`;
exports.CONVERSATION_PIN =  (conversation_id) =>`/conversation/${conversation_id}/pin`;
exports.CONVERSATION_HIDE =  (conversation_id) =>`/conversation/${conversation_id}/hide`;
exports.CONVERSATION_MUTE =  (conversation_id) =>`/conversation/${conversation_id}/notification-settings`;
exports.ORDER_VALIDATE =  `/conversation/order-validate`;
exports.GET_CONVERSATION_PIN =  `/conversation/pin/conversation`;
exports.CONVERSATION_REACT = (conversation_id, message_id)=> `/conversation/${conversation_id}/${message_id}/reaction`;

//Space
exports.UPLOAD_FILE = `${API_BASE}/space/upload`;
exports.DOWNLOAD_FILE = `${API_BASE}/space/download`;

//quick-message
exports.QUICK_MESSAGE_CREATE = `/quick-message/create`;
exports.QUICK_MESSAGE_UPDATE =(conversation_id) => `/quick-message/${conversation_id}`;
exports.QUICK_MESSAGE_LIST = `/quick-message/list`;

//Admin
exports.ADMIN_LOGIN = `${API_BASE}/admin/login`;


//VTP
exports.VTP_Login = `https://apiexsso.viettelpost.vn/api/Login/LoginUserPass`;
exports.VTP_Login_Client = `https://apivtp-dev.viettelpost.vn/api/user/ssoUpdateUser`;

//VTM
exports.VTM_Login = `https://devapp.viettelpost.vn/api/user/loginWithPhone`;
