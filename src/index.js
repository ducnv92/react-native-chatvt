export let API_URL = 'https://stag-apichat.viettelpost.vn\'';
export let SOCKET_URL = 'https://stag-receiverchat.viettelpost.vn';

import { Navigation } from 'react-native-navigation';
import appStore from './screens/AppStore';
// import {ChatStack} from './App.js'
import { ListChatScreen } from './screens/listchat';
import { ChatScreen } from './screens/chat';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import * as MyAsyncStorage from './utils/MyAsyncStorage';
import { USER } from './utils/MyAsyncStorage';
import socket from './socket';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import hoistNonReactStatics from 'hoist-non-react-statics';
import colors from './Styles';
import React from 'react';
import { StatusBar } from 'react-native';
import { AttachsScreen } from './screens/attachs';
import { ViewFileScreen } from './screens/webview';
import BottomSheetChatOptions from './components/bottomSheetChatOptions';
import BottomSheetChatOptionsVTM from './components/bottomSheetChatOptions/VTM';
import listChatStore from './screens/listchat/ListChatStore';
import Socket from './socket';

function safeAreaProviderHOC(Component) {
  function Wrapper(props) {
    return (
      <SafeAreaProvider style={[{ flex: 1 }]}>
        <Component {...props} />
      </SafeAreaProvider>
    );
  }

  Wrapper.displayName = `safeAreaProviderHOC(${
    Component.displayName || Component.name
  })`;

  // @ts-ignore - hoistNonReactStatics uses old version of @types/react
  hoistNonReactStatics(Wrapper, Component);

  return Wrapper;
}

class ChatVT {
  AsyncStorage;

  interval;

  registerScreen() {
    Navigation.registerComponent('ListChatScreen', () =>
      gestureHandlerRootHOC(safeAreaProviderHOC(ListChatScreen)),
    );
    Navigation.registerComponent('ChatScreen', () =>
      gestureHandlerRootHOC(safeAreaProviderHOC(ChatScreen)),
    );
    Navigation.registerComponent('AttachsScreen', () =>
      gestureHandlerRootHOC(safeAreaProviderHOC(AttachsScreen)),
    );
    Navigation.registerComponent('ViewFileScreen', () =>
      gestureHandlerRootHOC(safeAreaProviderHOC(ViewFileScreen)),
    );
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({ componentId, componentName, passProps }) => {
          if (
            componentName === 'navigation.VTMan.MessengerScreen.TK' &&
            listChatStore.data?.length === 0
          ) {
            listChatStore.page = 0;
            listChatStore.getData({});
          }
          StatusBar.setBackgroundColor(colors.primary);
        },
      );
    // screenEventListener.remove();
  }

  /** */
  init(env, storage, lang, appId, token, tokenSSO, onSuccess, onError) {
    this.registerScreen();
    appStore.env = env;
    if (env === 'DEV' || env === 'UAT') {
      API_URL = 'https://stag-apichat.viettelpost.vn';
      SOCKET_URL = 'https://stag-receiverchat.viettelpost.vn';
    } else {
      API_URL = 'https://apichat.viettelpost.vn';
      SOCKET_URL = 'https://receiverchat.viettelpost.vn';
    }

    this.AsyncStorage = storage;
    appStore.appId = appId;
    appStore.changeLanguage(lang);

    appStore.Auth(
      {
        token: token,
        token_sso: tokenSSO,
      },
      (res) => {
        listChatStore.data = [];
        listChatStore.dataPin = [];
        // if(this.interval){
        //   clearInterval(this.interval)
        // }
        // this.interval = setInterval(()=>{
        //   appStore.onlineState()
        // }, 30000)
        if (listChatStore.data?.length === 0) {
          listChatStore.page = 0;
          listChatStore.getData({});
        }

        if (onSuccess) onSuccess(res);
      },
      onError,
    );
  }

  toListChat(componentId) {
    if (componentId) {
      appStore.componentId = componentId;
    }
    Navigation.push(componentId, {
      component: {
        id: 'ListChatScreen',
        name: 'ListChatScreen',
        options: {
          popGesture: false,
          bottomTabs: {
            visible: false,
          },
          topBar: {
            visible: false,
            height: 0,
          },
        },
      },
    });
  }

  toChat(componentId, orderChat, is_receiver) {
    if (componentId) {
      appStore.componentId = componentId;
    }
    if (orderChat) {
      appStore.createConversation(
        {
          vtm_user_ids: orderChat.vtm_user_ids,
          order_number: orderChat.order_number,
          vtp_phone_numbers: orderChat.vtp_phone_numbers,
          is_receiver: is_receiver,
        },
        (conversation) => {
          //Navigation.pop('ChatScreen')
          Navigation.push(componentId, {
            component: {
              id: 'ChatScreen',
              name: 'ChatScreen',
              options: {
                popGesture: false,
                bottomTabs: {
                  visible: false,
                },
                topBar: {
                  visible: false,
                  height: 0,
                },
              },
              passProps: {
                data: conversation,
                order: orderChat?.order,
              },
            },
          });
        },
        (error) => alert(error),
      );
    }
  }

  chatWithReceiver(componentId, order, is_receiver) {
    if (componentId) {
      appStore.componentId = componentId;
    }
    if (order?.ORDER_NUMBER) {
      appStore.createConversationWithReceiver(
        {
          order_number: order?.ORDER_NUMBER,
          is_receiver: is_receiver,
        },
        (conversation) => {
          //Navigation.pop('ChatScreen')
          Navigation.push(componentId, {
            component: {
              id: 'ChatScreen',
              name: 'ChatScreen',
              options: {
                popGesture: false,
                bottomTabs: {
                  visible: false,
                },
                topBar: {
                  visible: false,
                  height: 0,
                },
              },
              passProps: {
                data: conversation,
                order: order,
              },
            },
          });
        },
        (error) => alert(error),
      );
    }
  }

  chatWithCS(componentId, order) {
    if (componentId) {
      appStore.componentId = componentId;
    }
    appStore.createConversationWithCS(
      {
        order_number: order?.ORDER_NUMBER,
      },
      (conversation) => {
        //Navigation.pop('ChatScreen')
        Navigation.push(componentId, {
          component: {
            id: 'ChatScreen',
            name: 'ChatScreen',
            options: {
              popGesture: false,
              bottomTabs: {
                visible: false,
              },
              topBar: {
                visible: false,
                height: 0,
              },
            },
            passProps: {
              data: conversation,
            },
          },
        });
      },
      (error) => alert(error),
    );
  }

  handleNotification(
    env,
    storage,
    lang,
    appId,
    token,
    tokenSSO,
    onSuccess,
    onError,
    componentId,
    conversation_id,
  ) {
    if (!appStore.user.token) {
      this.init(
        env,
        storage,
        lang,
        appId,
        token,
        tokenSSO,
        () => {
          appStore.conversationDetail(
            {
              conversation_id: conversation_id,
            },
            (conversation) => {
              try {
                Navigation.popTo('ListChatScreen');
              } catch (e) {

              }
              setTimeout(() => {
                try {
                  Navigation.push(componentId ? componentId : 'ListChatScreen', {
                    component: {
                      id: 'ChatScreen',
                      name: 'ChatScreen',
                      options: {
                        popGesture: false,
                        bottomTabs: {
                          visible: false,
                        },
                        topBar: {
                          visible: false,
                          height: 0,
                        },
                      },
                      passProps: {
                        data: conversation,
                      },
                    },
                  });
                  

                } catch (e) {
                  
                }

              }, 200);
            },
          );
        },
        onError,
      );
    } else {
      appStore.conversationDetail(
        {
          conversation_id: conversation_id,
        },
        async (conversation) => {
          try {
            Navigation.popTo('ListChatScreen');

          } catch (e) {

          }
          setTimeout(() => {
            Navigation.push(componentId ? componentId : 'ListChatScreen', {
              component: {
                id: 'ChatScreen',
                name: 'ChatScreen',
                options: {
                  popGesture: false,
                  bottomTabs: {
                    visible: false,
                  },
                  topBar: {
                    visible: false,
                    height: 0,
                  },
                },
                passProps: {
                  data: conversation,
                },
              },
            });
          }, 200);
        },
      );
    }
  }

  /** Lang: 'VN' | 'EN' */
  changeLanguage(lang) {
    appStore.changeLanguage(lang);
  }

  loginAdmin(componentId, storage, username, password, onSuccess, onError) {
    if (componentId) {
      appStore.componentId = componentId;
    }
    this.registerScreen();

    appStore.loginAdmin({ username, password }, async (data) => {
      this.AsyncStorage = storage;
      appStore.appId = 'Admin';
      appStore.env = 'DEV';
      appStore.changeLanguage('VI');
      await MyAsyncStorage.save(USER, data);
      await Socket.getInstance().init();

      Navigation.push(componentId, {
        component: {
          id: 'ListChatScreen',
          name: 'ListChatScreen',
          options: {
            popGesture: false,
            bottomTabs: {
              visible: false,
            },
            topBar: {
              visible: false,
              height: 0,
            },
          },
        },
      });
    });
  }

  loginVTP(componentId, storage, username, password, onSuccess, onError) {
    Navigation.registerComponent('ListChatScreen', () =>
      gestureHandlerRootHOC(ListChatScreen),
    );
    Navigation.registerComponent('ChatScreen', () =>
      gestureHandlerRootHOC(ChatScreen),
    );

    appStore.loginVTP({ username, password }, async (data) => {
      this.init(
        'DEV',
        storage,
        'VN',
        'VTPost',
        data.TokenKey,
        data.TokenSSO,
        onSuccess,
      );
    });
  }

  loginVTM(componentId, storage, username, password, onSuccess, onError) {
    this.registerScreen();
    appStore.loginVTM(
      { phone: username, ma_buucuc: password },
      async (data) => {
        this.init('DEV', storage, 'VN', 'VTMan', data.token, '', onSuccess);
      },
    );
  }

  vtpWithCS(componentId, order_number) {
    appStore.vtpWithCS({ order_number }, async (data) => {
      //Navigation.pop('ChatScreen')
      Navigation.push(componentId, {
        component: {
          id: 'ChatScreen',
          name: 'ChatScreen',
          options: {
            popGesture: false,
            bottomTabs: {
              visible: false,
            },
            topBar: {
              visible: false,
              height: 0,
            },
          },
          passProps: {
            data: data,
          },
        },
      });
    });
  }

  vtmWithCS(componentId, order_number) {
    appStore.vtmWithCS({ order_number }, async (data) => {
      //Navigation.pop('ChatScreen')
      Navigation.push(componentId, {
        component: {
          id: 'ChatScreen',
          name: 'ChatScreen',
          options: {
            popGesture: false,
            bottomTabs: {
              visible: false,
            },
            topBar: {
              visible: false,
              height: 0,
            },
          },
          passProps: {
            data: data,
          },
        },
      });
    });
  }

  toChatWithCustomer = async (componentId, order_code, type,order) => {
    appStore.createConversation(
      {
        order_number: order_code,
        chat_type: type,
      },
      (conversation) => {
        //Navigation.pop('ChatScreen')
        Navigation.push(componentId, {
          component: {
            id: 'ChatScreen',
            name: 'ChatScreen',
            options: {
              popGesture: false,
              bottomTabs: {
                visible: false,
              },
              topBar: {
                visible: false,
                height: 0,
              },
            },
            passProps: {
              data: conversation,
              order: order,
            },
          },
        });
      },
      (error) => alert(error),
    );
  };
}

export const chatVT = new ChatVT();
export const ListChat = ListChatScreen;
export const BottomSheetChat = BottomSheetChatOptions;
export const BottomSheetChatVTM = BottomSheetChatOptionsVTM;
