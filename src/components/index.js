import React from 'react'
import {Text} from 'react-native'
export const MText = React.forwardRef(props => {
  return <Text style={{
    fontFamily: "SVN-Gilroy"
  }} {...props}>
  </Text>
})
