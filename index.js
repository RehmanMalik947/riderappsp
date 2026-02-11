/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Register Firebase background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

// Register Notifee background event handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the notification
    if (type === EventType.PRESS && pressAction.id === 'default') {
        // Handle notification press in background
        console.log('User pressed the notification in background', notification);
    }
});

AppRegistry.registerComponent(appName, () => App);
