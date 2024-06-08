import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { VideoSdkProvider } from './context/VideoSdkContext'
import MeetingScreen from './meeting/MeetingScreen'
import JoinScreen from './JoinScreen'

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