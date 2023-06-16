import * as React from 'react';
// import {ListChatScreen}  from 'react-native-chatvt/src/screens/listchat';
// import {ChatScreen}  from 'react-native-chatvt/src/screens/chat';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
const Stack = createStackNavigator();
import HomeScreen from '../src/Home'

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        {/*<Stack.Screen*/}
        {/*  name="ListChatScreen"*/}
        {/*  component={ListChatScreen}*/}
        {/*  options={{ headerShown: false }}*/}
        {/*/>*/}
        {/*<Stack.Screen*/}
        {/*  name="ChatScreen"*/}
        {/*  component={ChatScreen}*/}
        {/*  options={{ headerShown: false }}*/}
        {/*/>*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

