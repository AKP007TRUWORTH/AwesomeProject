import { View, Text } from 'react-native'
import React from 'react'
import { RTCView, useParticipant } from '@videosdk.live/react-native-sdk'
import { ScreenShare } from '../../assets/icons'

const RemoteParticipantPresenter = ({ presenterId }) => {
    const { displayName, screenShareStream, screenShareOn } = useParticipant(presenterId)

    const presentingText = displayName || ""

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {screenShareOn && screenShareStream
                ? <RTCView
                    streamURL={new MediaStream([screenShareStream.track]).toURL()}
                    objectFit={'contain'}
                    style={{ flex: 1 }}
                />
                : null
            }

            <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center', justifyContent: 'space-between', position: 'absolute', bottom: 0, left: 10, right: 10 }}>
                <View style={{ flexDirection: 'row', padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
                    <ScreenShare width={20} height={20} fill="white" />
                </View>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {`${presentingText} is presenting`}
                </Text>
            </View>
        </View>
    )
}

export default RemoteParticipantPresenter