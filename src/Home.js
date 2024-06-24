import { Text, View, Alert } from 'react-native'
import { Button } from '@ui-kitten/components'
import React from 'react'
import * as Updates from 'expo-updates'

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
                activeOpacity={0.8}
                onPress={checkForUpdates}
            >
                Check For Update
            </Button>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: '500', marginVertical: 20 }}>
                Code push version 2.0 🚀
            </Text>

            <Button
                style={{ marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('VideoSdkNavigator')}
            >
                Check out the Video SDK Live 🎦 package by clicking here!
            </Button>
        </View >
    )
}

export default Home