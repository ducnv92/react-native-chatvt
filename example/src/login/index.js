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

  const [username, setUsername] = useState(props.data?.username);
  const [password, setPassword] = useState(props.data?.password);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(()=>{

  }, [])

  const toListChat = (data) => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'ListChatScreen',
                options: {
                  topBar: {
                    visible: false,
                    height: 0,
                  },
                }
              }
            }
          ]
        }
      }
    });

  }

  const login = () => {
    if (props.data.app === 'VTPost') {
      chatVT.loginVTP(props.componentId, AsyncStorage, username, password, ()=>{
        toListChat()
      })
    }else  if (props.data.app === 'VTMan') {
      chatVT.loginVTM(props.componentId, AsyncStorage, username, password, ()=>{
        toListChat()
      })
    }else  if (props.data.app === 'Admin') {
      chatVT.loginAdmin(props.componentId, AsyncStorage, username, password, ()=>{
        toListChat()
      })
    }


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

