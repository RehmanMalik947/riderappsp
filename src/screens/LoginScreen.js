// LoginScreen.js (no react-native-paper, iOS + Android compatible)
import React, { useState, useEffect } from 'react';
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
  ScrollView,
  Image,
} from 'react-native';
import api, { getCompanySetting } from '../service/api'
import theme from '../theme/theme';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useBranding } from '../context/BrandingContext';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const { branding, updateBranding, theme } = useBranding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);

  const navigation = useNavigation();
  const app = getApp();
  const messaging = getMessaging(app);

  const fetchBranding = async (code) => {
    try {
      const res = await getCompanySetting(code);
      if (res.data) {
        updateBranding(res.data);
      }
    } catch (error) {
      console.log('Branding fetch error:', error?.message || error);
    }
  };

  useEffect(() => {
    if (companyCode.length >= 3) {
      const timer = setTimeout(() => {
        const code = companyCode.trim().toUpperCase();
        if (code === 'RBK' || code === 'ALAMN') {
          fetchBranding(code);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [companyCode]);

  const sendFcmTokenToBackend = async (userId) => {
    try {
      if (!userId) return;
      const fcmToken = await getToken(messaging);
      if (!fcmToken) return;

      const payload = {
        userId,
        token: fcmToken,
        platform: Platform.OS,
        appType: 'rider',
        deviceId: 'string',
        appVersion: 'string',
      };

      await api.post('/FCM/SaveFCMDeviceToken', payload);
    } catch (error) {
      console.log('FCM save error:', error?.message || error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password || !companyCode) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields (Email, Password, and Company Code)',
      });
      return;
    }

    const code = companyCode.trim().toUpperCase();
    let dbName = '';

    if (code === 'RBK') {
      dbName = 'Rubaika';
    } else if (code === 'ALAMN') {
      dbName = 'ALAmin';
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Company Code',
      });
      return;
    }

    setLoading(true);
    const payload = { email: email.trim(), password };

    try {
      // First save the dbName so interceptor can use it if needed for login itself
      // or subsequent calls.
      await AsyncStorage.setItem('x-client-db', dbName);

      // Also ensure branding is fetched before proceeding or as part of login
      await fetchBranding(code);

      const res = await api.post(`/Account/RiderLogin/${code}`, payload);
      const data = res?.data;
      console.log(data);

      if (data) {
        await AsyncStorage.setItem('user', JSON.stringify(data));
        sendFcmTokenToBackend(data.userId);
        navigation.replace('MainTabs');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: msg
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryDark }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoCircle, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                {branding.logoUrl ? (
                  <Image source={{ uri: branding.logoUrl }} style={styles.logoImage} resizeMode="contain" />
                ) : (
                  <Icon name="delivery-dining" size={48} color={theme.colors.white} />
                )}
              </View>
            </View>
            <Text style={styles.title}>{branding.companyName}</Text>
            <Text style={styles.subtitle}>Fast. Secure. Reliable.</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email Address</Text>
              <View style={[
                styles.inputContainer,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                isEmailFocused && { borderColor: theme.colors.primary, backgroundColor: theme.colors.white }
              ]}>
                <Icon
                  name="mail-outline"
                  size={20}
                  color={isEmailFocused ? theme.colors.primary : theme.colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="name@company.com"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  style={[styles.input, { color: theme.colors.text }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.textLight}
                  selectionColor={theme.colors.primary}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password</Text>
              <View style={[
                styles.inputContainer,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                isPasswordFocused && { borderColor: theme.colors.primary, backgroundColor: theme.colors.white }
              ]}>
                <Icon
                  name="lock-outline"
                  size={20}
                  color={isPasswordFocused ? theme.colors.primary : theme.colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  style={[styles.input, { color: theme.colors.text }]}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={theme.colors.textLight}
                  selectionColor={theme.colors.primary}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Icon
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={theme.colors.textLight}
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Company Code</Text>
              <View style={[
                styles.inputContainer,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                isCodeFocused && { borderColor: theme.colors.primary, backgroundColor: theme.colors.white }
              ]}>
                <Icon
                  name="business"
                  size={20}
                  color={isCodeFocused ? theme.colors.primary : theme.colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Company Code"
                  value={companyCode}
                  onChangeText={setCompanyCode}
                  onFocus={() => setIsCodeFocused(true)}
                  onBlur={() => setIsCodeFocused(false)}
                  style={[styles.input, { color: theme.colors.text }]}
                  autoCapitalize="characters"
                  placeholderTextColor={theme.colors.textLight}
                  selectionColor={theme.colors.primary}
                />
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.colors.primary },
                (pressed || loading) && { opacity: 0.9, transform: [{ scale: 0.99 }] },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonText}>Sign In</Text>
                  <Icon name="arrow-forward" size={18} color={theme.colors.white} />
                </View>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  form: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.large,
  },
  inputWrapper: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    marginTop: theme.spacing.sm,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontWeight: '700',
    color: theme.colors.white,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
