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
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getFcmToken();
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

    // Background/Quit state notification click
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
      }
    });

    // Notifee background event listener (optional, handles clicks when app is in background/quit)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('Background event received:', type, detail);
    });
  }

  async displayNotification(remoteMessage) {
    const { notification, data } = remoteMessage;
    await notifee.displayNotification({
      title: notification?.title || 'Notification',
      body: notification?.body || '',
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
      data: data || {},
    });
  }
}

export const notificationService = new NotificationService();
