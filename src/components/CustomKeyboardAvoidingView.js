import React, { useState, useEffect } from 'react'
import { View, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import { isIphoneX } from '../helpers/iPhoneX';

const CustomKeyboardAvoidingView = ({ children, behavior, keyboardVerticalOffset }) => {
    const [isKeyboardShow, setKeyboardShow] = useState(false);

    useEffect(() => {
        //Keyboard listener
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardShow(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardShow(false);
            }
        );
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [])

    return (
        <KeyboardAvoidingView behavior={behavior} keyboardVerticalOffset={keyboardVerticalOffset} style={{ flex: 1 }}>
            {children}
            <View style={{ height: (isKeyboardShow) ? Platform.OS === 'ios' ? (isIphoneX() ? 30 : 20) : 20 : 0 }} />
        </KeyboardAvoidingView>
    )
}

export default CustomKeyboardAvoidingView
