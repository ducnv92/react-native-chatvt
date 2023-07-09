import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Navigation } from 'react-native-navigation';
import {Button, TextInput} from 'react-native-paper'
import Image from 'react-native-fast-image';
import  {chatVT} from 'react-native-chatvt';
import AsyncStorage from '@react-native-community/async-storage';


export const Login =  observer(function Login ( props){

  const [username, setUsername] = React.useState("superadmin");
  const [password, setPassword] = React.useState("viettel@admin");

  const [showSearch, setShowSearch] = useState(false);

  useEffect(()=>{
  }, [])


  const navigationChat = (data) =>{
    Navigation.push(props.componentId, {
      component: {
        name: "ChatScreen",
        passProps: {
          data: data
        },
        options: {
          popGesture: false,
          bottomTabs: {
            visible: false,
          },
          topBar: {
            visible: false,
            height: 0,
          },
        },
      }
    })
  }


  const login = () => {
    chatVT.loginAdmin(props.componentId, AsyncStorage, username, password, ()=>{

    })
  }

  return <SafeAreaView style={{  flex: 1, }} >
    <KeyboardAvoidingView
      style={{flex: 1, paddingHorizontal: 16, justifyContent: 'center'}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button
        onPressOut={login}
        style={{marginTop: 30}}
        mode="contained" onPress={() => {

      }}>
        Login
      </Button>
    </KeyboardAvoidingView>
  </SafeAreaView>;
})

