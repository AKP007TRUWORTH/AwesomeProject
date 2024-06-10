import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Modalize } from 'react-native-modalize'

const BottomSheet = ({ visible, hide, title, children, onOpen, closeOnOverlayTap, FooterComponent, childrenStyle, ...props }) => {

    const modalizeRef = useRef(null)

    useEffect(() => {
        if (visible) return modalizeRef.current.open()
        return modalizeRef.current.close()
    }, [visible])

    return (
        <Modalize
            ref={modalizeRef}
            adjustToContentHeight={true}
            disableScrollIfPossible={false}
            onOpen={onOpen}
            closeOnOverlayTap={closeOnOverlayTap}
            FooterComponent={FooterComponent}
            modalTopOffset={120}
            handlePosition='inside'
            childrenStyle={childrenStyle}
            HeaderComponent={
                <>
                    {title &&
                        <>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', textAlign: 'center', padding: 16, }}>
                                {title}
                            </Text>
                            <View style={{ height: 1, backgroundColor: '#E5E7EA', width: '100%' }} />
                        </>
                    }
                </>
            }
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