import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Layout } from '@ui-kitten/components'
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView'
import { CameraSwitch, MicOff, MicOn, Speaker, VideoOff, VideoOn } from './assets/icons'
import { createCameraVideoTrack, RTCView, useMediaDevice } from '@videosdk.live/react-native-sdk'
import { useFocusEffect } from '@react-navigation/native'
import colors from './styles/colors'
import Button from './components/Button'

const JoinScreen = () => {
    const [audioListVisible, showAudioListVisible] = useState(false)
    const [videoOn, setVideoOn] = useState(false)
    const [micOn, setMicOn] = useState(false)

    const [tracks, setTrack] = useState("")
    const [facingMode, setFacingMode] = useState("user")


    const [audioList, setAudioList] = useState([])

    const { getAudioDeviceList } = useMediaDevice()


    useFocusEffect(
        useCallback(() => {
            getTrack()
        }, [])
    )

    useEffect(() => {
        getTrack()
    }, [facingMode])


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

    const fetchAudioDevices = async () => {
        const devices = await getAudioDeviceList();
        setAudioList(devices);
    }

    const disposeVideoTrack = () => {
        setTrack((stream) => {
            stream.getTracks().forEach((track) => {
                track.enabled = false
                return track
            })
        })
    }

    const handleAudioButtonPress = async () => {
        await fetchAudioDevices()
        toggleAudioList()

    }

    const handleCameraButtonPress = async () => {
        try {


        } catch (error) {

        }
    }

    if (!tracks) return null

    return (
        <Layout style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <CustomKeyboardAvoidingView
                behavior={Platform.OS == "ios" ? 'padding' : null}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                >
                    <View style={{
                        flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center',
                        padding: 16, gap: 8
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleAudioButtonPress}
                        >
                            <Speaker fill="black" width={25} height={25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleCameraButtonPress}
                        >
                            <CameraSwitch fill="black" width={25} height={25} />
                        </TouchableOpacity>
                    </View>

                    <RTCViewComponent {...{
                        videoOn, micOn, tracks, setVideoOn, setMicOn
                    }} />

                    <BottomViewComponent />

                </ScrollView>
            </CustomKeyboardAvoidingView>
        </Layout >
    )
}

const RTCViewComponent = ({ videoOn, micOn, tracks, setVideoOn, setMicOn }) => {

    return (
        <View style={{ height: '70%', paddingTop: '5%' }}>
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

const BottomViewComponent = () => {
    return (
        <View style={{ marginHorizontal: 32, marginTop: 28 }}>
            <Button text={"Create Meeting"} />
            <Button text={"Join Meeting"} />
        </View>
    )
}

export default JoinScreen