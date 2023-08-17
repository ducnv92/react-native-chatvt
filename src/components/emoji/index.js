import React from 'react'
import {FlatList, Text, TouchableOpacity, View} from "react-native";
const data = require('./emoji.json')

export default function EmojiKeyboard(props) {

  const renderItem = ({item, index}) => {
    return(
      <TouchableOpacity
        onPress={()=>{
          if(props.onSelected){
            props.onSelected(item.emoji)
          }
        }}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 56}}>
        <Text style={{textAlign: 'center', fontSize : 20, color: 'black'}}>{item.char}</Text>
      </TouchableOpacity>
    )
  }

  return(
    <FlatList style={{maxHeight: 300, backgroundColor: 'white'}}
              removeClippedSubviews={true}
              data={data} keyExtractor={(item, index)=>item.codes+''} renderItem={renderItem} numColumns={9}/>
  )
}
