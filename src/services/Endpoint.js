export const API_BASE = 'http://139.59.195.132';

//Auth
exports.AUTH_VTP = `${API_BASE}/auth/vtp`;
exports.AUTH_VTM = `${API_BASE}/auth/vtman`;

//Conversation
exports.SEND_MESSAGE = (conversation_id) => `${API_BASE}/conversation/${conversation_id}/message`;
exports.CONVERSATION_MESSAGES = (conversation_id) => `${API_BASE}/conversation/${conversation_id}/messages`;
exports.CREATE_CONVERSATION_WITH_VTM = `${API_BASE}/conversation/find-create-with-vtm`;
exports.CONVERSATION_ME = `${API_BASE}/conversation/me`;
exports.CONVERSATION_PIN =  (conversation_id) =>`${API_BASE}/conversation/${conversation_id}/pin`;
exports.CONVERSATION_HIDE =  (conversation_id) =>`${API_BASE}/conversation/${conversation_id}/hide`;

//Space
exports.UPLOAD_FILE = `${API_BASE}/space/upload`;
exports.DOWNLOAD_FILE = `${API_BASE}/space/download`;
