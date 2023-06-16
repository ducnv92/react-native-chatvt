import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import appStore from '../AppStore';
import chatStore from "../chat/ChatStore";

export function HomeScreen({ navigation }) {
  useEffect(() => {
    appStore.Auth({
      token:
        'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzczOTY0NjgyIiwiU1NPSWQiOiJiODQ1ODM3MC05NmU4LTRiZDAtYTU0Yy1hMzY5NjVkM2M1MWUiLCJVc2VySWQiOjcyMiwiRnJvbVNvdXJjZSI6MywiVG9rZW4iOiI2MzMyMzdFRjI3OUVDMThCNUZFQzEwODg1QzQ2N0IiLCJleHAiOjE3MTY5NjU4NjAsIlBhcnRuZXIiOjB9.Pev9kXnZNVDqWqWLxs7Tn6r1aw5Q848wzgBYCo52HjlZhyVrYKXD6uV2Icijm2k-WXtbR5ho1ZrxlZL4yKMXxA',
      token_sso:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzODFCMzg2OUFGRDlBRTU4NDYwREY0M0VENEZGQkE5NzhFNzg3QTQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJFNEd6aHByOW11V0VZTjlEN1VfN3FYam5oNlEifQ.eyJuYmYiOjE2ODU0Mjk4NTgsImV4cCI6MTY4ODAyMTg1OCwiaXNzIjoiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4iLCJhdWQiOlsiaHR0cHM6Ly9jcG5zc28udmlldHRlbHBvc3Qudm4vcmVzb3VyY2VzIiwic2UtcHVibGljLWFwaSJdLCJjbGllbnRfaWQiOiJ2dHAud2ViIiwic3ViIjoiYjg0NTgzNzAtOTZlOC00YmQwLWE1NGMtYTM2OTY1ZDNjNTFlIiwiYXV0aF90aW1lIjoxNjg1NDI5ODU4LCJpZHAiOiJsb2NhbCIsImVtYWlsIjoibmd1eWVudGhpY0BnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMzczOTY0NjgyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDM3Mzk2NDY4MiIsImNyZWF0ZWRfZGF0ZSI6IiIsImNvbmZpcm1fcGhvbmUiOiJUcnVlIiwiY29uZmlybV9lbWFpbCI6IlRydWUiLCJ1c2VybmFtZSI6IjAzNzM5NjQ2ODIiLCJwaG9uZSI6IjAzNzM5NjQ2ODIiLCJmdWxsX25hbWUiOiIwMzczOTY0NjgyIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInNlLXB1YmxpYy1hcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.EoQ6SPcrbWc7GbiqC0kFDpqeZib3S5qTduYHKCqM6hGVmWzyVoYc1OIvY-HtVPE26-6A5bPvR0us_GMVVio9VLXDYaEZEK0B5vnmqUNPIvzxPacDzvbszg08VcNeiLNUC_KkcA2Uc5_ciQx-GRvZUQC3eFNCa6HQVHGKKAVVE5QYuM87QBanF-tcPvwnPF5AgExF0fZPVBObR2LdJQO38VCKs5FNjII_OwpVLYs1QrCJBCbeHxLJ-A4XMRwu4cMjJ2SEt447yuV85BiRLmghFLyb6YH5ugMdW0w99aquG4ZBnEBowfCQsZu_RVOU8aJO5xKRwlCsmYgjwOqZzwrGfA',
    });
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'orange',
          padding: 10,
          marginTop: 40,
        }}
        onPress={() => {

          navigation.navigate('ListChat', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      >
        <Text>Danh sách chat</Text>
      </TouchableOpacity><TouchableOpacity
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'orange',
          padding: 10,
          marginTop: 40,
        }}
        onPress={() => {

          appStore.createConversation({
            "vtm_user_ids": [
              985979
            ],
            "order_number": "1715479616606"
          }, conversation=>{
            navigation.push('ChatScreen',conversation)
          })
        }}
      >
        <Text>Tạo chat từ đơn</Text>
      </TouchableOpacity>
    </View>
  );
}
