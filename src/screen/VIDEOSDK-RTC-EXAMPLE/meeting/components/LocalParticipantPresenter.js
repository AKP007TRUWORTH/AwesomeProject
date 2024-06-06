import { View, Text } from 'react-native'
import React from 'react'
import { useMeeting } from '@videosdk.live/react-native-sdk'
import colors from '../../styles/colors'
import { ScreenShare } from '../../assets/icons'
import { convertRFValue } from '../../styles/spacing'
import { TouchableOpacity } from 'react-native-gesture-handler'

const LocalParticipantPresenter = () => {
    // const { disableScreenShare } = useMeeting()

    return (
        <View style={{ flex: 3, backgroundColor: colors.primary[800], justifyContent: 'center', borderRadius: 8, margin: 4 }}>
            <View style={{ alignItems: 'center' }}>
                <ScreenShare width={40} height={40} fill={'black'} />
                <Text style={{ color: 'white', fontSize: convertRFValue(14), marginVertical: 12 }}>
                    You are presenting to everyone
                </Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    // disableScreenShare()
                }}
                style={{
                    paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center',
                    backgroundColor: '#5568FE', borderRadius: 12, marginVertical: 12, marginHorizontal: 16,
                }}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>
                    Stop Presenting
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default LocalParticipantPresenter