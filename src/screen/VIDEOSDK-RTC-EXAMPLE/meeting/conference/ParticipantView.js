import { Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { MediaStream, RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk'
import useParticipantStat from '../../hooks/useParticipantStat'
import { MicOff, NetworkIcon } from '../../assets/icons'
import colors from '../../styles/colors'
import Avatar from '../../components/Avatar'

const ParticipantView = ({ participantId, quality, openStatsBottomSheet }) => {

    const { displayName, webcamStream, webcamOn, micOn, isLocal, setQuality, isActiveSpeaker, getVideoStats, isPresenting, micStream, getShareStats, getAudioStats } = useParticipant(participantId, {})

    const { score } = useParticipantStat({ participantId })

    const updateStats = async () => {
        let stats = []
        if (isPresenting) {
            stats = await getShareStats()
        } else if (webcamStream) {
            stats = await getVideoStats()
        } else if (micStream) {
            stats = await getAudioStats()
        }
    }

    useEffect(() => {
        setInterval(() => {
            if (!isLocal) {
                updateStats()
            }
        }, 4000);
    }, [])

    useEffect(() => {
        if (quality) {
            setQuality(quality)
        }
    }, [])

    return (
        <View
            key={participantId}
            style={{ flex: 1, overflow: 'hidden', borderRadius: 16 }}
        >
            {webcamOn && webcamStream
                ?
                <>
                    <RTCView
                        streamURL={new MediaStream([webcamStream.track]).toURL()}
                        objectFit={"cover"}
                        mirror={isLocal ? true : false}
                        style={{
                            flex: 1,
                            backgroundColor: colors.primary[600], aspectRatio: 1, borderRadius: 16
                        }}
                    />

                    <DisplayNameComponent isLocal={isLocal} displayName={displayName} />

                    {micOn && isActiveSpeaker
                        ? <View style={{ backgroundColor: '#00000066', position: 'absolute', top: 10, right: 10, borderRadius: 16 }} />
                        : !micOn ?
                            <MicStatusComponent />
                            : null
                    }
                </>
                :
                <>
                    <Avatar
                        fullName={displayName}
                        containerBackgroundColor={colors.primary[600]}
                        fontSize={24}
                        style={{
                            margin: 50,
                            backgroundColor: colors.primary[500], height: 60, aspectRatio: 1, borderRadius: 40
                        }}
                    />

                    <DisplayNameComponent isLocal={isLocal} displayName={displayName} />

                    {!micOn ? <MicStatusComponent /> : null}
                </>
            }

            <View style={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                borderWidth: isActiveSpeaker ? 1 : 0,
                borderColor: '#3BA55D',
                borderRadius: 16,
            }}>
                {micOn || webcamOn ?
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            alignItems: 'center',
                            position: 'absolute',
                            top: 10,
                            padding: 8,
                            height: 26,
                            aspectRatio: 1,
                            borderRadius: 12,
                            justifyContent: 'center',
                            backgroundColor: colors.primary[700],
                            left: 10,
                            backgroundColor: score && score > 7
                                ? "#3BA55D"
                                : score > 4
                                    ? "#FAA713"
                                    : "#FF5D5D"
                        }}
                    // onPress={() => {
                    //     openStatsBottomSheet({ pId: participantId })
                    // }}
                    >
                        <NetworkIcon fill={'black'} />
                    </TouchableOpacity>
                    : null
                }
            </View>
        </View>
    )
}

const MicStatusComponent = () => {
    return (
        <View style={{
            alignItems: 'center', position: 'absolute', top: 10, justifyContent: 'center',
            padding: 8, height: 26, aspectRatio: 1, backgroundColor: colors.primary[700], borderRadius: 12,
            right: 10
        }}>
            <MicOff height={16} width={16} fill='white' />
        </View >
    )
}

const DisplayNameComponent = ({ isLocal, displayName }) => {

    return (
        <View style={{
            alignItems: 'center', position: 'absolute', bottom: 8, padding: 8, left: 8,
            backgroundColor: "rgba(0,0,0,0.3)", flexDirection: 'row', borderRadius: 5
        }}>
            <Text numberOfLines={1} style={{ color: 'white', fontSize: 10 }}>
                {isLocal ? 'You' : displayName}
            </Text>
        </View>
    )
}

export default ParticipantView