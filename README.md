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

chatVT.init(lang, token, token_sso)
  ```
### Example
## Thư viện phụ thuộc

```js
yarn add @react-native-async-storage/async-storage @react-navigation/native react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated@2.17.0 react-native-safe-area-context @react-navigation/stack
  ```
### Example
```js
// lang là ngôn ngữ enum('VN', 'EN')
// token và token_sso  do bên Viettel Posst cung cấp
// Ví dụ
 chatVT.init("VN",
  'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzczOTY0NjgyIiwiU1NPSWQiOiJiODQ1ODM3MC05NmU4LTRiZDAtYTU0Yy1hMzY5NjVkM2M1MWUiLCJVc2VySWQiOjcyMiwiRnJvbVNvdXJjZSI6MywiVG9rZW4iOiI2MzMyMzdFRjI3OUVDMThCNUZFQzEwODg1QzQ2N0IiLCJleHAiOjE3MTY5NjU4NjAsIlBhcnRuZXIiOjB9.Pev9kXnZNVDqWqWLxs7Tn6r1aw5Q848wzgBYCo52HjlZhyVrYKXD6uV2Icijm2k-WXtbR5ho1ZrxlZL4yKMXxA',
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzODFCMzg2OUFGRDlBRTU4NDYwREY0M0VENEZGQkE5NzhFNzg3QTQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJFNEd6aHByOW11V0VZTjlEN1VfN3FYam5oNlEifQ.eyJuYmYiOjE2ODU0Mjk4NTgsImV4cCI6MTY4ODAyMTg1OCwiaXNzIjoiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4iLCJhdWQiOlsiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4vcmVzb3VyY2VzIiwic2UtcHVibGljLWFwaSJdLCJjbGllbnRfaWQiOiJ2dHAud2ViIiwic3ViIjoiYjg0NTgzNzAtOTZlOC00YmQwLWE1NGMtYTM2OTY1ZDNjNTFlIiwiYXV0aF90aW1lIjoxNjg1NDI5ODU4LCJpZHAiOiJsb2NhbCIsImVtYWlsIjoibmd1eWVudGhpY0BnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMzczOTY0NjgyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDM3Mzk2NDY4MiIsImNyZWF0ZWRfZGF0ZSI6IiIsImNvbmZpcm1fcGhvbmUiOiJUcnVlIiwiY29uZmlybV9lbWFpbCI6IlRydWUiLCJ1c2VybmFtZSI6IjAzNzM5NjQ2ODIiLCJwaG9uZSI6IjAzNzM5NjQ2ODIiLCJmdWxsX25hbWUiOiIwMzczOTY0NjgyIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInNlLXB1YmxpYy1hcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.EoQ6SPcrbWc7GbiqC0kFDpqeZib3S5qTduYHKCqM6hGVmWzyVoYc1OIvY-HtVPE26-6A5bPvR0us_GMVVio9VLXDYaEZEK0B5vnmqUNPIvzxPacDzvbszg08VcNeiLNUC_KkcA2Uc5_ciQx-GRvZUQC3eFNCa6HQVHGKKAVVE5QYuM87QBanF-tcPvwnPF5AgExF0fZPVBObR2LdJQO38VCKs5FNjII_OwpVLYs1QrCJBCbeHxLJ-A4XMRwu4cMjJ2SEt447yuV85BiRLmghFLyb6YH5ugMdW0w99aquG4ZBnEBowfCQsZu_RVOU8aJO5xKRwlCsmYgjwOqZzwrGfA'
 )

```
## View

```js
//show màn hình chat

// Không truyền tham số orderChat vào danh sách chat
// Trường hợp truyền tham số orderChat sẽ vào thêm màn hình chi tiết chat tạo từ đơn hàng
//
// orderChat={{ vtm_user_ids: [ 985979], order_number: "1694287621393"}}
//
// props truyền vào object 2 tham số truyền vào là:
// vtm_user_ids: mảng gồm id của bưu tá
// order_number: mã vận đơn


// Ví dụ
import {AppChat} from 'react-native-chatvt'


export default function App() {

  return (
    <NavigationContainer>
      {
        <AppChat
          orderChat={{
            vtm_user_ids: [
              985979
            ],
            order_number: "1694287621393"
          }}
          style={{flex: 1,}}  />
      }
      {
        <AppChat
          style={{flex: 1,}} />
      }
    </NavigationContainer>
  );
}





```


## License

MIT

---
