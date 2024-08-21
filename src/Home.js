import { Text, View, Alert } from 'react-native'
import * as Updates from 'expo-updates'
import React from 'react'

import { Button } from './screen/VIDEOSDK-RTC-EXAMPLE/components/Button'

const Home = ({ navigation }) => {

    const checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync()
            if (update.isAvailable) {
                return Alert.alert(
                    'Truworth Wellness',
                    'An update is available. Would you like to install it now?',
                    [
                        { text: 'No' },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                await Updates.fetchUpdateAsync()
                                await Updates.reloadAsync()
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
            Alert.alert(
                'No update available',
                'The latest version is already installed on your device.'
            )
        } catch (error) {
            alert(`Error fetching latest update: ${error}`)
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                text='Check For Update'
                onPress={checkForUpdates}
                apperence={'outline'}
            />

            <Text style={{ color: 'black', fontSize: 20, fontWeight: '500', marginVertical: 20 }}>
                Code push version 2.0 🚀
            </Text>

            <Button
                text='Check out the Video SDK Live 🎦 package by clicking here!'
                onPress={() => navigation.navigate('VideoSdkNavigator')}
                apperence={'outline'}
            />
        </View>
    )
}

export default Home