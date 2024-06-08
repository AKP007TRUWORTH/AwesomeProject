import React, { useEffect } from 'react'
import LargeVideoRTCView from './LargeVideoRTCView'
import { useParticipant } from '@videosdk.live/react-native-sdk'
import useParticipantStat from '../../../hooks/useParticipantStat'
import { TouchableOpacity, View } from 'react-native'
import colors from '../../../styles/colors'
import { NetworkIcon } from '../../../assets/icons'

const LargeViewContainer = ({ participantId, openStatsBottomSheet }) => {
    const { screenShareOn, screenShareStream, webcamOn, webcamStream, displayName, setQuality, isLocal, micOn } = useParticipant(participantId, {})

    const { score } = useParticipantStat({ participantId });

    useEffect(() => {
        setQuality('high')
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: colors.primary[800], borderRadius: 12, overflow: 'hidden' }}>
            {screenShareOn ?
                <>
                    <LargeVideoRTCView
                        stream={screenShareStream}
                        isOn={screenShareOn}
                        displayName={displayName}
                        objectFit={'cover'}
                        isLocal={isLocal}
                    />
                </>
                :
                <>
                    <LargeVideoRTCView
                        isOn={webcamOn}
                        stream={webcamStream}
                        displayName={displayName}
                        objectFit={'cover'}
                        isLocal={isLocal}
                    />

                    {micOn || webcamOn ?
                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                position: "absolute",
                                top: 10,
                                padding: 8,
                                height: 26,
                                aspectRatio: 1,
                                borderRadius: 12,
                                justifyContent: "center",
                                left: 10,
                                backgroundColor: score && score > 7
                                    ? "#3BA55D"
                                    : score > 4
                                        ? "#FAA713"
                                        : "#FF5D5D"
                            }}
                            onPress={() => {
                                openStatsBottomSheet({ pId: participantId })
                            }}
                        >
                            <NetworkIcon fill={'black'} />
                        </TouchableOpacity>
                        : null
                    }
                </>
            }
        </View>
    )
}

export default LargeViewContainer