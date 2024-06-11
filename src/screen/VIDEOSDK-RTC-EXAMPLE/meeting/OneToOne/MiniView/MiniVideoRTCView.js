import useParticipantStat from '../../../hooks/useParticipantStat'
import { MediaStream, RTCView } from '@videosdk.live/react-native-sdk'
import { View, TouchableOpacity } from 'react-native'
import React from 'react'

import { NetworkIcon } from '../../../assets/icons'
import Avatar from '../../../components/Avatar'
import colors from '../../../styles/colors'
import { DisplayNameComponent, MicStatusComponent } from '../../conference/ParticipantView'

const MiniVideoRTCView = ({ isOn, stream, displayName, isLocal, micOn, participantId, openStatsBottomSheet }) => {
    const { score } = useParticipantStat({ participantId });

    return (
        <View style={{
            position: 'absolute', bottom: 10, right: 10, height: 160, aspectRatio: 0.7,
            borderRadius: 14, backgroundColor: '#FF0000', overflow: 'hidden',
            borderWidth: 1, borderColor: '#4890E0', elevation: 12, shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
            shadowRadius: 12, shadowColor: '#A6A6A6',
        }}>
            {isOn && stream ?
                <>
                    <RTCView
                        objectFit={'cover'}
                        zOrder={1}
                        mirror={isLocal ? true : false}
                        style={{ flex: 1, backgroundColor: '#424242' }}
                        streamURL={new MediaStream([stream.track]).toURL()}
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
                            backgroundColor: colors.primary[500],
                            height: 60, aspectRatio: 1, borderRadius: 40
                        }}
                    />

                    <DisplayNameComponent isLocal={isLocal} displayName={displayName} />

                    {!micOn ? <MicStatusComponent /> : null}
                </>
            }

            {micOn || isOn ?
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
        </View>
    )
}

export default MiniVideoRTCView