import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useParticipant } from '@videosdk.live/react-native-sdk'
import LargeVideoRTCView from './LargeView/LargeVideoRTCView'
import colors from '../../styles/colors'

const LocalViewContainer = ({ participantId }) => {
    const { webcamOn, webcamStream, displayName, setQuality, isLocal } = useParticipant(participantId, {})

    useEffect(() => {
        setQuality("high")
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: colors.primary[800], borderRadius: 12, overflow: 'hidden' }}>
            <LargeVideoRTCView
                isOn={webcamOn}
                stream={webcamStream}
                displayName={displayName}
                objectFit={'cover'}
                isLocal={isLocal}
            />
        </View>
    )
}

export default LocalViewContainer