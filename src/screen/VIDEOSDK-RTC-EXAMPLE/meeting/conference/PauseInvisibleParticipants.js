import React, { useEffect } from 'react'
import { useMeeting, useParticipant } from '@videosdk.live/react-native-sdk'

const PauseInvisibleParticipants = ({ visibleParticipantIds }) => {
    const { participants } = useMeeting()

    return (
        <>
            {[...participants.keys()].map((participantId) => {
                return (
                    visibleParticipantIds.length > 0 &&
                    <PauseInvisibleParticipant
                        key={`PauseInvisibleParticipant_${participantId}`}
                        participantId={participantId}
                        isVisible={visibleParticipantIds.find((pId) => pId === participantId)}
                    />
                )
            })}
        </>
    )
}

const PauseInvisibleParticipant = ({ participantId, isVisible }) => {
    const { webcamStream, webcamOn, isLocal, displayName } = useParticipant(participantId)

    useEffect(() => {
        if (typeof isVisible === "string") {
            if (!isLocal) {
                if (isVisible) {
                    typeof webcamStream?.resume === "function" && webcamStream?.resume()
                } else {
                    typeof webcamStream?.pause === "function" && webcamStream?.pause()
                }
            }
        } else {
            if (!isLocal) {
                typeof webcamStream?.pause === "function" && webcamStream?.pause()
            }
        }
    }, [isLocal, isVisible, webcamStream])


    return <></>
}

export default PauseInvisibleParticipants