import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Layout, MenuItem, OverflowMenu } from '@ui-kitten/components'
import { createCameraVideoTrack, RTCView, switchAudioDevice, useMediaDevice } from '@videosdk.live/react-native-sdk'
import { BackHandler, Dimensions, Image, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-simple-toast'

import { ArrowIcon, CameraSwitch, MicOff, MicOn, Speaker, VideoOff, VideoOn } from './assets/icons'
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView'
import { createMeeting, validateMeeting } from './api/create-meeting'
import { widthPercentageToDP as wp } from '../../helpers/Responsive'
import { VIDEO_SDK_TOKEN } from './helper/environment'
import { isIphoneX } from '../../helpers/iPhoneX'

import TextInputContainer from './components/TextInputContainer'
import BottomSheet from './components/BottomSheet'
import Button from './components/Button'
import colors from './styles/colors'
import _ from 'lodash'
import OneToOneMeetingViewer from './meeting/OneToOne/OneToOneMeetingViewer'

const JoinScreen = () => {
    const [micOn, setMicOn] = useState(false)
    const [videoOn, setVideoOn] = useState(false)
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
                    <HeaderViewComponent {...{
                        setFacingMode, setAudioList, disposeVideoTrack, toggleAudioList
                    }} />

                    <RTCViewComponent {...{
                        tracks, videoOn, micOn, setMicOn, setVideoOn
                    }} />

                    <BottomViewComponent {...{
                        disposeVideoTrack, micOn, videoOn, facingMode
                    }} />

                </ScrollView>
            </CustomKeyboardAvoidingView>

            <AudioListBottomSheet {...{
                audioList, toggleAudioList, showAudioListVisible, audioListVisible
            }} />
        </Layout >
    )
}

const HeaderViewComponent = ({ setFacingMode, disposeVideoTrack, setAudioList, toggleAudioList }) => {

    const { getAudioDeviceList } = useMediaDevice()
    const navigation = useNavigation()

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

    const BackIconComponent = () => {
        return (
            <Pressable
                style={({ pressed }) => ({
                    backgroundColor: '#4890E0', opacity: pressed ? 0.8 : 1,
                    alignItems: 'center', justifyContent: 'center',
                    padding: 8, borderRadius: 20

                })}
                onPress={() => navigation.goBack()}
            >
                <ArrowIcon fill="white" width={18} height={18} />
            </Pressable>
        )
    }


    const options = [
        {
            icon: <Speaker fill="white" width={18} height={18} />,
            onPress: handleAudioButtonPress
        },
        {
            icon: <CameraSwitch fill="white" width={18} height={18} />,
            onPress: handleCameraButtonPress
        }
    ]

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>

            <BackIconComponent />

            <View style={{ flexDirection: 'row', gap: 16 }}>
                {options.map(({ icon, onPress }, index) => (
                    <Pressable
                        key={index}
                        style={({ pressed }) => ({
                            backgroundColor: '#4890E0', opacity: pressed ? 0.8 : 1,
                            alignItems: 'center', justifyContent: 'center',
                            padding: 8, borderRadius: 20
                        })}
                        onPress={onPress}
                    >
                        {icon}
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const RTCViewComponent = ({ tracks, micOn, setMicOn, videoOn, setVideoOn }) => {

    return (
        <View style={{ height: wp(120), paddingTop: '5%' }}>
            <View style={{ flex: 1, width: '80%', alignSelf: 'center' }}>
                <View style={{
                    flex: 1, overflow: 'hidden',
                    borderRadius: 20, borderColor: '#D8D8D8', backgroundColor: '#FFFFFF', borderWidth: 1,
                    elevation: 12, shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                    shadowRadius: 12, shadowColor: '#A6A6A6',
                }}>
                    <View style={{ position: 'absolute', height: 8, backgroundColor: '#000000', top: 20, left: 100, right: 100, borderRadius: 50 }} />
                    {videoOn && tracks
                        ?
                        <RTCView
                            streamURL={tracks.toURL()}
                            objectFit='cover'
                            mirror={true}
                            style={{ flex: 1, borderRadius: 20 }}
                        />
                        :
                        <Image
                            resizeMode='contain'
                            source={require('./assets/images/male.jpg')}
                            style={{ width: '100%', height: '100%', }}
                        />
                    }
                    <View style={{
                        flexDirection: 'row', position: 'absolute', backgroundColor: 'transparent',
                        left: 0, right: 0, bottom: 10, justifyContent: 'space-evenly'
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { setMicOn(!micOn) }}
                            style={{
                                height: 50, aspectRatio: 1,
                                justifyContent: 'center', alignItems: 'center', padding: 10,
                                borderRadius: 100, backgroundColor: micOn ? colors.black : 'red'
                            }}
                        >
                            {micOn
                                ? <MicOn fill="white" width={25} height={25} />
                                : <MicOff fill="black" width={25} height={25} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { setVideoOn(!videoOn) }}
                            style={{
                                height: 50, aspectRatio: 1,
                                justifyContent: 'center', alignItems: 'center', padding: 10,
                                borderRadius: 100, backgroundColor: videoOn ? colors.black : 'red'
                            }}
                        >
                            {videoOn
                                ? <VideoOn fill="white" width={25} height={25} />
                                : <VideoOff fill="black" width={25} height={25} />
                            }
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
    const [showDropDown, toggleDropDown] = useState(false)

    const [name, setName] = useState('')
    const [meetingId, setMeetingId] = useState('')
    const [meetingType, setMeetingType] = useState(meetingTypes[0])

    const navigation = useNavigation()

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
                            marginTop: Platform.OS == 'ios' ? isIphoneX() ? wp('-11%') : 5 : 5,
                            width: Dimensions.get('window').width - 100, paddingHorizontal: 16, paddingVertical: 8,
                            borderRadius: 8, elevation: 3, shadowOffset: { width: 0, height: 0 },
                            shadowColor: '#CED2D6', shadowOpacity: 0.15,
                        }}
                        onSelect={(index) => {
                            toggleDropDown(false)
                            setMeetingType(meetingTypes[index.row])
                        }}
                        anchor={() =>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => toggleDropDown(!showDropDown)}
                                style={{
                                    height: 50, justifyContent: "center", alignItems: "center",
                                    backgroundColor: "#4890E0", borderRadius: 12, marginVertical: 12,
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
                            let meetingId = await createMeeting({ token: VIDEO_SDK_TOKEN })

                            disposeVideoTrack()
                            navigation.navigate('MeetingScreen', {
                                name: name.trim(),
                                token: VIDEO_SDK_TOKEN,
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
                                marginTop: Platform.OS == 'ios' ? isIphoneX() ? wp('-11%') : 5 : 5,
                                width: Dimensions.get('window').width - 100, paddingHorizontal: 16, paddingVertical: 8,
                                borderRadius: 8, elevation: 3, shadowOffset: { width: 0, height: 0 },
                                shadowColor: '#CED2D6', shadowOpacity: 0.15,
                            }}
                            onSelect={(index) => {
                                toggleDropDown(false)
                                setMeetingType(meetingTypes[index.row])
                            }}
                            anchor={() =>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => toggleDropDown(!showDropDown)}
                                    style={{
                                        height: 50, justifyContent: "center",
                                        alignItems: "center", backgroundColor: "#4890E0",
                                        borderRadius: 12, marginVertical: 12,
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
                                    token: VIDEO_SDK_TOKEN,
                                    meetingId: meetingId.trim()
                                })

                                if (validMeetingCode) {
                                    disposeVideoTrack()
                                    navigation.navigate('MeetingScreen', {
                                        name: name.trim(),
                                        token: VIDEO_SDK_TOKEN,
                                        meetingId: meetingId.trim(),
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
            title={'Device Audio List'}
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
                                borderRadius: 8, borderWidth: 1, borderColor: '#BBB5B4', marginBottom: 10
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