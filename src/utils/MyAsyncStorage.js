import {chatVT} from "../index";

export const TOKEN = 'TOKEN';
export const USER = 'USER';
export const LANG = 'LANG';

export async function load(key) {
  let user = await chatVT.AsyncStorage.getItem(key);
  if (user !== undefined && user !== null) {
    return JSON.parse(user);
  } else {
    return null;
  }
}

export async function save(key, data)  {
  await chatVT.AsyncStorage.setItem(key, JSON.stringify(data));
}

export function clearAll() {
  chatVT.AsyncStorage.clear();
}
