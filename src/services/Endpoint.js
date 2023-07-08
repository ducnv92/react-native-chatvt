export const API_BASE = 'http://139.59.195.132';
// export const API_BASE = 'http://192.168.1.8:8000';

//Auth
exports.AUTH_VTP = `${API_BASE}/auth/vtp`;
exports.AUTH_VTM = `${API_BASE}/auth/vtman`;
exports.ONLINE_STATE = `${API_BASE}/auth/state`;

//Conversation
exports.SEND_MESSAGE = (conversation_id) => `${API_BASE}/conversation/${conversation_id}/message`;
exports.CONVERSATION_MESSAGES = (conversation_id) => `${API_BASE}/conversation/${conversation_id}/messages`;
exports.CREATE_CONVERSATION_WITH_VTM = `${API_BASE}/conversation/find-create-with-vtm`;
exports.CREATE_CONVERSATION_WITH_VTP =  `${API_BASE}/conversation/find-create-with-vtp`;
exports.CONVERSATION_ME = `${API_BASE}/conversation/me`;
exports.CONVERSATION_PIN =  (conversation_id) =>`${API_BASE}/conversation/${conversation_id}/pin`;
exports.CONVERSATION_HIDE =  (conversation_id) =>`${API_BASE}/conversation/${conversation_id}/hide`;
exports.CONVERSATION_MUTE =  (conversation_id) =>`${API_BASE}/conversation/${conversation_id}/notification-settings`;
exports.ORDER_VALIDATE =  `${API_BASE}/conversation/order-validate`;
exports.GET_CONVERSATION_PIN =  `${API_BASE}/conversation/pin/conversation`;
exports.CONVERSATION_REACT = (conversation_id, message_id)=> `${API_BASE}/conversation/${conversation_id}/${message_id}/reaction`;

//Space
exports.UPLOAD_FILE = `${API_BASE}/space/upload`;
exports.DOWNLOAD_FILE = `${API_BASE}/space/download`;

//quick-message
exports.QUICK_MESSAGE_CREATE = `${API_BASE}/quick-message/create`;
exports.QUICK_MESSAGE_UPDATE =(conversation_id) => `${API_BASE}/quick-message/${conversation_id}`;
exports.QUICK_MESSAGE_LIST = `${API_BASE}/quick-message/list`;
