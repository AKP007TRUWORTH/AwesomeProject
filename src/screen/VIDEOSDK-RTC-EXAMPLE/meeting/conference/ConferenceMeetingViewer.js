import { useMeeting } from '@videosdk.live/react-native-sdk'
import React, { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import BottomSheet from '../../components/BottomSheet'
import { EndCallOptionComponent, HeaderComponent, MoreOptionComponent } from '../OneToOne/OneToOneMeetingViewer'
import RemoteParticipantPresenter from './RemoteParticipantPresenter'
import LocalParticipantPresenter from '../components/LocalParticipantPresenter'
import { MemoizedParticipantGrid } from './ConfrenceParticipantGrid'
import { Chat, MicOff, MicOn, VideoOff, VideoOn } from '../../assets/icons'
import ChatViewer from '../components/ChatViewer'
import ParticipantListViewer from '../components/ParticipantListViewer'
import colors from '../../styles/colors'
import LargeViewContainer from '../OneToOne/LargeView/LargeViewContainer'
import MiniViewContainer from '../OneToOne/MiniView/MiniViewContainer'
import LocalViewContainer from '../OneToOne/LocalViewContainer'

const ConferenceMeetingViewer = () => {
    const [chatBottomSheetView, setChatBottomSheetView] = useState(false)
    const [participantSheetOption, setParticipantSheetOption] = useState('')

    const {
        localWebcamOn,
        localMicOn,
        toggleWebcam,
        toggleMic,
    } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })

    const options = [
        {
            key: 1,
            renderComponent: (
                localMicOn
                    ? <MicOn height={24} width={24} fill={'black'} />
                    : <MicOff height={24} width={24} fill={'#1D2939'} />
            ),
            onPress: () => toggleMic()
        },
        {
            key: 2,
            renderComponent: (
                localWebcamOn
                    ? <VideoOn height={24} width={24} fill={'black'} />
                    : <VideoOff height={36} width={36} fill={'#1D2939'} />
            ),
            onPress: () => toggleWebcam()
        },
        {
            key: 3,
            renderComponent: <Chat height={22} width={22} fill={"#000000"} />,
            onPress: () => {
                setChatBottomSheetView(true)
                setParticipantSheetOption('CHAT')
            }
        }
    ]

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <HeaderComponent
                participantBottomSheetEnable={true}
                onPressParticipantIcon={() => {
                    setParticipantSheetOption('PARTICIPANT_LIST')
                    setChatBottomSheetView(true)
                }}
            />

            <ConfrenceMeetingParticipants />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <EndCallOptionComponent />

                {options.map((option, index) =>
                    <TouchableOpacity
                        key={option.key}
                        activeOpacity={0.5}
                        style={{
                            height: 52, aspectRatio: 1, justifyContent: "center", alignItems: "center",
                            borderRadius: 14, borderWidth: 1, borderColor: '#2B3034',
                        }}
                        onPress={option.onPress}
                    >
                        {option.renderComponent}
                    </TouchableOpacity>
                )}

                <MoreOptionComponent />
            </View>

            <ChatBottomComponent
                show={chatBottomSheetView}
                hide={() => setChatBottomSheetView(false)}
                participantSheetOption={participantSheetOption}
            />
        </View>
    )
}

const ConfrenceMeetingParticipants = () => {

    const { localScreenShareOn, orientation, pinnedParticipants, localParticipant, participants, presenterId, activeSpeakerId } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })

    const participantIds = useMemo(() => {
        const pinnedParticipantId = [...pinnedParticipants.keys()].filter((participantId) => participantId != localParticipant.id)

        const requalryParticipantIds = [...participants.keys()].filter((participantId) => participantId != localParticipant.id)

        const ids = [localParticipant?.id, ...pinnedParticipantId, ...requalryParticipantIds].slice(0, presenterId ? 2 : 6)

        if (activeSpeakerId) {
            if (!ids.includes(activeSpeakerId)) {
                ids[ids.length - 1] = activeSpeakerId
            }
        }

        return ids
    }, [participants, activeSpeakerId, pinnedParticipants, presenterId, localScreenShareOn])

    const participantCount = participantIds ? participantIds.length : null
    const filterParticipantIds = participantIds.filter((pId) => pId !== localParticipant.id)

    return (
        <View style={{ flex: 1, margin: 12, }}>
            {presenterId && !localScreenShareOn
                ?
                <View style={{
                    height: '70%', backgroundColor: colors.primary[800],
                    borderRadius: 12, overflow: 'hidden', marginBottom: 8
                }}>
                    <RemoteParticipantPresenter presenterId={presenterId} />
                </View>
                : presenterId && localScreenShareOn
                    ? <LocalParticipantPresenter />
                    : null
            }

            {participantCount > 1
                ?
                <>
                    {participantCount > 2 ?
                        <MemoizedParticipantGrid
                            participantIds={filterParticipantIds}
                            isPresenting={presenterId != null}
                        />
                        :
                        <LargeViewContainer participantId={participantIds[1]} />
                    }

                    <View style={{ position: 'absolute', right: 0, bottom: 0, left: 0 }}>
                        <MiniViewContainer
                            participantId={
                                participantIds[localScreenShareOn || presenterId ? 1 : 0]
                            }
                        />
                    </View>
                </>
                :
                <LocalViewContainer participantId={participantIds[0]} />
            }
        </View>
    )
}

const ChatBottomComponent = ({ show, hide, participantSheetOption }) => {
    const { participants } = useMeeting()

    const isChat = participantSheetOption == 'CHAT'

    return (
        <BottomSheet
            title={isChat ? 'Chat' : undefined}
            visible={show}
            onClose={hide}
            childrenStyle={{ padding: isChat ? 16 : 0 }}
        >
            {participantSheetOption === "CHAT"
                ? <ChatViewer />
                : participantSheetOption === "PARTICIPANT_LIST"
                    ? <ParticipantListViewer participantIds={[...participants.keys()]} />
                    : null
            }
        </BottomSheet>
    )
}

export default ConferenceMeetingViewer