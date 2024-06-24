import { Popover } from '@ui-kitten/components'
import { Constants, getAudioDeviceList, switchAudioDevice, useMeeting } from '@videosdk.live/react-native-sdk'
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-simple-toast'
import RecordingAnimation from '../../assets/animation/recording_lottie.json'
import { CallEnd, CameraSwitch, Chat, Copy, EndForAll, Leave, MicOff, MicOn, More, Participants, Recording, ScreenShare, Speaker, VideoOff, VideoOn } from '../../assets/icons'
import Blink from '../../components/Blink'
import BottomSheet from '../../components/BottomSheet'
import colors from '../../styles/colors'

import LocalParticipantPresenter from '../components/LocalParticipantPresenter'
import MenuItem from '../components/MenuItem'

import LargeViewContainer from './LargeView/LargeViewContainer'
import LocalViewContainer from './LocalViewContainer'
import MiniViewContainer from './MiniView/MiniViewContainer'
import ChatViewer from '../components/ChatViewer/ChatViewer'
import ParticipantListViewer from '../components/ParticipantListViewer'
import ParticipantStatsViewer from '../components/ParticipantStatsViewer'
// import VideosdkRPK from '../../../../../VideosdkRPK'

const OneToOneMeetingViewer = () => {
    const [chatViewer, setChatViewer] = useState(false)
    const [statParticipantId, setStatParticipantId] = useState(false)
    const [participantStatsViewer, setParticipantStatsViewer] = useState(false)
    const [participantListViewer, setParticipantListViewer] = useState(false)

    const {
        join,
        participants,
        localWebcamOn,
        localMicOn,
        toggleWebcam,
        toggleMic,
        presenterId,
        localScreenShareOn,
        meeting,
        recordingState,
        enableScreenShare,
        disableScreenShare,
    } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })


    const participantIds = [...participants.keys()]
    const participantCount = participantIds ? participantIds.length : null

    useEffect(() => {
        if (Platform.OS == "ios") {
            //     // VideosdkRPK.addListener("onScreenShare", (event) => {
            //     //     if (event === "START_BROADCAST") {
            //     //         enableScreenShare();
            //     //     } else if (event === "STOP_BROADCAST") {
            //     //         disableScreenShare();
            //     //     }
            //     // });

            return () => {
                // VideosdkRPK.removeSubscription("onScreenShare");
            };
        }
    }, []);

    const openStateBottomSheet = ({ pId }) => {
        setParticipantStatsViewer(true)
        setStatParticipantId(pId)
        setChatViewer(true)
    }

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
            onPress: () => setChatViewer(true)
        }
    ]

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <HeaderComponent />

            <ParticipantComponent
                {...{
                    participantCount, localScreenShareOn,
                    participantIds, openStateBottomSheet,
                    presenterId
                }}
            />

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

            <ChatViewerSheet {...{
                chatViewer, setParticipantListViewer, setChatViewer, setParticipantStatsViewer,
                statParticipantId, participantIds, participantListViewer, participantStatsViewer, setStatParticipantId
            }} />
        </View>
    )
}

export const HeaderComponent = ({ participantBottomSheetEnable, onPressParticipantIcon }) => {
    const [audioDeviceList, setAudioDeviceList] = useState([])
    const [audioListVisible, showAudioListVisible] = useState(false)

    const { changeWebcam, meetingId, recordingState, participants } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })

    const recordingRef = useRef()

    const isRecordingState = recordingState === Constants.recordingEvents.RECORDING_STARTED || recordingState === Constants.recordingEvents.RECORDING_STOPPING || recordingState === Constants.recordingEvents.RECORDING_STARTING

    useEffect(() => {
        if (recordingRef.current) {
            if (
                recordingState === Constants.recordingEvents.RECORDING_STARTING ||
                recordingState === Constants.recordingEvents.RECORDING_STOPPING
            ) {
                recordingRef.current.start()
            } else {
                recordingRef.current.stop()
            }
        }
    }, [recordingState])

    const updateAudioDeviceList = async () => {
        const devices = await getAudioDeviceList()
        setAudioDeviceList(devices)
    }

    return (
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

            <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: isRecordingState ? 8 : 0, }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        {meetingId ? meetingId : "xxxx-xxxx-xxxx"}
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

            <Popover
                visible={audioListVisible}
                anchor={() =>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={{
                            alignItems: 'center', justifyContent: 'center', marginRight: 16,
                            backgroundColor: '#4890E0', borderRadius: 10, padding: 4
                        }}
                        onPress={async () => {
                            await updateAudioDeviceList()
                            showAudioListVisible(true)
                        }}
                    >
                        <Speaker fill="white" width={20} height={20} />
                    </TouchableOpacity>
                }
                style={{ backgroundColor: colors.primary[700], borderRadius: 12, bottom: -18, left: 6 }}
                onBackdropPress={() => { showAudioListVisible(false) }}
            >
                <>
                    {audioDeviceList.map((device, index) => {
                        return (
                            <View key={index}>
                                <MenuItem
                                    key={index}
                                    title={
                                        device == 'SPEAKER_PHONE'
                                            ? "Speaker"
                                            : device == "EARPIECE"
                                                ? "Earpiece"
                                                : device == "BLUETOOTH"
                                                    ? "Bluetooth"
                                                    : "Wired Headset"
                                    }
                                    onPress={() => {
                                        switchAudioDevice(device)
                                        showAudioListVisible(false)
                                    }}
                                />

                                {index != audioDeviceList.length - 1 &&
                                    <View style={{ height: 1, backgroundColor: colors.primary[600] }} />
                                }
                            </View>
                        )
                    })}
                </>
            </Popover>

            <TouchableOpacity
                activeOpacity={0.5}
                style={{
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#4890E0', borderRadius: 10, padding: 4
                }}
                onPress={() => { changeWebcam() }}
            >
                <CameraSwitch height={20} width={20} fill="white" />
            </TouchableOpacity>

            {participantBottomSheetEnable && [...participants.keys()].length > 1 &&
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={onPressParticipantIcon}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'center', marginLeft: 8,
                        backgroundColor: '#4890E0', borderRadius: 10, padding: 4
                    }}
                >
                    <Participants height={18} width={18} fill="white" />
                    <Text style={{ fontSize: 14, color: 'white', marginLeft: 4 }}>
                        {[...participants.keys()].length}
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
}

export const ParticipantComponent = ({ participantCount, localScreenShareOn, participantIds, openStateBottomSheet, presenterId }) => {

    return (
        <View style={{ flex: 1, marginTop: 8, marginBottom: 12 }}>
            {participantCount > 1 ?
                <>
                    {localScreenShareOn
                        ? <LocalParticipantPresenter />
                        : <LargeViewContainer participantId={participantIds[1]} openStateBottomSheet={openStateBottomSheet} />
                    }

                    <MiniViewContainer
                        openStateBottomSheet={openStateBottomSheet}
                        participantId={
                            participantIds[localScreenShareOn || presenterId ? 1 : 0]
                        }
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

export const ChatViewerSheet = ({ chatViewer, setParticipantListViewer, setChatViewer, setParticipantStatsViewer, statParticipantId, participantIds, participantListViewer, participantStatsViewer, setStatParticipantId }) => {

    return (
        <BottomSheet
            title={'Chat Box'}
            visible={chatViewer}
            onClose={() => {
                setParticipantListViewer(false)
                setChatViewer(false)
                setParticipantStatsViewer(false)
                setStatParticipantId("")
            }}
            height={400}
            customStyles={{ paddingHorizontal: 20, }}
        >
            {chatViewer ?
                <ChatViewer />
                : participantListViewer
                    ? <ParticipantListViewer participantIds={participantIds} />
                    : participantStatsViewer
                        ? <ParticipantStatsViewer participantId={statParticipantId} />
                        : null
            }
        </BottomSheet>
    )
}

export const EndCallOptionComponent = () => {
    const [isEndCallVisible, setIsEndCallVisible] = useState(false)

    const { leave, end } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })

    return (
        <Popover
            visible={isEndCallVisible}
            anchor={() =>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                        height: 52, aspectRatio: 1, justifyContent: "center",
                        alignItems: "center", backgroundColor: 'red', borderRadius: 14,
                    }}
                    onPress={() => { setIsEndCallVisible(true) }}
                >
                    <CallEnd height={28} width={28} fill="black" />
                </TouchableOpacity>
            }
            style={{ backgroundColor: colors.primary[700], borderRadius: 12, bottom: -18, left: 6 }}
            onBackdropPress={() => { setIsEndCallVisible(false) }}
        >
            <View style={{ gap: 8 }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flexDirection: 'row', gap: 8, alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10, borderRadius: 10
                    }}
                    onPress={() => {
                        leave()
                        setIsEndCallVisible(false)
                    }}
                >
                    <Leave width={22} height={22} />

                    <View style={{ gap: 4 }}>
                        <Text style={{ fontSize: 12, color: 'white' }}>
                            Leave
                        </Text>
                        <Text style={{ fontSize: 12, color: 'white' }}>
                            Only you will leave the call
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: colors.primary["600"] }} />

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                        flexDirection: 'row', gap: 8, alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10, borderRadius: 10
                    }}
                    onPress={() => {
                        end()
                        setIsEndCallVisible(false)
                    }}
                >
                    <EndForAll />

                    <View style={{ gap: 4 }}>
                        <Text style={{ fontSize: 12, color: 'white', }}>
                            Leave
                        </Text>

                        <Text style={{ fontSize: 12, color: 'white', }}>
                            Only you will leave the call
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Popover>
    )
}

export const MoreOptionComponent = () => {
    const [moreOptionVisible, setMoreOptionVisible] = useState(false)

    const { recordingState, localScreenShareOn, toggleScreenShare, startRecording, stopRecording, presenterId } = useMeeting({
        onError: (data) => {
            const { code, message } = data
            Toast.show(`Error: ${code}: ${message}`)
        }
    })

    return (
        <Popover
            visible={moreOptionVisible}
            anchor={() =>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                        height: 52, aspectRatio: 1, justifyContent: "center", alignItems: "center",
                        borderRadius: 14, borderWidth: 1, borderColor: '#2B3034',
                    }}
                    onPress={() => { setMoreOptionVisible(true) }}
                >
                    <More height={18} width={18} fill={"#000000"} />
                </TouchableOpacity>
            }
            style={{ backgroundColor: colors.primary[700], borderRadius: 12, bottom: -18, right: 6 }}
            onBackdropPress={() => { setMoreOptionVisible(false) }}
        >
            <>
                <MenuItem
                    title={`${!recordingState ||
                        recordingState === Constants.recordingEvents.RECORDING_STOPPED
                        ? "Start"
                        : recordingState === Constants.recordingEvents.RECORDING_STARTING
                            ? "Starting"
                            : recordingState === Constants.recordingEvents.RECORDING_STOPPING
                                ? "Stopping"
                                : "Stop"
                        } Recording`}
                    icon={<Recording width={22} height={22} />}
                    onPress={() => {
                        if (
                            !recordingState ||
                            recordingState === Constants.recordingEvents.RECORDING_STOPPED
                        ) {
                            startRecording();
                        } else if (
                            recordingState === Constants.recordingEvents.RECORDING_STARTED
                        ) {
                            stopRecording();
                        }
                        setMoreOptionVisible(false)
                    }}
                />

                <View style={{ height: 1, backgroundColor: colors.primary["600"] }} />

                {(presenterId == null || localScreenShareOn) && (
                    <MenuItem
                        title={`${localScreenShareOn ? "Stop" : "Start"} Screen Share`}
                        icon={<ScreenShare width={22} height={22} />}
                        onPress={() => {
                            setMoreOptionVisible(false)
                            if (presenterId == null || localScreenShareOn)
                                Platform.OS === "android"
                                    ? toggleScreenShare()
                                    : null;//VideosdkRPK.startBroadcast();
                        }}
                    />
                )}

                {/* <View style={{ height: 1, backgroundColor: colors.primary["600"] }} />

            <MenuItem
                title={"Participants"}
                icon={<Participants width={22} height={22} />}
                onPress={() => {
                    setParticipantStatsViewer(true);
                    setMoreOptionVisible(false)
                    setChatViewer(true)
                }}
            /> */}
            </>
        </Popover>
    )
}

export default OneToOneMeetingViewer