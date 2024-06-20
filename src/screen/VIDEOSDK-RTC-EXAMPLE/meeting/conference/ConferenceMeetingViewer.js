import { useMeeting, useParticipant, usePubSub } from '@videosdk.live/react-native-sdk'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import BottomSheet from '../../components/BottomSheet'
import { EndCallOptionComponent, HeaderComponent, MoreOptionComponent } from '../OneToOne/OneToOneMeetingViewer'
import RemoteParticipantPresenter from './RemoteParticipantPresenter'
import LocalParticipantPresenter from '../components/LocalParticipantPresenter'
import { MemoizedParticipant, MemoizedParticipantGrid } from './ConferenceParticipantGrid'
import { Chat, MicOff, MicOn, VideoOff, VideoOn } from '../../assets/icons'
import ChatViewer from '../components/ChatViewer/ChatViewer'
import ParticipantListViewer from '../components/ParticipantListViewer'
import colors from '../../styles/colors'
import LargeViewContainer from '../OneToOne/LargeView/LargeViewContainer'
import MiniViewContainer from '../OneToOne/MiniView/MiniViewContainer'
import LocalViewContainer from '../OneToOne/LocalViewContainer'
import CustomKeyboardAvoidingView from '../../../../components/CustomKeyboardAvoidingView'
import TextInputContainer from '../components/ChatViewer/TextInput'
import moment from 'moment'
import Hyperlink from 'react-native-hyperlink'
import Toast from 'react-native-simple-toast'

const ConferenceMeetingViewer = () => {
    const [privateChatSheet, showPrivateChatSheet] = useState(false)
    const [chatBottomSheetView, setChatBottomSheetView] = useState(false)

    const [participantId, setParticipantId] = useState('')
    const [participantSheetOption, setParticipantSheetOption] = useState('')

    const {
        localWebcamOn,
        localMicOn,
        toggleWebcam,
        toggleMic,
        participants,
    } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })

    const options = [
        {
            renderComponent: (
                localMicOn
                    ? <MicOn height={24} width={24} fill={'black'} />
                    : <MicOff height={24} width={24} fill={'#1D2939'} />
            ),
            onPress: () => toggleMic(),
            render: true
        },
        {
            renderComponent: (
                localWebcamOn
                    ? <VideoOn height={24} width={24} fill={'black'} />
                    : <VideoOff height={36} width={36} fill={'#1D2939'} />
            ),
            onPress: () => toggleWebcam(),
            render: true
        },
        {
            renderComponent: <Chat height={22} width={22} fill={"#000000"} />,
            onPress: () => {
                setChatBottomSheetView(true)
                setParticipantSheetOption('CHAT')
            },
            render: [...participants.keys()].length > 1
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

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <ConferenceMeetingParticipants />
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <EndCallOptionComponent />

                {options.map((option, index) =>
                    option.render &&
                    <TouchableOpacity
                        key={index}
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
                onPressChatIcon={(pId) => {
                    setParticipantId(pId)
                    setChatBottomSheetView(false);
                    setTimeout(() => {
                        showPrivateChatSheet(true);
                    }, 300);
                }}
            />

            <PrivateChatSheet
                show={privateChatSheet}
                hide={() => showPrivateChatSheet(false)}
                participantId={participantId}
            />
        </View>
    )
}

const ConferenceMeetingParticipants = () => {

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

    const allParticipantIds = [...participants.keys()]
    const participantCount = allParticipantIds ? allParticipantIds.length : null
    // const filterParticipantIds = allParticipantIds.filter((pId) => pId !== localParticipant.id)

    if (presenterId) {
        return (
            <View style={{ flex: 1, margin: 12, }}>
                {presenterId && !localScreenShareOn
                    ?
                    <>
                        <View style={{
                            height: '70%', backgroundColor: colors.primary[800],
                            borderRadius: 12, overflow: 'hidden', marginBottom: 8
                        }}>
                            <RemoteParticipantPresenter presenterId={presenterId} />
                        </View>

                        <FlatList
                            data={[...allParticipantIds]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 8, }}
                            renderItem={({ item: participantId }) => (
                                <MemoizedParticipant
                                    key={participantId}
                                    participantId={participantId}
                                    quality={'high'}
                                />
                            )}
                        />
                    </>
                    : presenterId && localScreenShareOn
                        ?
                        <>
                            <LocalParticipantPresenter />

                            <FlatList
                                data={[...allParticipantIds]}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 8, }}
                                renderItem={({ item: participantId }) => (
                                    <MemoizedParticipant
                                        key={participantId}
                                        participantId={participantId}
                                        quality={'high'}
                                    />
                                )}
                            />
                        </>
                        : null
                }
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginVertical: 12 }}>

            {participantCount > 1 &&
                <>
                    {participantCount > 2
                        ? <MemoizedParticipantGrid participantIds={[...allParticipantIds]} isPresenting={presenterId != null} />
                        : <LargeViewContainer participantId={participantIds[1]} />
                    }
                    {participantCount <= 2 && <MiniViewContainer participantId={localParticipant.id} />}
                </>
            }

            {participantCount <= 1 &&
                <LocalViewContainer participantId={participantIds[0]} />
            }
        </View>
    )
}

const ChatBottomComponent = ({ show, hide, participantSheetOption, onPressChatIcon }) => {
    const { participants, localParticipant } = useMeeting()

    const allParticipantIds = [...participants.keys()]
    const filterParticipantIds = allParticipantIds.filter((pId) => pId !== localParticipant.id)

    const isChat = participantSheetOption == 'CHAT'

    if (allParticipantIds.length <= 1) return null

    return (
        <BottomSheet
            title={isChat ? 'Chat' : undefined}
            visible={show}
            onClose={hide}
            height={isChat ? 400 : 300}
            customStyles={{ paddingHorizontal: isChat ? 20 : 0 }}
        >
            {participantSheetOption === "CHAT"
                ? <ChatViewer />
                : participantSheetOption === "PARTICIPANT_LIST"
                    ?
                    <ParticipantListViewer
                        participantIds={filterParticipantIds}
                        onPressChatIcon={onPressChatIcon}
                    />
                    : null
            }
        </BottomSheet>
    )
}

const PrivateChatSheet = ({ show, hide, participantId }) => {
    const [isSending, setIsSending] = useState(false);

    const [message, setMessage] = useState("");

    const { displayName } = useParticipant(participantId);
    const mMeeting = useMeeting({});
    const flatListRef = useRef();

    const { publish, messages } = usePubSub("CHAT", {
        onMessageReceived: (message) => {
            // console.log("message", message);
        },
        onOldMessagesReceived: (messages) => {
            // console.log("messages", messages);
        }
    });

    const localParticipantId = mMeeting?.localParticipant?.id;

    const handleSendMessage = () => {
        publish(message, { persist: true, sendOnly: [participantId] }, { isPrivateMessage: true, sendOnly: [participantId, localParticipantId] });
        setMessage("")
        setTimeout(() => {
            scrollToBottom();
        }, 300);
    };

    const scrollToBottom = () => {
        flatListRef.current.scrollToEnd({ animated: true });
    };

    return (
        <BottomSheet
            visible={show}
            onClose={hide}
            height={400}
            customStyles={{ paddingHorizontal: 20, }}
            title={`Chat with ${displayName}`}
        >
            <FlatList
                ref={flatListRef}
                data={messages.filter(message => {
                    if (message?.payload?.sendOnly) {
                        return (
                            message?.payload?.sendOnly.includes(localParticipantId) &&
                            message?.payload?.sendOnly.includes(participantId) && message?.payload?.isPrivateMessage
                        );
                    }
                    return message.senderId == localParticipantId && message?.payload?.isPrivateMessage
                })}
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(_, index) => `${index}_message_list`}
                style={{ marginVertical: 5 }}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {

                    const { message, senderId, timestamp, senderName } = item;
                    const localSender = localParticipantId === senderId;
                    const time = moment(timestamp).format("hh:mm a");

                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: colors.primary[600],
                                paddingVertical: 8, paddingHorizontal: 10, marginVertical: 6,
                                borderRadius: 10, marginHorizontal: 12,
                                alignSelf: localSender ? "flex-end" : "flex-start",
                            }}
                        >
                            <Text style={{ fontSize: 12, color: "#9A9FA5", fontWeight: "bold" }} >
                                {localSender ? "You" : senderName}
                            </Text>
                            <Hyperlink
                                linkDefault={true}
                                onPress={(url) => Linking.openURL(url)}
                                linkStyle={{ color: "blue" }}
                            >
                                <Text style={{ fontSize: 14, color: "white", }}>
                                    {message}
                                </Text>
                            </Hyperlink>
                            <Text style={{ color: "grey", fontSize: 10, alignSelf: "flex-end", marginTop: 4 }}>
                                {time}
                            </Text>
                        </View>
                    )
                }}
            />

            <TextInputContainer
                message={message}
                setMessage={setMessage}
                isSending={isSending}
                sendMessage={handleSendMessage}
            />
        </BottomSheet>
    )
}

export default ConferenceMeetingViewer