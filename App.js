import { Alert, Button, Text, View } from 'react-native'
import * as Updates from 'expo-updates'
import React from 'react'

const App = () => {

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        Alert.alert('Truworth Wellness',
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
        Alert.alert('No update available')
      }
    } catch (error) {
      alert(`Error fetching latest update: ${error}`)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title='Check For Update' onPress={checkForUpdates} />
      <Text style={{ color: 'black', fontSize: 20, fontWeight: '500', marginTop: 20 }}>
        New Update from version 5.0 to 6.1
      </Text>
    </View>
  )
}

export default App