import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import JoinScreen from './JoinScreen'
import MeetingScreen from './meeting/MeetingScreen'
import { VideoSdkProvider } from './context/VideoSdkContext'

const { Navigator, Screen } = createNativeStackNavigator()

const VideoSdkNavigator = () => {
    return (
        <VideoSdkProvider>
            <Navigator screenOptions={{ headerShown: false }} initialRouteName='JoinScreen'>
                <Screen name="JoinScreen" component={JoinScreen} />
                <Screen name="MeetingScreen" component={MeetingScreen} />
            </Navigator>
        </VideoSdkProvider>
    )
}

export default VideoSdkNavigator