import React, {useEffect} from 'react'
import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import stickerStore from "../../screens/chat/StickerStore";


export default function EmojiKeyboard(props) {

  useEffect(()=>{
    stickerStore.getStickers()
  })


  const renderItem = ({item, index}) => {
    return(
      <TouchableOpacity
        onPress={()=>{
          if(props.onSelected){
            props.onSelected(item)
          }
        }}
        style={{flex: 1, paddingVertical: 9, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={{uri: item.attachment.url}} style={{width: 68, height: 68, resizeMode: 'contain'}}/>
      </TouchableOpacity>
    )
  }

  const renderCategory = ({item, index}) => {
    return (
      <FlatList
        removeClippedSubviews={true}
        data={item.stickers}
        numColumns={4}
        keyExtractor={(item, index)=>index+''}
        renderItem={renderItem}
      />
    )
  }

  return(
    <FlatList
      style={{maxHeight: 300, backgroundColor: 'white'}}
      removeClippedSubviews={true}
      data={stickerStore.data}
      keyExtractor={(item, index)=>index+''}
      renderItem={renderCategory}
    />
  )
}
