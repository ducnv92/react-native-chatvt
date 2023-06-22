import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Navigation } from "react-native-navigation";



// Navigation.registerComponent(appName, () => App);

Navigation.registerComponent("App",  ()=>App)


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
LogBox.ignoreLogs(['[MobX]', 'Remote', 'Each', 'new Native']);
