import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Navigation } from "react-native-navigation";
import CodePush from 'react-native-code-push'

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME
}


// Navigation.registerComponent(appName, () => App);

Navigation.registerComponent("App",  ()=>CodePush(codePushOptions)(App))


Navigation.events().registerAppLaunchedListener(() => {
     Navigation.setRoot({
         root: {
           stack: {
               children: [
                   {
                     component: {
                       name: 'App'
                     }
                 }
               ]
             }
         }
    });
  });
LogBox.ignoreAllLogs(true);
