import React from 'react'
import { MediaStream, RTCView } from '@videosdk.live/react-native-sdk'
import Avatar from '../../../components/Avatar'
import colors from '../../../styles/colors'
import { DisplayNameComponent, MicStatusComponent } from '../../conference/ParticipantView'

const LargeVideoRTCView = ({ stream, displayName, isOn, objectFit, isLocal = { isLocal }, micOn, isActiveSpeaker }) => {

    return isOn && stream ?
        <>
            <RTCView
                objectFit={objectFit}
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
                containerBackgroundColor={colors.primary[800]}
                fullName={displayName}
                fontSize={26}
                style={{
                    backgroundColor: colors.primary[700],
                    height: 70, aspectRatio: 1, borderRadius: 40
                }}
            />

            <DisplayNameComponent isLocal={isLocal} displayName={displayName} />

            {!micOn ? <MicStatusComponent /> : null}
        </>

}

export default LargeVideoRTCView