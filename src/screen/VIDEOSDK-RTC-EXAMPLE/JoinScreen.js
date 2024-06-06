import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Layout, MenuItem, OverflowMenu } from '@ui-kitten/components'
import { createCameraVideoTrack, RTCView, switchAudioDevice, useMediaDevice } from '@videosdk.live/react-native-sdk'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-simple-toast'
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView'
import { createMeeting, validateMeeting } from './api/create-meeting'
import { CameraSwitch, MicOff, MicOn, Speaker, VideoOff, VideoOn } from './assets/icons'
import BottomSheet from './components/BottomSheet'
import Button from './components/Button'
import TextInputContainer from './components/TextInputContainer'
import { VIDEOSDK_TOKEN } from './helper/environment'
import colors from './styles/colors'
import OneToOneMeetingViewer from './meeting/OneToOne/OneToOneMeetingViewer'

const JoinScreen = () => {
    const [videoOn, setVideoOn] = useState(false)
    const [micOn, setMicOn] = useState(false)
    const [audioListVisible, showAudioListVisible] = useState(false)

    const [tracks, setTrack] = useState("")
    const [facingMode, setFacingMode] = useState("user")
    const [audioList, setAudioList] = useState([])

    useFocusEffect(
        useCallback(() => {
            getTrack()
        }, [])
    )

    useEffect(() => {
        getTrack()
    }, [facingMode])

    const disposeVideoTrack = () => {
        setTrack((stream) => {
            stream.getTracks().forEach((track) => {
                track.enabled = false
                return track
            })
        })
    }

    const getTrack = async () => {
        const track = await createCameraVideoTrack({
            optimizationMode: "motion",
            encoderConfig: "h1080p_w1920p",
            facingMode: facingMode
        })
        setTrack(track)
    }

    const toggleAudioList = () => {
        showAudioListVisible(!audioListVisible)
    }

    return (
        <Layout style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <CustomKeyboardAvoidingView
                behavior={Platform.OS == "ios" ? 'padding' : null}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                >
                    {/* <HeaderComponent {...{
                        setFacingMode, setAudioList, disposeVideoTrack, toggleAudioList
                    }} />

                    <RTCViewComponent {...{
                        tracks, videoOn, micOn, setMicOn, setVideoOn
                    }} />

                    <BottomViewComponent {...{
                        disposeVideoTrack, micOn, videoOn, facingMode
                    }} /> */}

                    <OneToOneMeetingViewer />

                </ScrollView>
            </CustomKeyboardAvoidingView>

            <AudioListBottomSheet {...{
                audioList, toggleAudioList, showAudioListVisible, audioListVisible
            }} />
        </Layout >
    )
}

const HeaderComponent = ({ setFacingMode, disposeVideoTrack, setAudioList, toggleAudioList }) => {

    const { getAudioDeviceList } = useMediaDevice()

    const fetchAudioDevices = async () => {
        const devices = await getAudioDeviceList();
        setAudioList(devices);
    }

    const handleAudioButtonPress = async () => {
        await fetchAudioDevices()
        toggleAudioList()
    }

    const handleCameraButtonPress = async () => {
        try {
            disposeVideoTrack()
        } finally {
            setFacingMode(prevFacingMode => prevFacingMode === "environment" ? "user" : "environment")
        }
    }

    return (
        <View style={{
            flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center',
            padding: 16, gap: 8
        }}>

            <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleAudioButtonPress}
            >
                <Speaker fill="black" width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleCameraButtonPress}
            >
                <CameraSwitch fill="black" width={25} height={25} />
            </TouchableOpacity>
        </View>
    )
}

const RTCViewComponent = ({ tracks, videoOn, micOn, setMicOn, setVideoOn }) => {


    if (!tracks) return null

    return (
        <View style={{ flex: 1, paddingTop: '5%' }}>
            <View style={{ flex: 1, width: '80%', alignSelf: 'center' }}>
                <View style={{
                    flex: 1, borderRadius: 12, overflow: 'hidden',
                    borderRadius: 20, borderColor: '#D8D8D8', backgroundColor: '#FFFFFF', borderWidth: 1,
                    elevation: 12, shadowColor: '#24292E', shadowOpacity: 0.25, shadowRadius: 3.84,
                }}>
                    {videoOn && tracks
                        ?
                        <RTCView
                            streamURL={tracks.toURL()}
                            objectFit='cover'
                            mirror={true}
                            style={{ flex: 1, borderRadius: 20 }}
                        />
                        :
                        <View style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center',
                            padding: 12, backgroundColor: '#4890E0'
                        }}>
                            <Image
                                source={require('./assets/images/male.jpg')}
                                resizeMode='contain' style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                    }
                    <View style={{
                        flexDirection: 'row', position: 'absolute', backgroundColor: 'transparent',
                        left: 0, right: 0, bottom: 10, justifyContent: 'space-evenly'
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setMicOn(!micOn)
                            }}
                            style={{
                                height: 50,
                                aspectRatio: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                                borderRadius: 100,
                                backgroundColor: micOn ? colors.black : 'red'
                            }}
                        >
                            {micOn ? <MicOn fill="white" width={25} height={25} /> : <MicOff fill="black" width={25} height={25} />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setVideoOn(!videoOn)
                            }}
                            style={{
                                height: 50,
                                aspectRatio: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                                borderRadius: 100,
                                backgroundColor: videoOn ? colors.black : 'red'
                            }}
                        >
                            {videoOn ? <VideoOn fill="white" width={25} height={25} /> : <VideoOff fill="black" width={25} height={25} />}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const BottomViewComponent = ({ disposeVideoTrack, micOn, videoOn, facingMode }) => {
    const [isVisibleCreateMeetingContainer, setIsVisibleCreateMeetingContainer] = useState(false)
    const [isVisibleJoinMeetingContainer, setIsVisibleJoinMeetingContainer] = useState(false)
    const [showDropDown, toogelDropDown] = useState(false)

    const [name, setName] = useState('')
    const [meetingId, setMeetingId] = useState('')
    const [meetingType, setMeetingType] = useState(meetingTypes[0])

    const naviagtion = useNavigation()

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (!isVisibleCreateMeetingContainer && !isVisibleJoinMeetingContainer) {
                    setIsVisibleCreateMeetingContainer(false)
                    setIsVisibleJoinMeetingContainer(false)
                    return true
                } else {
                    return false
                }
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => subscription.remove()
        }, [isVisibleCreateMeetingContainer, isVisibleJoinMeetingContainer])
    )

    return (
        <View style={{ marginHorizontal: 32, marginTop: 28 }}>
            {!isVisibleCreateMeetingContainer && !isVisibleJoinMeetingContainer &&
                <>
                    <Button text={"Create Meeting"} onPress={() => setIsVisibleCreateMeetingContainer(true)} />
                    <Button text={"Join Meeting"} onPress={() => setIsVisibleJoinMeetingContainer(true)} />
                </>
            }

            {isVisibleCreateMeetingContainer ?
                <>
                    <OverflowMenu
                        visible={showDropDown}
                        style={{
                            marginTop: Platform.OS == 'ios' ? isIphoneX() ? wp('-11%') : wp('-5%') : 5,
                            width: Dimensions.get('window').width - 100, paddingHorizontal: 16, paddingVertical: 8,
                            borderRadius: 8, elevation: 3, shadowOffset: { width: 0, height: 0 },
                            shadowColor: '#CED2D6', shadowOpacity: 0.15,
                        }}
                        onSelect={(index) => {
                            toogelDropDown(false)
                            setMeetingType(meetingTypes[index.row])
                        }}
                        anchor={() =>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => toogelDropDown(!showDropDown)}
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
                        {meetingTypes.map((item, index) => (
                            <MenuItem
                                key={item.key}
                                title={item.value}
                            />
                        ))}
                    </OverflowMenu>

                    <TextInputContainer
                        placeholder={"Enter your name"}
                        value={name}
                        setValue={setName}
                    />

                    <Button
                        text={"Join a Meeting"}
                        onPress={async () => {
                            if (name.length <= 0) {
                                return Toast.show("Enter your name")
                            }
                            let meetingId = await createMeeting({ token: VIDEOSDK_TOKEN })

                            disposeVideoTrack()
                            naviagtion.navigate('MeetingScreen', {
                                name: name.trim(),
                                token: VIDEOSDK_TOKEN,
                                meetingId,
                                micEnabled: micOn,
                                webCamEnabled: videoOn,
                                meetingType,
                                defaultCamera: facingMode === 'user' ? 'front' : 'back'
                            })
                        }}
                    />
                </>
                : isVisibleJoinMeetingContainer
                    ?
                    <>
                        <OverflowMenu
                            visible={showDropDown}
                            style={{
                                marginTop: Platform.OS == 'ios' ? isIphoneX() ? wp('-11%') : wp('-5%') : 5,
                                width: Dimensions.get('window').width - 100, paddingHorizontal: 16, paddingVertical: 8,
                                borderRadius: 8, elevation: 3, shadowOffset: { width: 0, height: 0 },
                                shadowColor: '#CED2D6', shadowOpacity: 0.15,
                            }}
                            onSelect={(index) => {
                                console.log(index);
                                toogelDropDown(false)
                                setMeetingType(meetingTypes[index.row].value)
                            }}
                            anchor={() =>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => toogelDropDown(!showDropDown)}
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
                            {meetingTypes.map((item, index) => (
                                <MenuItem
                                    key={item.key}
                                    title={item.value}
                                />
                            ))}
                        </OverflowMenu>

                        <TextInputContainer
                            placeholder={"Enter your name"}
                            value={name}
                            setValue={setName}
                        />

                        <TextInputContainer
                            placeholder={"Enter your meeting code"}
                            value={meetingId}
                            setValue={setMeetingId}
                        />

                        <Button
                            text={"Join a Meeting"}
                            onPress={async () => {
                                if (name.trim().length <= 0) {
                                    return Toast.show("Please Enter your name")
                                }
                                if (meetingId.trim().length <= 0) {
                                    return Toast.show("Please Enter your meeting code")
                                }

                                let validMeetingCode = await validateMeeting({
                                    token: VIDEOSDK_TOKEN,
                                    meetingId: meetingId.trim()
                                })

                                if (validMeetingCode) {
                                    disposeVideoTrack()
                                    naviagtion.navigate('MeetingScreen', {
                                        name: name.trim(),
                                        token: VIDEOSDK_TOKEN,
                                        meetingId,
                                        micEnabled: micOn,
                                        webCamEnabled: videoOn,
                                        meetingType: meetingType.key,
                                        defaultCamera: facingMode === 'user' ? 'front' : 'back'
                                    })
                                }
                            }}
                        />
                    </>
                    : null
            }
        </View>
    )
}

const AudioListBottomSheet = ({ audioList, toggleAudioList, audioListVisible }) => {
    const [selectedDeviceId, setSelectedDeviceId] = useState(null)

    const handleDevicePress = async (device) => {
        const id = await device.deviceId
        await switchAudioDevice(id)
        setSelectedDeviceId(id)
        toggleAudioList()
    }

    return (
        <BottomSheet
            visible={audioListVisible}
            titile={'Device Audio List'}
            childrenStyle={{ padding: 16 }}
            flatListProps={{
                data: audioList,
                renderItem: ({ item }) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleDevicePress(item)}
                            style={{
                                paddingHorizontal: 16, paddingVertical: 12,
                                backgroundColor: item.deviceId === selectedDeviceId ? '#BBB5B4' : 'white',
                                borderRadius: 8, borderWidth: 1, borderColor: '#BBB5B4',
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ fontSize: 16, color: 'black' }}>
                                {_.startCase(item.label)}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            }}
        />
    )
}

const meetingTypes = [
    { key: "ONE_TO_ONE", value: "One to One Meeting" },
    { key: "GROUP", value: "Group Meeting" },
]

export default JoinScreen