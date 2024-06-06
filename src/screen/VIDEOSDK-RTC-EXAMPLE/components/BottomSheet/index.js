import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Modalize } from 'react-native-modalize'

const BottomSheet = ({ visible, hide, title, children, childrenStyle, ...props }) => {

    const modalizeRef = useRef(null)

    useEffect(() => {
        if (visible) return modalizeRef.current.open()
        return modalizeRef.current.close()
    }, [visible])

    return (
        <Modalize
            ref={modalizeRef}
            HeaderComponent={
                <>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', textAlign: 'center', margin: 16 }}>
                        {title}
                    </Text>
                    <View style={{ height: 1, backgroundColor: '#E5E7EA', width: '100%' }} />
                </>
            }
            handlePosition='inside'
            adjustToContentHeight={true}
            withHandle={false}
            modalTopOffset={120}
            disableScrollIfPossible={false}
            childrenStyle={childrenStyle}
            {...props}
        >
            {children &&
                <View style={{ flex: 1 }}>
                    {children}
                </View>
            }
        </Modalize>
    )
}

export default BottomSheet