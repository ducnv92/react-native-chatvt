import * as React from 'react';
import {AppChat, chatVT} from 'react-native-chatvt'
import {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";


export default function App() {


  useEffect(()=>{
    chatVT.init("VN",
      'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzI3NDk3OTk2IiwiU1NPSWQiOiJkZmMxYmFjYy1jNjE4LTRkNDctOTBhZS1jZDRmMTMzMDNmM2MiLCJVc2VySWQiOjcyNDEyOTgsIkZyb21Tb3VyY2UiOjMsIlRva2VuIjoiNEU2QzAyRUVGODU4MkYxNDMwMkU1Q0NBMEM1MjEzMDkiLCJleHAiOjE3MTg1MjY2NDEsIlBhcnRuZXIiOjY5MzU5MzF9.4hvyYpPN6ABdGXi0Imjoqi18Luxo9xokg7GFPT_iczfqSEQ-VXzG-KCjL__SB5O77ZU1SohGEOvxbMpgXEQoMA',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzODFCMzg2OUFGRDlBRTU4NDYwREY0M0VENEZGQkE5NzhFNzg3QTQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJFNEd6aHByOW11V0VZTjlEN1VfN3FYam5oNlEifQ.eyJuYmYiOjE2ODY5OTA2MzcsImV4cCI6MTY4OTU4MjYzNywiaXNzIjoiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4iLCJhdWQiOlsiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4vcmVzb3VyY2VzIiwic2UtcHVibGljLWFwaSJdLCJjbGllbnRfaWQiOiJ2dHAud2ViIiwic3ViIjoiZGZjMWJhY2MtYzYxOC00ZDQ3LTkwYWUtY2Q0ZjEzMzAzZjNjIiwiYXV0aF90aW1lIjoxNjg2OTkwNjM3LCJpZHAiOiJsb2NhbCIsImVtYWlsIjoiNzI0MTI5OEBnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMzI3NDk3OTk2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiNzI0MTI5OEBnbWFpbC5jb20iLCJjcmVhdGVkX2RhdGUiOiIyNi8wNy8yMDIyIDE2OjA4OjQzIiwiY29uZmlybV9waG9uZSI6IlRydWUiLCJjb25maXJtX2VtYWlsIjoiVHJ1ZSIsImZ1bGxfbmFtZSI6Ikhvw6BuZyBMaW5rIHRpbmt5eSIsInBob25lIjoiMDMyNzQ5Nzk5NiIsInVzZXJuYW1lIjoiNzI0MTI5OEBnbWFpbC5jb20iLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwic2UtcHVibGljLWFwaSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.y23RaKyA3JIdU4Oq4fsbWeD-BGG0zz4n4FbmNT7GCEXybi9YmZ7khInAygovKrbPvWncAjM7qfyIfzuzvJ24ZZmMJWpex9vONwPywE_4yMdcx6xckI7VOLNZPqCpu9-TGj03cj8srzeqI7Y_hKTezhOcLD0RWxIsRkJwcyg6a3b9s5uesW2CmBHYSxO2hbB5X2FQRlEjABje2keNxqwj5R7kZX13C6J_0JvdV9DPtE_aSHkM5kW3M5elOQq6Z7E48xHHQF3gM1y5AWuPquBeg_AO05sfBRxUlzMjYdHTjn0isZ7BPJlCQXMaUP_kFYRQmjkkEZpx5dFdgVZK8FaO2Q'
    )


  })

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

