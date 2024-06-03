import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'
import { StatusBar } from 'react-native'
import Home from './Home'

const { Navigator, Screen } = createNativeStackNavigator()

export const AppNavigator = () => {

    return (
        <Layout style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
            <NavigationContainer>
                <Navigator screenOptions={{ headerShown: false }}>
                    <Screen name="Home" component={Home} />
                </Navigator>
            </NavigationContainer>
        </Layout>
    )
}