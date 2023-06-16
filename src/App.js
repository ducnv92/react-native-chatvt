import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ListChatScreen } from './screens/listchat';
import { ChatScreen } from './screens/chat';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/*<Stack.Screen*/}
        {/*  name="Home"*/}
        {/*  component={HomeScreen}*/}
        {/*  options={{ headerShown: false }}*/}
        {/*/>*/}
        <Stack.Screen
          name="ListChat"
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
