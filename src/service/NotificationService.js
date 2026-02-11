import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
    async initialize() {
        await this.requestPermission();
        this.createDefaultChannel();
        this.setupListeners();
    }

    async requestPermission() {
        // Request FCM permission
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('FCM Authorization status:', authStatus);
            this.getFcmToken();
        }

        // Request Notifee permission (essential for Android 13+)
        try {
            await notifee.requestPermission();
        } catch (error) {
            console.log('Notifee permission request error:', error);
        }
    }

    async getFcmToken() {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('FCM Token:', fcmToken);
                // You can send this token to your server here
            }
        } catch (error) {
            console.log('Error getting FCM token:', error);
        }
    }

    async createDefaultChannel() {
        if (Platform.OS === 'android') {
            await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
                importance: AndroidImportance.HIGH,
            });
        }
    }

    setupListeners() {
        // Foreground notifications
        messaging().onMessage(async remoteMessage => {
            console.log('Foreground message received:', remoteMessage);
            this.displayNotification(remoteMessage);
        });

        // Background/Quit state notification click (FCM)
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage);
        });

        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage);
            }
        });
    }

    async displayNotification(remoteMessage) {
        const { notification, data } = remoteMessage;

        // Build notification content even if 'notification' object is missing (data-only payload)
        const title = notification?.title || data?.title || 'New Message';
        const body = notification?.body || data?.body || 'You have a new update';

        await notifee.displayNotification({
            title: title,
            body: body,
            android: {
                channelId: 'default',
                pressAction: {
                    id: 'default',
                },
                // Display app icon if available, or a generic one
                smallIcon: 'ic_launcher',
                importance: AndroidImportance.HIGH,
            },
            data: data || {},
        });
    }
}

export const notificationService = new NotificationService();
