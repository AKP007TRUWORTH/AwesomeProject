import { Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import JoiningAnimation from '../../assets/animation/joining_lottie.json'
import { convertRFValue } from '../../styles/spacing'
import colors from '../../styles/colors'

const WaitingToJoinView = () => {
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <LottieView
                source={JoiningAnimation}
                autoPlay
                loop
                style={{ width: 50, height: 20 }}
            />

            <Text style={{ fontSize: convertRFValue(18), color: 'black', marginTop: 28 }}>
                Creating a room....
            </Text>
        </View>
    )
}

export default WaitingToJoinView

