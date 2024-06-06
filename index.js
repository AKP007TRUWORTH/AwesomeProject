/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { register } from '@videosdk.live/react-native-sdk';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

// Register the service
register();

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
