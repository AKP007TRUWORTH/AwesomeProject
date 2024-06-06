import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Constants, useMeeting } from '@videosdk.live/react-native-sdk'
import Blink from '../../components/Blink'
import LottieView from 'lottie-react-native'
import RecordingAnimation from '../../assets/animation/recording_lottie.json'
import Toast from 'react-native-simple-toast'
import { CameraSwitch, Copy } from '../../assets/icons'
import LocalParticipantPresenter from '../components/LocalParticipantPresenter'
import LargeViewContainer from './LargeView'
import MiniViewContainer from './MiniView'
import LocalViewContainer from './LocalViewContainer'

const OneToOneMeetingViewer = () => {

    // const { recordingState, meetingId, participants } = useMeeting({
    //     onError: (data) => {
    //         const { code, message } = data
    //         Toast.show(`Error: ${code}: ${message}`)
    //     }
    // })

    // const participantIds = [...participants.keys()]
    // const participantCount = participantIds ? participantIds.length : null

    const recordingRef = React.useRef()

    // const isRecordingState = recordingState === Constants.recordingEvents.RECORDING_STARTED || recordingState === Constants.recordingEvents.RECORDING_STOPPING || recordingState === Constants.recordingEvents.RECORDING_STARTING

    const isRecordingState = true

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {isRecordingState &&
                    <View>
                        <Blink ref={recordingRef} duration={500}>
                            <LottieView
                                source={RecordingAnimation}
                                autoPlay
                                loop
                                style={{ width: 50, height: 30 }}
                            />
                        </Blink>
                    </View>
                }

                <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: isRecordingState ? 8 : 0 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            {/* {meetingId ? meetingId : "xxxx-xxxx-xxxx"} */}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{ justifyContent: 'center', marginLeft: 10 }}
                            onPress={() => {
                                Toast.show("Meeting Id copied Successfully")
                            }}
                        >
                            <Copy fill={'black'} width={18} height={18} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => { }}
                >
                    <CameraSwitch height={22} width={22} fill={'black'} />
                </TouchableOpacity>
            </View>

            <ParticipantComponent />
        </>
    )
}

const ParticipantComponent = ({ participantCount = 2, localScreenShareOn = true, participantIds = [] }) => {

    const openStateBottomSheet = () => {


    }

    return (
        <View style={{ flex: 1, marginTop: 8, marginBottom: 12 }}>
            {participantCount > 1 ?
                <>
                    {localScreenShareOn ? <LocalParticipantPresenter /> : <LargeViewContainer participantId={participantIds[1]} openStateBottomSheet={openStateBottomSheet} />}

                    <MiniViewContainer
                        openStateBottomSheet={openStateBottomSheet}
                    // participantId={
                    //     participantIds[localScreenShareOn || presenterId ? 1 : 0]
                    // }
                    />
                </>
                : participantCount === 1 ?
                    <LocalViewContainer participantId={participantIds[0]} />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} />
                    </View>
            }
        </View>
    )
}

export default OneToOneMeetingViewer