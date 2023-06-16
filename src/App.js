import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ListChatScreen } from './screens/listchat';
import { ChatScreen } from './screens/chat';
import {NavigationContainer} from "@react-navigation/native";

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/*<Stack.Screen*/}
        {/*  name="Home"*/}
        {/*  component={HomeScreen}*/}
        {/*  options={{ headerShown: false }}*/}
        {/*/>*/}
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
