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
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme/theme';
import api from '../service/api'
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const app = getApp();
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
        appType: 'rider',
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
      sendFcmTokenToBackend(data.userId);
      navigation.replace('MainTabs')


      if (data) {
        await AsyncStorage.setItem('user', JSON.stringify(data));
        // setdata(data);

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
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="delivery-dining" size={60} color={theme.colors.accent} />
          </View>
          <Text style={styles.title}>Rider Spargus</Text>
          <Text style={styles.subtitle}>Deliver happiness, earn respect.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color={theme.colors.subText} style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.subText}
              selectionColor={theme.colors.accent}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={theme.colors.subText} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showPassword}
              placeholderTextColor={theme.colors.subText}
              selectionColor={theme.colors.accent}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color={theme.colors.subText} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
            style={({ pressed }) => [
              styles.button,
              (pressed || loading) && { opacity: 0.9 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(79, 142, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#A1A1A1',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#262626',
    padding: 24,
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#333333',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: '#333333',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
