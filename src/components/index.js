import React from 'react'
import { Text, TextInput } from 'react-native';

export const MText = (props) => {
  const {  style, children, ...rest } = props
  return (
    <Text
      {...props}
      style={[style, {
        fontFamily: "SVN-Gilroy",
    },]}
    >
    </Text>
)
}
export const MTextInput = React.forwardRef((props, ref) => {
  const {  style, children, ...rest } = props

  return <TextInput
    {...props}
    ref={ref}
    style={[{
    fontFamily: "SVN-Gilroy"
  }, style]} >
  </TextInput>
})
