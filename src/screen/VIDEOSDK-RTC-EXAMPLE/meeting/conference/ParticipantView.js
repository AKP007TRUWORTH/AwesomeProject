import { Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useEffect } from 'react'
import { MediaStream, RTCView, useParticipant } from '@videosdk.live/react-native-sdk'
import useParticipantStat from '../../hooks/useParticipantStat'
import { MicOff, NetworkIcon } from '../../assets/icons'
import colors from '../../styles/colors'
import { Avatar } from '../../components/Avatar'

const ParticipantView = ({ participantId, quality, openStatsBottomSheet, containerStyle }) => {
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

    if (webcamOn && webcamStream) {
        return (
            <View key={participantId} style={{ ...containerStyle }}>
                <RTCView
                    streamURL={new MediaStream([webcamStream.track]).toURL()}
                    objectFit={"cover"}
                    mirror={isLocal ? true : false}
                    style={{ flex: 1, backgroundColor: colors.primary[600], borderRadius: 16 }}
                />

                <DisplayNameComponent isLocal={isLocal} displayName={displayName} />

                {micOn && isActiveSpeaker
                    ?
                    <View style={{
                        backgroundColor: '#00000066',
                        position: 'absolute',
                        top: 10, right: 10,
                        borderRadius: 16
                    }} />
                    : !micOn ?
                        <MicStatusComponent />
                        : null
                }

                <NetworkRangeComponent {...{
                    isActiveSpeaker, micOn, webcamOn, score
                }} />
            </View>
        )
    }

    return (
        <View key={participantId} style={{ ...containerStyle }}>
            <Avatar
                fullName={displayName}
                containerBackgroundColor={colors.primary[600]}
                fontSize={24}
                containContainerStyle={containerStyle?.height ? { flex: 1 } : { flex: 0, }}
                style={{
                    aspectRatio: 1,
                    borderRadius: 40, margin: 50,
                    backgroundColor: colors.primary[500],
                }}
            />

            <DisplayNameComponent isLocal={isLocal} displayName={displayName} />

            {!micOn ? <MicStatusComponent /> : null}

            <NetworkRangeComponent {...{ isActiveSpeaker, micOn, webcamOn, score }} />
        </View>
    )
}

const NetworkRangeComponent = ({ isActiveSpeaker, micOn, webcamOn, score }) => {
    return (
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
    )
}

export const MicStatusComponent = ({ style }) => {

    return (
        <View style={{
            alignItems: 'center', position: 'absolute', top: 10, justifyContent: 'center',
            padding: 8, height: 26, aspectRatio: 1, backgroundColor: colors.primary[700], borderRadius: 12,
            right: 10, ...style
        }}>
            <MicOff height={16} width={16} fill='white' />
        </View >
    )
}

export const DisplayNameComponent = ({ isLocal, displayName, style }) => {

    return (
        <View style={{
            alignItems: 'center', position: 'absolute', bottom: 8, padding: 8, left: 8,
            backgroundColor: "rgba(0,0,0,0.3)", flexDirection: 'row', borderRadius: 5, ...style
        }}>
            <Text numberOfLines={1} style={{ color: 'white', fontSize: 10 }}>
                {isLocal ? 'You' : displayName}
            </Text>
        </View>
    )
}

export default memo(ParticipantView)