import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Constants, getAudioDeviceList, switchAudioDevice, useMeeting } from '@videosdk.live/react-native-sdk'
import Blink from '../../components/Blink'
import LottieView from 'lottie-react-native'
import RecordingAnimation from '../../assets/animation/recording_lottie.json'
import Toast from 'react-native-simple-toast'
import { CallEnd, CameraSwitch, Chat, Copy, EndForAll, Leave, MicOff, MicOn, More, Participants, Recording, ScreenShare, VideoOff, VideoOn } from '../../assets/icons'
import LocalParticipantPresenter from '../components/LocalParticipantPresenter'
import LargeViewContainer from './LargeView'
import MiniViewContainer from './MiniView'
import LocalViewContainer from './LocalViewContainer'
import Menu from '../../components/Menu'
import colors from '../../styles/colors'
import MenuItem from '../components/MenuItem'
import IconContainer from '../../components/IconContainer'
import BottomSheet from '../../components/BottomSheet'
import ChatViewer from '../components/ChatViewer'
import ParticipantListViewer from '../components/ParticipantListViewer'
import ParticipantStatsViewer from '../components/ParticipantStatsViewer'
// import VideosdkRPK from '../../../../../VideosdkRPK'

const OneToOneMeetingViewer = () => {

    const [chatViewer, setChatViewer] = useState(false)
    const [audioDeviceList, setAudioDeviceList] = useState([])
    const [statParticipantId, setStatParticipantId] = useState(false)
    const [participantStatsViewer, setParticipantStatsViewer] = useState(false)
    const [participantListViewer, setParticipantListViwer] = useState(false)

    const {
        join,
        participants,
        localWebcamOn,
        localMicOn,
        leave,
        end,
        changeWebcam,
        toggleWebcam,
        toggleMic,
        presenterId,
        localScreenShareOn,
        toggleScreenShare,
        meetingId,
        startRecording,
        stopRecording,
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

    const recordingRef = useRef()
    const leaveMenuRef = useRef()
    const moreOptionsMenuRef = useRef()
    const audioDeviceMenuRef = useRef()

    const participantIds = [...participants.keys()]
    const participantCount = participantIds ? participantIds.length : null
    const isRecordingState = recordingState === Constants.recordingEvents.RECORDING_STARTED || recordingState === Constants.recordingEvents.RECORDING_STOPPING || recordingState === Constants.recordingEvents.RECORDING_STARTING

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

    const openStateBottomSheet = ({ pId }) => {
        setParticipantStatsViewer(true)
        setStatParticipantId(pId)
        setChatViewer(true)
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <HeaderComponent {...{
                recordingRef, isRecordingState, meetingId, changeWebcam
            }} />

            <ParticipantComponent
                {...{
                    participantCount, localScreenShareOn, participantIds, openStateBottomSheet,
                    presenterId
                }}
            />

            {/* <OverflowMenu
                visible={showDropDown}
                style={{
                    marginTop: Platform.OS == 'ios' ? isIphoneX() ? wp('-11%') : wp('-5%') : 5,
                    width: Dimensions.get('window').width - 100, paddingHorizontal: 16, paddingVertical: 8,
                    borderRadius: 8, elevation: 3, shadowOffset: { width: 0, height: 0 },
                    shadowColor: '#CED2D6', shadowOpacity: 0.15,
                }}
                onSelect={(index) => {
                    toggleDropDown(false)
                    setMeetingType(meetingTypes[index.row].value)
                }}
                anchor={() =>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleDropDown(!showDropDown)}
                        style={{
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#4890E0",
                            borderRadius: 12,
                            marginVertical: 12,
                        }}
                    >
                        <Text style={{ color: 'white' }}>
                            {meetingType.value}
                        </Text>
                    </TouchableOpacity>
                }
            >
                <MenuItem
                    title={'Leave'}
                />
            </OverflowMenu> */}


            <Menu
                ref={leaveMenuRef}
                menuBackgroundColor={colors.primary[700]}
                placement="left"
                bottom={75}
                left={15}
            >
                <MenuItem
                    title={'Leave'}
                    description={"Only you will leave the call"}
                    icon={<Leave width={22} height={22} />}
                    onPress={() => {
                        leave()
                        moreOptionsMenuRef.current.close()
                    }}
                />

                <View style={{ height: 1, backgroundColor: colors.primary[600] }} />

                <MenuItem
                    title={'End'}
                    description={"End call for all participants"}
                    icon={<EndForAll />}
                    onPress={() => {
                        end()
                        moreOptionsMenuRef.current.close()
                    }}
                />
            </Menu>

            <Menu
                ref={audioDeviceMenuRef}
                menuBackgroundColor={colors.primary[700]}
                placement="left"
                bottom={75}
                left={80}
            >
                {audioDeviceList.map((device, index) => {
                    console.log(index);
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
                                    audioDeviceMenuRef.current.close()
                                }}
                            />

                            {index != audioDeviceList.length - 1 && <View style={{ height: 1, backgroundColor: colors.primary[600] }} />}
                        </View>
                    )
                })}
            </Menu>

            <Menu
                ref={moreOptionsMenuRef}
                menuBackgroundColor={colors.primary[700]}
                placement="right"
                bottom={75}
            >
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
                        moreOptionsMenuRef.current.close();
                    }}
                />

                <View style={{ height: 1, backgroundColor: colors.primary["600"] }} />

                {(presenterId == null || localScreenShareOn) && (
                    <MenuItem
                        title={`${localScreenShareOn ? "Stop" : "Start"} Screen Share`}
                        icon={<ScreenShare width={22} height={22} />}
                        onPress={() => {
                            moreOptionsMenuRef.current.close();
                            if (presenterId == null || localScreenShareOn)
                                Platform.OS === "android"
                                    ? toggleScreenShare()
                                    : VideosdkRPK.startBroadcast();
                        }}
                    />
                )}

                <View style={{ height: 1, backgroundColor: colors.primary["600"] }} />

                {/* <MenuItem
                    title={"Participants"}
                    icon={<Participants width={22} height={22} />}
                    onPress={() => {
                        setParticipantStatsViewer(true);
                        moreOptionsMenuRef.current.close(false);
                        setChatViewer(true)
                    }}
                /> */}
            </Menu>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <IconContainer
                    backgroundColor={"red"}
                    Icon={() => {
                        return <CallEnd height={28} width={28} fill="black" />
                    }}
                    onPress={() => {
                        leaveMenuRef.current.show()
                    }}
                />

                <IconContainer
                    backgroundColor={!localMicOn ? colors.primary[100] : "transparent"}
                    style={{ paddingLeft: 0, height: 52 }}
                    isDropDown={true}
                    onDropDownPress={async () => {
                        await updateAudioDeviceList()
                        audioDeviceMenuRef.current.show()
                    }}
                    Icon={() => {
                        return localMicOn ? <MicOn height={24} width={24} fill={'black'} /> : <MicOff height={24} width={24} fill={'#1D2939'} />
                    }}
                    onPress={() => { toggleMic() }}
                />

                <IconContainer
                    backgroundColor={!localWebcamOn ? colors.primary[100] : "transparent"}
                    style={{ borderWidth: 1.5, borderColor: '#2B3034' }}
                    Icon={() => {
                        return localWebcamOn ? <VideoOn height={24} width={24} fill={'black'} /> : <VideoOff height={36} width={36} fill={'#1D2939'} />
                    }}
                    onPress={() => { toggleWebcam() }}
                />

                <IconContainer
                    style={{ borderWidth: 1.5, borderColor: '#2B3034' }}
                    Icon={() => {
                        return <Chat height={22} width={22} fill={"#000000"} />
                    }}
                    onPress={() => {
                        setChatViewer(true)
                    }}
                />

                <IconContainer
                    style={{ borderWidth: 1.5, borderColor: '#2B3034', transform: [{ rotate: "90deg" }] }}
                    Icon={() => {
                        return <More height={18} width={18} fill={"#000000"} />
                    }}
                    onPress={() => { moreOptionsMenuRef.current.show() }}
                />
            </View>

            <BottomSheet
                title={'Chat Box'}
                visible={chatViewer}
                onClose={() => {
                    setParticipantListViwer(false)
                    setChatViewer(false)
                    setParticipantStatsViewer(false)
                    setStatParticipantId("")
                }}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                    contentContainerStyle: { flexGrow: 1, padding: 16 }
                }}

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
        </View>
    )
}

const HeaderComponent = ({ recordingRef, isRecordingState, meetingId, changeWebcam }) => {

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

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => { changeWebcam() }}
                >
                    <CameraSwitch height={22} width={22} fill={'black'} />
                </TouchableOpacity>
            </View>
        </>
    )
}

const ParticipantComponent = ({ participantCount, localScreenShareOn, participantIds, openStateBottomSheet, presenterId }) => {

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

export default OneToOneMeetingViewer