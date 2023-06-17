import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN = 'TOKEN';
export const USER = 'USER';
export const LANG = 'LANG';

export async function load(key) {
  let user = await AsyncStorage.getItem(key);
  if (user !== undefined && user !== null) {
    return JSON.parse(user);
  } else {
    return null;
  }
}

export function save(key, data) {
  AsyncStorage.setItem(key, JSON.stringify(data));
}

export function clearAll() {
  AsyncStorage.clear();
}
