import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MeetingRoom from './MeetingRoom'
import JoinScreen from './JoinScreen'

const { Navigator, Screen } = createNativeStackNavigator()

const VideoSdkNavigator = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }} initialRouteName='HomeScreen'>
            <Screen name="MeetingRoom" component={MeetingRoom} />
            <Screen name="JoinScreen" component={JoinScreen} />
        </Navigator>
    )
}

export default VideoSdkNavigator