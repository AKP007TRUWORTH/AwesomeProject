import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'

const BottomSheet = ({ visible, hide, title, children, onOpen, closeOnOverlayTap, FooterComponent, childrenStyle, customStyles, ...props }) => {

    const rbSheetRef = useRef(null)

    useEffect(() => {
        if (visible) return rbSheetRef.current.open()
        return rbSheetRef.current.close()
    }, [visible])

    return (
        <RBSheet
            ref={rbSheetRef}
            closeOnPressMask={true}
            closeOnPressBack={true}
            onOpen={onOpen}
            customStyles={{
                container: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    ...customStyles
                }
            }}
            {...props}
        >
            {title &&
                <>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', textAlign: 'center', padding: 16, }}>
                        {title}
                    </Text>
                    <View style={{ height: 1, backgroundColor: '#E5E7EA', width: '100%' }} />
                </>
            }
            {children &&
                <View style={{ flex: 1 }}>
                    {children}
                </View>
            }
        </RBSheet>
    )
}

export default BottomSheet