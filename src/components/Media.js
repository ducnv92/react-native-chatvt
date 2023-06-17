import React, {useEffect} from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import { CameraRoll, useCameraRoll } from "@react-native-camera-roll/camera-roll";
import {Button} from "react-native";
import FastImage from "react-native-fast-image";

export function Media() {

  const [photos, getPhotos, save] = useCameraRoll();

  async function hasAndroidPermission() {
    const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  useEffect(()=>{
    const fetchData = async () => {
      const hasPermission = await hasAndroidPermission();
      console.log('hasAndroidPermission', hasPermission)
      await getPhotos()
      console.log('photos', photos)
    }

    // call the function
    fetchData().then(r => {})
  }, [])

  return(
    <View>
      <Button title='Get Photos' onPress={() => getPhotos()}>Get Photos</Button>
      {
        photos.edges.map((photo, index) =><FastImage source={{uri: photo.uri}} style={{width: '32%', height: 'auto'}}/>)
      }
    </View>
  )

}
