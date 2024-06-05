import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import JoinScreen from './JoinScreen'
import MeetingScreen from './MeetingScreen'

const { Navigator, Screen } = createNativeStackNavigator()

const VideoSdkNavigator = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }} initialRouteName='HomeScreen'>
            <Screen name="JoinScreen" component={JoinScreen} />
            <Screen name="MeetingScreen" component={MeetingScreen} />
        </Navigator>
    )
}

export default VideoSdkNavigator