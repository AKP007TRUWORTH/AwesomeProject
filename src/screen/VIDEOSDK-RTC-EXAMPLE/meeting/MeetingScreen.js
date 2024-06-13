import React, { useEffect, useState } from 'react'
import { Layout } from '@ui-kitten/components'
import { MeetingConsumer, MeetingProvider, ReactNativeForegroundService, useMeeting } from '@videosdk.live/react-native-sdk'

import WaitingToJoinView from './components/WaitingToJoinView'
import ConferenceMeetingViewer from './conference/ConferenceMeetingViewer'
import ParticipantLimitViewer from './OneToOne/ParticipantLimitViewer'
import OneToOneMeetingViewer from './OneToOne/OneToOneMeetingViewer'

const MeetingScreen = ({ route, navigation }) => {
    const { meetingId, micEnabled, webcamEnabled, name, defaultCamera, meetingType, token } = route.params ?? {}

    return (
        <Layout style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <MeetingProvider
                config={{
                    meetingId,
                    micEnabled,
                    webcamEnabled,
                    name,
                    notification: {
                        title: "Video SDK Meeting",
                        message: "Meeting is running."
                    },
                    defaultCamera,
                    metaData: { meetingId, meetingType }
                }}
                token={token}
            >
                <MeetingConsumer
                    {...{
                        onMeetingLeft: () => {
                            navigation.navigate('JoinScreen')
                        }
                    }}
                >
                    {() => {
                        return (
                            <MeetingContainer
                                webcamEnabled={webcamEnabled}
                                meetingType={meetingType}
                            />
                        )
                    }}
                </MeetingConsumer>
            </MeetingProvider>
        </Layout>
    )
}

const MeetingContainer = ({ webcamEnabled, meetingType }) => {
    const [isJoined, setIsJoined] = useState(false)
    const [participantLimit, setParticipantLimit] = useState(false)

    const { join, participants, leave } = useMeeting({
        onMeetingJoined: () => {
            setTimeout(() => {
                setIsJoined(true)
            }, 500)
        },

        onParticipantJoined: () => {
            if (participants.size < 2) {
                setParticipantLimit(false)
            }
        },
    })

    useEffect(() => {
        if (isJoined) {
            if (participants.size > 2) {
                setParticipantLimit(true)
            }
        }
    }, [isJoined])

    useEffect(() => {
        setTimeout(() => {
            if (!isJoined) {
                join()
            }
        }, 1000);

        return () => {
            leave()
            ReactNativeForegroundService.stopAll()
        }
    }, [])

    const groupMeeting = [...participants.values()].every(item => item.metaData.meetingType === "GROUP")

    return isJoined
        ? meetingType === "GROUP" && groupMeeting
            ? <ConferenceMeetingViewer />
            : participantLimit
                ? <ParticipantLimitViewer />
                : <OneToOneMeetingViewer />
        : <WaitingToJoinView />
}

export default MeetingScreen