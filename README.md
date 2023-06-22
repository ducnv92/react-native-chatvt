# react-native-chatvt

Chat VT SDK

## Installation

```sh
npm install react-native-chatvt
```


## VTPost

```js
import {chatVT}  from 'react-native-chatvt';
import AsyncStorage from "@react-native-async-storage/async-storage";

chatVT.init(env, AsyncStorage, lang, appId,  token, tokenSSO, onSuccess?, onError?)

// appId:  "VTMan", "VTPost"
// env: môi trường  "DEV", "UAT", "PRODUCT"
// lang là ngôn ngữ enum('VN', 'EN')
// token, token_sso:  do bên Viettel Posst cung cấp

  ```

## Ví dụ VTPost

```js
import {chatVT}  from 'react-native-chatvt';
import AsyncStorage from "@react-native-community/async-storage";

chatVT.init(env, AsyncStorage, lang, appId,  token, tokenSSO, onSuccess?, onError?)

// appId:  "VTMan", "VTPost"
// env: môi trường  "DEV", "UAT", "PRODUCT"
// lang là ngôn ngữ enum('VN', 'EN')
// token, token_sso:  do bên Viettel Posst cung cấp

  ```

### Ví dụ VTPost
```js
import {chatVT}  from 'react-native-chatvt';
import AsyncStorage from "@react-native-async-storage/async-storage";//<- chú ý thư viện 2 app khác nhau

export default function App(props: any) {
  const AppId = "VTPost"

  const [auth, setAuth] = useState(false)

  useEffect(() => {
    chatVT.init(
      "DEV",
      AsyncStorage,
      "VN",
      AppId,
      'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzI3NDk3OTk2IiwiU1NPSWQiOiJkZmMxYmFjYy1jNjE4LTRkNDctOTBhZS1jZDRmMTMzMDNmM2MiLCJVc2VySWQiOjcyNDEyOTgsIkZyb21Tb3VyY2UiOjMsIlRva2VuIjoiNEU2QzAyRUVGODU4MkYxNDMwMkU1Q0NBMEM1MjEzMDkiLCJleHAiOjE3MTg1MjY2NDEsIlBhcnRuZXIiOjY5MzU5MzF9.4hvyYpPN6ABdGXi0Imjoqi18Luxo9xokg7GFPT_iczfqSEQ-VXzG-KCjL__SB5O77ZU1SohGEOvxbMpgXEQoMA',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzODFCMzg2OUFGRDlBRTU4NDYwREY0M0VENEZGQkE5NzhFNzg3QTQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJFNEd6aHByOW11V0VZTjlEN1VfN3FYam5oNlEifQ.eyJuYmYiOjE2ODY5OTA2MzcsImV4cCI6MTY4OTU4MjYzNywiaXNzIjoiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4iLCJhdWQiOlsiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4vcmVzb3VyY2VzIiwic2UtcHVibGljLWFwaSJdLCJjbGllbnRfaWQiOiJ2dHAud2ViIiwic3ViIjoiZGZjMWJhY2MtYzYxOC00ZDQ3LTkwYWUtY2Q0ZjEzMzAzZjNjIiwiYXV0aF90aW1lIjoxNjg2OTkwNjM3LCJpZHAiOiJsb2NhbCIsImVtYWlsIjoiNzI0MTI5OEBnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMzI3NDk3OTk2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiNzI0MTI5OEBnbWFpbC5jb20iLCJjcmVhdGVkX2RhdGUiOiIyNi8wNy8yMDIyIDE2OjA4OjQzIiwiY29uZmlybV9waG9uZSI6IlRydWUiLCJjb25maXJtX2VtYWlsIjoiVHJ1ZSIsImZ1bGxfbmFtZSI6Ikhvw6BuZyBMaW5rIHRpbmt5eSIsInBob25lIjoiMDMyNzQ5Nzk5NiIsInVzZXJuYW1lIjoiNzI0MTI5OEBnbWFpbC5jb20iLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwic2UtcHVibGljLWFwaSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.y23RaKyA3JIdU4Oq4fsbWeD-BGG0zz4n4FbmNT7GCEXybi9YmZ7khInAygovKrbPvWncAjM7qfyIfzuzvJ24ZZmMJWpex9vONwPywE_4yMdcx6xckI7VOLNZPqCpu9-TGj03cj8srzeqI7Y_hKTezhOcLD0RWxIsRkJwcyg6a3b9s5uesW2CmBHYSxO2hbB5X2FQRlEjABje2keNxqwj5R7kZX13C6J_0JvdV9DPtE_aSHkM5kW3M5elOQq6Z7E48xHHQF3gM1y5AWuPquBeg_AO05sfBRxUlzMjYdHTjn0isZ7BPJlCQXMaUP_kFYRQmjkkEZpx5dFdgVZK8FaO2Q'
      , () => {
        setAuth(true)
      })

  })

  return (<>
      {
        auth?
          <SafeAreaView style={{padding: 16}}>
            <Button
              onPress={(() => {
                /** Mở màn hình danh sách chat */
                chatVT.toListChat(props.componentId)
              })}
              title={'List chat'}>

            </Button>
            <View style={{height: 16}}/>
            <Button
              onPress={(() => {
                chatVT.toChat(props.componentId, {
                  /** vtm_user_ids: mảng gồm id của bưu tá */
                  /** order_number: mã vận đơn */
                  vtm_user_ids: [
                    985979
                  ],
                  order_number: '1694287621393'
                })
              })}
              title={'Chat Detail'}>

            </Button>
          </SafeAreaView>
          :
          <Text> Đang xác thực tài khoản</Text>
      }
    </>
  )
}

```

## Ví dụ VTMan

```js
import {chatVT}  from 'react-native-chatvt';
import AsyncStorage from "@react-native-community/async-storage"; //<- chú ý thư viện 2 app khác nhau

export default function App(props: any) {
  const AppId = "VTMan"

  const [auth, setAuth] = useState(false)

  useEffect(() => {
    chatVT.init(
      "DEV",
      AsyncStorage,
      "VN",
      AppId,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI5ODU5NzkiLCJ1c2VybmFtZSI6Im5ndW9udGVzdDEiLCJtYV9idXVjdWMiOiJUTjIiLCJuYW1lIjoiVGVzdCAxIiwicGhvbmUiOiI4NDM4ODAyMjA3MSIsImRvbl92aSI6IlRDVCIsIm1hX2NodWNkYW5oIjoiVlRCMDA5IiwiaXNzIjoiLTEwIiwiZW1wbG95ZWVfZ3JvdXBfaWQiOiI0Iiwic291cmNlIjoiLTEwIiwic291cmNlMiI6IiIsInRva2VuIjoiZWE4MGY3MmMtYmNmYy00OGRmLTk1NWMtMTM1ZmY2NDgzMWU1IiwidG9rZW4yIjoiIiwiY2FwX2J1dWN1YyI6IjUwIiwibG9ja19kdCI6IjAiLCJtYW5oYW52aWVuIjoiSTI3MDQxNzIyIiwiY2hpX25oYW5oIjoiVENUIiwidnVuZyI6IjEyIiwiZXhwIjoiMTY4ODAzOTM5MDk4MSIsImRuX3VzZXJpZCI6IjMxNjgyIn0.BW7UAD8ecYVDywNhRjIAhXSy5pGqcfWvtf19EeNkJnE',
      ''
      , () => {
        setAuth(true)
      })


  })

  return (<>
      {
        auth?
          <ListChat {...props} buttonBack={false}/>
          :
          <Text> Đang xác thực tài khoản</Text>
      }
    </>
  )
}


```


## License

MIT

---
