import React from 'react'
import { MediaStream, RTCView } from '@videosdk.live/react-native-sdk'
import Avatar from '../../../components/Avatar'
import colors from '../../../styles/colors'

const LargeVideoRTCView = ({ stream, displayName, isOn, objectFit, isLocal = { isLocal } }) => {

    return isOn && stream ?
        <>
            <RTCView
                objectFit={objectFit}
                mirror={isLocal ? true : false}
                style={{ flex: 1, backgroundColor: '#424242' }}
                streamURL={new MediaStream([stream.track]).toURL()}
            />

            <DisplayNameComponent isLocal={isLocal} displayName={displayName} style={{ backgroundColor: colors.primary[600] }} />

            {micOn && isActiveSpeaker
                ? <View style={{ backgroundColor: '#00000066', position: 'absolute', top: 10, right: 10, borderRadius: 16 }} />
                : !micOn ?
                    <MicStatusComponent style={{ backgroundColor: colors.primary[600] }} />
                    : null
            }
        </>
        :
        <>
            <Avatar
                containerBackgroundColor={colors.primary[800]}
                fullName={displayName}
                fontSize={26}
                style={{
                    backgroundColor: colors.primary[600],
                    height: 70, aspectRatio: 1, borderRadius: 40
                }}
            />

            <DisplayNameComponent isLocal={isLocal} displayName={displayName} style={{ backgroundColor: colors.primary[600] }} />

            {!micOn ? <MicStatusComponent style={{ backgroundColor: colors.primary[600] }} /> : null}
        </>

}

export default LargeVideoRTCView