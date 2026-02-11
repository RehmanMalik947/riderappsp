// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AppNavigator'); // Directs to the main navigation stack after splash
    }, 3000); // 3 seconds for splash screen
    return () => clearTimeout(timer);
  }, [navigation]);

  // Responsive sizes
  const shortest = Math.min(width, height);
  const appLogoWidth = Math.min(shortest * 0.55, 320); // cap for tablets
  const companyLogoWidth = Math.min(width * 0.5, 260);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
      />
      <View style={styles.container}>
        {/* Main App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={[styles.appLogo, { width: appLogoWidth }]}
            resizeMode="contain"
          />
        </View>

        {/* Powered by */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <Text style={styles.poweredText} allowFontScaling>
            Powered by
          </Text>
          <Image
            source={require('../assets/spargus_logo.jpeg')}
            style={[styles.companyLogo, { width: companyLogoWidth }]}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF', // visible behind translucent status bar
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogo: {
    aspectRatio: 1.2, // square logo keeps shape on all screens
    height: undefined,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  poweredText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 1,
  },
  companyLogo: {
    height: undefined,
    aspectRatio: 4.2, // ~width:height for your Spargus banner; tweak if needed
  },
});
