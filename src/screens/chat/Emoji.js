import React, { useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmojiButton() {
    const insets = useSafeAreaInsets();
    const bottomSheetModalRef = useRef();
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {

        return () => {
            setShowModal(false)
        }
    }, [])

    return ( <
        >
        <
        TouchableOpacity onPress = {
            () => {
                setShowModal(true)
            }
        }
        style = {
            { width: 40, height: 56, alignItems: 'center', justifyContent: 'center' } } >
        <
        Image source = { require('../../assets/ic_emoj.png') }
        style = {
            { height: 24, width: 24, resizeMode: "contain" } }
        /> <
        /TouchableOpacity>

        <
        />
    )
}