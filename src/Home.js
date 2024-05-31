import { Text, View, Button, Alert } from 'react-native'
import React from 'react'
import * as Updates from 'expo-updates'

const Home = () => {

    const checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync()
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync()
                Alert.alert(
                    'Truworth Wellness',
                    'An update is available. Would you like to install it now?',
                    [
                        { text: 'No' },
                        {
                            text: 'Yes',
                            onPress: () => {
                                Updates.reloadAsync()
                            }
                        },
                    ],
                    { cancelable: false }
                )
            } else {
                Alert.alert(
                    'No update available',
                    'The latest version is already installed on your device.'
                )
            }
        } catch (error) {
            alert(`Error fetching latest update: ${error}`)
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title='Check For Update' onPress={checkForUpdates} />
            <Text style={{ color: 'black', fontSize: 20, fontWeight: '500', marginTop: 20 }}>
                Code push version 1.0 🚀
            </Text>
        </View>
    )
}

export default Home