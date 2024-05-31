import { View } from "react-native"
import { isIphoneX } from "../helpers/iPhoneX"
import { Button, Modal, Text } from "@ui-kitten/components"
import * as Updates from 'expo-updates'
import { useState } from "react"

export default () => {
    const [restartRequired, setRestartRequired] = useState(false)

    const checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync()
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync()
                setRestartRequired(true)
            }
        } catch (err) {
            console.log(`Error fetching latest update: ${err}`)
        }
    }

    const UpdateAvailableModal = ({ visible }) => {
        return (
            <Modal
                visible={visible}
                style={{ height: '100%', width: '100%' }}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={{
                        backgroundColor: 'white',
                        paddingVertical: 15, paddingHorizontal: 30,
                        borderTopLeftRadius: 10, borderTopRightRadius: 10
                    }}>
                        <Text style={{
                            color: 'black', fontSize: 18, fontWeight: 'bold', textAlign: 'center',
                            marginTop: 20
                        }}>
                            Update your App in the background
                        </Text>

                        <Text style={{
                            color: '#313131', fontSize: 16, textAlign: 'center', marginTop: 8
                        }}>
                            We have made some changes to improve the
                            app performance. Please update your app to
                            the latest version.
                        </Text>

                        <View style={{
                            flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly',
                            marginBottom: isIphoneX() ? 50 : 20
                        }}>
                            <Button
                                textStyle={{ color: '#44cfb9' }}
                                style={{
                                    backgroundColor: '#44cfb9',
                                    width: '45%',
                                    borderWidth: 0
                                }}
                                onPress={() => {
                                    setRestartRequired(false)
                                    Updates.reloadAsync()
                                }}>
                                Update
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal >
        )
    }

    return { checkForUpdates, UpdateAvailableModal, restartRequired }
}