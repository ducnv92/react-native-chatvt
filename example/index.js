import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Navigation } from "react-native-navigation";
import CodePush from 'react-native-code-push'
import { NativeModules } from 'react-native';


// CodePush.checkForUpdate("RkkpN6qkfZzrY3QpR0680jXbLFReG287W8rpO").then((update) => {
//   console.log(update);
// });

// Navigation.registerComponent(appName, () => App);


import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { Login } from './src/login';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

Navigation.registerComponent("App",  ()=>CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  updateDialog: false,
  installMode: CodePush.InstallMode.IMMEDIATE,
})(Main))
Navigation.registerComponent("Login",  ()=>Login)



if(NativeModules.RNDeviceInfo.bundleId === 'com.chatvtexample.admin' ) {
  Navigation.events().registerAppLaunchedListener(() => {
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
                }
              }
            }
          ]
        }
      }
    });
  });
}else{
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'App',

              }
            }
          ]
        }
      }
    })
  });
}

LogBox.ignoreAllLogs(true);
