// LoginScreen.js (no react-native-paper, iOS + Android compatible)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
} from 'react-native';
import { theme } from '../theme/theme';
import api from '../service/api'
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data , setdata] = useState();
      const app = getApp();
      const navigation = useNavigation();
    const messaging = getMessaging(app);

   const sendFcmTokenToBackend = async (userId) => {
  try {
    if (!userId) {
      console.log('userId missing, skipping FCM save');
      return;
    }

    const fcmToken = await getToken(messaging);
    if (!fcmToken) {
      console.log('FCM token empty, skipping FCM save');
      return;
    }

    const payload = {
      userId,
      token: fcmToken,
      platform: Platform.OS,
      appType: 'customer',
      deviceId: 'string',
      appVersion: 'string',
    };

    console.log('FCM payload:', payload);
    await api.post('/FCM/SaveFCMDeviceToken', payload);
    console.log('FCM token sent to backend successfully');
  } catch (error) {
    console.log('FCM save error status:', error?.response?.status);
    console.log('FCM save error data:', error?.response?.data);
    console.log('FCM save error:', error?.message || error);
  }
};

const handleLogin = async () => {
  const payload = { email: email.trim(), password };
  
  try {
    const res = await api.post('/Account/Login', payload);
    console.log('Response:', res);
    const data = res?.data;
    
    if (data) {
      await AsyncStorage.setItem('user', JSON.stringify(data));
      setdata(data);
      sendFcmTokenToBackend(data.userId)
      navigation.replace('MainTabs')
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error response:', error.response);
      alert('Error: ' + error.response?.data?.message || 'Unknown error');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      alert('Network error, please try again later.');
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
      alert('Error: ' + error.message);
    }
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Cross-platform safe status bar styling */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.black} // Android
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Rider Spargus</Text>
          <Text style={styles.subtitle}>Welcome back, Partner!</Text>
        </View>
        {/* <Text>{data}</Text> */}

        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.muted}
            selectionColor={theme.colors.primary}
            textContentType="emailAddress"
            autoComplete="email"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor={theme.colors.muted}
            selectionColor={theme.colors.primary}
            textContentType="password"
            autoComplete="password"
          />

          <Pressable
            onPress={handleLogin}
            android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
            style={({ pressed }) => [
              styles.button,
              Platform.OS === 'ios' && pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black, // #0B0B0B
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    color: theme.colors.primary, // #4F8EF7
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
    color: theme.colors.white,
  },
  form: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: theme.colors.white,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // needed for android ripple to clip to radius
  },
  buttonText: {
    fontWeight: '800',
    color: theme.colors.white,
    fontSize: 16,
  },
});

export default LoginScreen;
