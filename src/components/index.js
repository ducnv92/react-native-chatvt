import React from 'react'
import { Text, TextInput } from 'react-native';

export const MText = (props) => {
  const {  style, children, ...rest } = props
  let fontFamily = 'SVN-Gilroy'

  if(style===undefined || style?.fontWeight === '400'){
  }else if(style?.fontWeight === '500'){
    fontFamily =  'SVN-GilroyMedium'
  }else if(style?.fontWeight === '600'){
    fontFamily =  'SVN-GilroySemiBold'
  }else if(style?.fontWeight === '700'){
    fontFamily =  'SVN-GilroyBold'
  }

  return (
    <Text
      {...props}
      style={[style, {
        fontFamily: fontFamily,
    },]}
    >
    </Text>
)
}
export const MTextInput = React.forwardRef((props, ref) => {
  const {  style, children, ...rest } = props
  let fontFamily = 'SVN-Gilroy'

  if(style===undefined || style?.fontWeight === '400'){
  }else if(style?.fontWeight === '500'){
    fontFamily =  'SVN-GilroyMedium'
  }else if(style?.fontWeight === '600'){
    fontFamily =  'SVN-GilroySemiBold'
  }else if(style?.fontWeight === '700'){
    fontFamily =  'SVN-GilroyBold'
  }

  return <TextInput
    {...props}
    ref={ref}
    style={[{
    fontFamily: fontFamily
  }, style]} >
  </TextInput>
})
