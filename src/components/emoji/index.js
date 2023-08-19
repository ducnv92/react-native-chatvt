import React from 'react'
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import SVGComponent01 from "../../assets/stickers/01";
import SVGComponent02 from "../../assets/stickers/02";
import SVGComponent03 from "../../assets/stickers/03";
import SVGComponent04 from "../../assets/stickers/04";
import SVGComponent05 from "../../assets/stickers/05";
import SVGComponent06 from "../../assets/stickers/06";
import SVGComponent07 from "../../assets/stickers/07";
import SVGComponent08 from "../../assets/stickers/08";
import SVGComponent09 from "../../assets/stickers/09";
import SVGComponent010 from "../../assets/stickers/010";
import SVGComponent011 from "../../assets/stickers/011";
import SVGComponent012 from "../../assets/stickers/012";
import Svg, { Path, G } from "react-native-svg";
const data = [
  {
    id: '(01)',
  },
  {
    id: '(02)',
  },
  {
    id: '(03)',
  },
  {
    id: '(04)',
  },
  {
    id: '(05)',
  },
  {
    id: '(06)',
  },
  {
    id: '(07)',
  },
  {
    id: '(08)',
  },
  {
    id: '(09)',
  },
  {
    id: '(010)',
  },
  {
    id: '(011)',
  },
  {
    id: '(012)',
  },
]

export default function EmojiKeyboard(props) {

  const getSticker = (id) => {
    switch (id){
      case '(01)':
        return SVGComponent01()
      case '(02)':
        return SVGComponent02()
      case '(03)':
        return SVGComponent03()
      case '(04)':
        return SVGComponent04()
      case '(05)':
        return SVGComponent05()
      case '(06)':
        return SVGComponent06()
      case '(07)':
        return SVGComponent07()
      case '(08)':
        return SVGComponent08()
      case '(09)':
        return SVGComponent09()
      case '(010)':
        return SVGComponent010()
      case '(011)':
        return SVGComponent011()
      case '(012)':
        return SVGComponent012()
    }
  }

  const renderItem = ({item, index}) => {
    return(
      <TouchableOpacity
        onPress={()=>{
          if(props.onSelected){
            props.onSelected(item.id)
          }
        }}
        style={{flex: 1, paddingVertical: 9, alignItems: 'center', justifyContent: 'center'}}>
        {
          getSticker(item.id)
        }
      </TouchableOpacity>
    )
  }

  return(
    <FlatList
      style={{maxHeight: 300, backgroundColor: 'white'}}
      removeClippedSubviews={true}
      data={data}
      keyExtractor={(item, index)=>item.id+''}
      renderItem={renderItem} numColumns={4}
    />
  )
}
