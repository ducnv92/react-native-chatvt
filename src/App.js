import React, {useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ListChatScreen } from './screens/listchat';
import { ChatScreen } from './screens/chat';
import {NavigationContainer} from "@react-navigation/native";
import appStore from "./screens/AppStore";

const Stack = createStackNavigator();

export const ChatStack = (props) =>{
  useEffect(()=>{
    if(props.orderChat){
      appStore.createConversation(props.orderChat, (conversation)=>{
        appStore.navigation.push('ChatScreen', conversation)
      }, error=>alert(error) )
    }
  }, [])
  return (
    <NavigationContainer
      independent={true}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="ListChatScreen"
          component={ListChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
