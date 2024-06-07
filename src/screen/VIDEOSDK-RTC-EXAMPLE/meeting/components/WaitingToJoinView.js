import React from 'react'
import { Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import JoiningAnimation from '../../assets/animation/joining_lottie.json'

const WaitingToJoinView = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                loop
                autoPlay
                source={JoiningAnimation}
                style={{ width: 50, height: 20 }}
            />

            <Text style={{ fontSize: 18, color: 'black', marginTop: 28 }}>
                Creating a room....
            </Text>
        </View>
    )
}

export default WaitingToJoinView

