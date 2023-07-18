import * as React from 'react';
import { chatVT, ListChat } from 'react-native-chatvt';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from "react-native-navigation";
// import AsyncStorage2 from "@react-native-async-storage/async-storage";
import {Button, TextInput} from 'react-native-paper'

//App VTPost thay thư viện "@react-native-community/async-storage" bằng "@react-native-async-storage/async-storage"

export default function App(props: any) {
  // const AppId = "VTMan"
  const AppId = 'VTPost';

  const login = (data) => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'Login',
                options: {
                  topBar: {
                    visible: false,
                    height: 0,
                  },
                },
                passProps: {
                  data
                },
              }
            }
          ]
        }
      }
    });

  }

  const VTP = () => {
    login({
      username: '0327497996',
      password: '123456a',
      app: 'VTPost',
    })

  }

  const VTM = () => {
    login({
      username: '0327497996',
      password: 'TN2',
      app: 'VTMan',
    })
  }

  const ADMIN = () => {
    login({
      username: 'superadmin',
      password: 'viettel@admin',
      app: 'Admin',
    })
  }


  return (
    <SafeAreaView style={{  flex: 1, }} >
      <KeyboardAvoidingView
        style={{flex: 1, paddingHorizontal: 16, justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <Button
          style={{marginTop: 30}}
          mode="contained"
          onPress={VTP}>
          VTP
        </Button>
        <Button
          style={{marginTop: 30}}
          mode="contained"
          onPress={VTM}>
          VTM
        </Button>
        <Button
          style={{marginTop: 30}}
          mode="contained"
          onPress={ADMIN}>
          ADMIN ---
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// appcenter codepush release-react -a chatvt/ios -d Production
// appcenter codepush release-react -a chatvt/android -d Production

//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
