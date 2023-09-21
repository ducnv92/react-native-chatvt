import React, {useEffect} from 'react'
import {Dimensions, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import stickerStore from "../../screens/chat/StickerStore";
import FastImage from 'react-native-fast-image';

export default function EmojiKeyboard(props) {

  useEffect(()=>{
    stickerStore.getStickers()
  })


  const renderItem = ({item, index}) => {
    console.log('sticker item', item.attachment_id)
    return(
      <TouchableOpacity
        onPress={()=>{
          if(props.onSelected){
            props.onSelected(item)
          }
        }}
        style={{flex: 1, maxWidth: Dimensions.get('window').width/4, paddingVertical: 9, alignItems: 'center', justifyContent: 'center'}}>
        <FastImage source={stickerStore.getStickerImage(item.attachment_id)} style={{width: 68, height: 68, resizeMode: 'contain'}}/>
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
