import appStore from "../screens/AppStore";
import {check, PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';
import {Dimensions, Linking} from "react-native";
import moment from "moment";
import RNFS from "react-native-fs";
import FileViewer from "../components/viewFile";
import { Platform } from "react-native";
import uuid from "react-native-uuid";

export const orderStatus = (status) => {
  switch (status) {
    case -100 : return 'Đơn hàng mới tạo, chưa duyệt'
    case -108 : return 'Đơn hàng gửi tại bưu cục'
    case -109 : return 'Đơn hàng đã gửi tại điểm thu gom'
    case -110 : return 'Đơn hàng đang bàn giao qua bưu cục'
    case   100: return 'Tiếp nhận đơn hàng từ đối tác "Viettelpost xử lý đơn hàng"'
    case   101: return 'ViettelPost yêu cầu hủy đơn hàng'
    case   102: return 'Đơn hàng chờ xử lý'
    case   103: return 'Giao cho bưu cục "Viettelpost xử lý đơn hàng"'
    case   104: return 'Giao cho Bưu tá đi nhận'
    case   105: return 'Buu Tá đã nhận hàng'
    case   106: return 'Đối tác yêu cầu lấy lại hàng'
    case   107: return 'Đối tác yêu cầu hủy qua API'
    case   200: return 'Nhận từ bưu tá - Bưu cục gốc'
    case   201: return 'Hủy nhập phiếu gửi'
    case   202: return 'Sửa phiếu gửi'
    case   300: return 'Đóng tải'
    case   310: return 'Đóng bảng kê'
    case   320: return 'Bàn giao'
    case   400: return 'Nhận bảng kê đến "Nhận tại"'
    case   401: return 'Nhận Túi gói "Nhận tại"'
    case   402: return 'Nhận chuyến thư "Nhận tại"'
    case   403: return 'Nhận chuyến xe "Nhận tại"'
    case   500: return 'Giao bưu tá đi phát'
    case   501: return 'Thành công - Phát thành công'
    case   502: return 'Chuyển hoàn bưu cục gốc'
    case   503: return 'Hủy - Theo yêu cầu khách hàng'
    case   504: return 'Thành công - Chuyển trả người gửi'
    case   505: return 'Tồn - Thông báo chuyển hoàn bưu cục gốc'
    case   507: return 'Tồn - Khách hàng đến bưu cục nhận'
    case   508: return 'Phát tiếp'
    case   509: return 'Chuyển tiếp bưu cục khác'
    case   510: return 'Hủy phân công phát'
    case   515: return 'Bưu cục phát duyệt hoàn'
    case   550: return 'Đơn Vị Yêu Cầu Phát Tiếp'
    case   551: return "Chuyển hoàn bưu cục gốc"
    default:  return ''
  }
}


export const Log = (data, data2) => {
  if (appStore.env === "DEV") {
      
  }
}
export function groupBy(list, keyGetter) {
  const map = new Map();
  try {
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
  }catch (e) {

  }

  return map;
}

export async function requestPermission(permissions, callback) {
  try{
    const result =  await requestMultiple(permissions)

    let grantedAll = true
    permissions.map(p=>{
      if(result[p] !== RESULTS.GRANTED){
        grantedAll = false
      }
    })
    if(grantedAll){
      callback()
    }else{
      this.requestPermission(permissions, callback)
    }
    // switch (result) {
    //   case RESULTS.UNAVAILABLE:
    //
    //     break;
    //   case RESULTS.DENIED:
    //
    //     break;
    //   case RESULTS.LIMITED:
    //
    //     break;
    //   case RESULTS.GRANTED:
    //     callback()
    //     break;
    //   case RESULTS.BLOCKED:
    //
    //     break;
    // }
  }catch (e) {
    alert(e)

  }


}

const baseWidth_vtp = 375;
const baseHeight_vtp = 667;

const { height, width } = Dimensions.get('window');

export const scale = size => {
  // if(appStore.appId==='VTMan'){
  //   return width / baseWidth_vtp * size
  // }else{
  //   return size
  // }
  return size
};

export const formatTimeLastMessage = (timeString, isList) => {
  const time = moment(timeString)
  if(moment().endOf('day').diff(time, 'years')>0){
    return time.format("DD/MM/YYYY")
  }
  if(moment().endOf('day').diff(time, 'days')>0){
    return time.format("DD/MM")
  }
  if(!isList){
    if(moment().diff(time, 'seconds')<60 ){
      return moment().diff(time, 'seconds')+' giây trước'
    }
    if(moment().diff(time, 'minutes')<60 ){
      return moment().diff(time, 'minutes')+' phút trước'
    }
  }
  return time.format("HH:mm")
};

export const formatDuration = duration =>{
  if(!duration){
    return '00:00'
  }
  const secs = Math.floor(duration)
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;

  return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
}

export const participantType = (participant_type) => {
  switch (participant_type){
    case 'POSTMAN_RECEIVER':
      return 'Bưu tá nhận'
    case 'POSTMAN_SENDER':
      return 'Bưu tá giao'
    case 'SHOP_SENDER':
      return 'Người gửi'
    case 'USER_RECEIVER':
      return 'Người nhận'
    case 'ADMIN':
      return 'Admin'
  }
}

function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

export const DownloadViewFile = (url) =>{

  try{
    const extension = getUrlExtension(url);

// Feel free to change main path according to your requirements.
    const localFile = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}.${extension}`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        // success
      })
      .catch((error) => {
        Linking.openURL(url)
        
        // error
      });

  }catch (e) {
    Linking.openURL(url)
    
  }

}
export const timeSince = (date)=> {
  
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " năm trước";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " tháng trước";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " ngày trước";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ trước";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút trước";
  }
  return Math.floor(seconds) + " giây trước";
}
