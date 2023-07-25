import appStore from "../screens/AppStore";
import {check, PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';
import {Dimensions} from "react-native";
import moment from "moment";

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
    default:  return ''
  }
}


export const Log = (data, data2) => {
  if (appStore.env === "DEV") {
      console.log(data, data2)
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
      requestPermission(permissions, callback)
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
  if(appStore.appId==='VTMan'){
    return width / baseWidth_vtp * size
  }else{
    return size
  }
};

export const formatTimeLastMessage = timeString => {
  const time = moment(timeString)
  if(moment().endOf('day').diff(time, 'years')>0){
    return time.format("DD/MM/YYYY")
  }
  if(moment().endOf('day').diff(time, 'days')>0){
    return time.format("DD/MM")
  }
  return time.format("HH:mm")
};
