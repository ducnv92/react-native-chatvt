import React, { useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetFlatList, BottomSheetModal} from '../../components/bottomSheet/bottom-sheet';
import { NimblePicker, NimbleEmoji, Picker } from 'emoji-mart-native'
import data from 'emoji-mart-native/data/google.json'
import chatStore from './ChatStore';
import EmojiPicker, { EmojiKeyboard } from 'rn-emoji-keyboard';

export default function EmojiButton() {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef();
  const [showModal, setShowModal] = useState(false)

  useEffect(()=>{

    return()=>{
      setShowModal(false)
    }
  }, [])

  return(
    <>
      <TouchableOpacity
        onPress={()=>{
          setShowModal(true)
        }}
        style={{width: 40, height: 56, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={require('../../assets/ic_emoj.png')} style={{height: 24, width: 24, resizeMode:"contain"}}/>
      </TouchableOpacity>

    </>
  )
}
