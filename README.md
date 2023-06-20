# react-native-chatvt

Chat VT SDK

## Installation

```sh
npm install react-native-chatvt
```

## Usage

```js
import VTChat  from 'react-native-chatvt';

```

## Init SDK

```js
import {chatVT}  from 'react-native-chatvt';

chatVT.init(env, lang, appId,  token, tokenSSO, onSuccess?, onError?)

// appId:  "VTMan", "VTPost"
// env: môi trường  "DgV", "UAT", "PRODUCT"
// lang là ngôn ngữ enum('VN', 'EN')
// token, token_sso:  do bên Viettel Posst cung cấp

  ```

## Thư viện phụ thuộc

```js
yarn add @react-native-async-storage/async-storage react-native-gesture-handler react-native-navigation react-native-reanimated
  ```
### Ví dụ
```js
 chatVT.init(
     "DEV",
     "VN",
     "VTPost",
    'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzczOTY0NjgyIiwiU1NPSWQiOiJiODQ1ODM3MC05NmU4LTRiZDAtYTU0Yy1hMzY5NjVkM2M1MWUiLCJVc2VySWQiOjcyMiwiRnJvbVNvdXJjZSI6MywiVG9rZW4iOiI2MzMyMzdFRjI3OUVDMThCNUZFQzEwODg1QzQ2N0IiLCJleHAiOjE3MTY5NjU4NjAsIlBhcnRuZXIiOjB9.Pev9kXnZNVDqWqWLxs7Tn6r1aw5Q848wzgBYCo52HjlZhyVrYKXD6uV2Icijm2k-WXtbR5ho1ZrxlZL4yKMXxA',
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzODFCMzg2OUFGRDlBRTU4NDYwREY0M0VENEZGQkE5NzhFNzg3QTQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJFNEd6aHByOW11V0VZTjlEN1VfN3FYam5oNlEifQ.eyJuYmYiOjE2ODU0Mjk4NTgsImV4cCI6MTY4ODAyMTg1OCwiaXNzIjoiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4iLCJhdWQiOlsiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4vcmVzb3VyY2VzIiwic2UtcHVibGljLWFwaSJdLCJjbGllbnRfaWQiOiJ2dHAud2ViIiwic3ViIjoiYjg0NTgzNzAtOTZlOC00YmQwLWE1NGMtYTM2OTY1ZDNjNTFlIiwiYXV0aF90aW1lIjoxNjg1NDI5ODU4LCJpZHAiOiJsb2NhbCIsImVtYWlsIjoibmd1eWVudGhpY0BnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMzczOTY0NjgyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDM3Mzk2NDY4MiIsImNyZWF0ZWRfZGF0ZSI6IiIsImNvbmZpcm1fcGhvbmUiOiJUcnVlIiwiY29uZmlybV9lbWFpbCI6IlRydWUiLCJ1c2VybmFtZSI6IjAzNzM5NjQ2ODIiLCJwaG9uZSI6IjAzNzM5NjQ2ODIiLCJmdWxsX25hbWUiOiIwMzczOTY0NjgyIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInNlLXB1YmxpYy1hcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.EoQ6SPcrbWc7GbiqC0kFDpqeZib3S5qTduYHKCqM6hGVmWzyVoYc1OIvY-HtVPE26-6A5bPvR0us_GMVVio9VLXDYaEZEK0B5vnmqUNPIvzxPacDzvbszg08VcNeiLNUC_KkcA2Uc5_ciQx-GRvZUQC3eFNCa6HQVHGKKAVVE5QYuM87QBanF-tcPvwnPF5AgExF0fZPVBObR2LdJQO38VCKs5FNjII_OwpVLYs1QrCJBCbeHxLJ-A4XMRwu4cMjJ2SEt447yuV85BiRLmghFLyb6YH5ugMdW0w99aquG4ZBnEBowfCQsZu_RVOU8aJO5xKRwlCsmYgjwOqZzwrGfA',
   ()=>{
     console.log('auth success')
   },
   ()=>{
     console.log('auth error')
   })

```
## Mở màn hình danh sách chat

```js
import {chatVT}  from 'react-native-chatvt';

...

chatVT.toListChat(props.componentId)
```

## Mở màn hình chat chi tiết

```js
import {chatVT}  from 'react-native-chatvt';

...

chatVT.toChat(props.componentId, {
  vtm_user_ids: [
    985979
  ],
  order_number: "1694287621393"
})

// vtm_user_ids: mảng gồm id của bưu tá
// order_number: mã vận đơn
```
## Ví dụ

```js
import {AppChat} from 'react-native-chatvt'

export default function App(props: any) {

  const [auth, setAuth] = useState(false)

  useEffect(() => {
    chatVT.init("VN",
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
                chatVT.toListChat(props.componentId)
              })}
              title={'List chat'}>

            </Button>
            <View style={{height: 16}}/>
            <Button
              onPress={(() => {
                chatVT.toChat(props.componentId, {
                  vtm_user_ids: [
                    985979
                  ],
                  order_number: "1694287621393"
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


## License

MIT

---
