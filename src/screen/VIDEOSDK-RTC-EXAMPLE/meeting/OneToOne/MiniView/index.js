import React, { useEffect } from 'react'
import MiniVideoRTCView from './MiniVideoRTCView'
import { useParticipant } from '@videosdk.live/react-native-sdk'

const MiniViewContainer = ({ participantId, openStatsBottomSheet }) => {
    const { webcamOn, webcamStream, displayName, setQuality, isLocal, micOn } = useParticipant(participantId, {})

    useEffect(() => {
        setQuality('high')
    }, [])

    return (
        <MiniVideoRTCView
            isOn={webcamOn}
            stream={webcamStream}
            displayName={displayName}
            isLocal={isLocal}
            micOn={micOn}
            participantId={participantId}
            openStatsBottomSheet={openStatsBottomSheet}
        />
    )
}

export default MiniViewContainer