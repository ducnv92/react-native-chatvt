import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Navigation } from "react-native-navigation";
import CodePush from 'react-native-code-push'

// CodePush.checkForUpdate("RkkpN6qkfZzrY3QpR0680jXbLFReG287W8rpO").then((update) => {
//   console.log(update);
// });

// Navigation.registerComponent(appName, () => App);

Navigation.registerComponent("App",  ()=>CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  updateDialog: false,
  installMode: CodePush.InstallMode.IMMEDIATE,
})(App))


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
