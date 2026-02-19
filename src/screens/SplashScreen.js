import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        // Give time for the app personality to be established
        setTimeout(() => {
          if (user) {
            navigation.replace('MainTabs');
          } else {
            navigation.replace('Login');
          }
        }, 2500);
      } catch (e) {
        navigation.replace('Login');
      }
    };
    checkUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          <Icon name="delivery-dining" size={80} color={theme.colors.primary} />
        </View>
        <Text style={styles.appName}>RIDER FLEET</Text>
        <Text style={styles.tagline}>Powering Logistics for the Future</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.poweredText}>Powered by</Text>
        <Image
          source={require('../assets/spargus_logo.jpeg')}
          style={[styles.companyLogo, { width: width * 0.45 }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};


export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
    marginBottom: 24,
  },
  appName: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  poweredText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  companyLogo: {
    height: 48,
    aspectRatio: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
});

