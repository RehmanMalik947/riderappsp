// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import SplashScreen from '../screens/SplashScreen';  // Your splash screen
import LoginScreen from '../screens/LoginScreen'; // Login Screen
import OrderDetailsScreen from '../screens/OrderDetailScreen'; // Order Details Screen
import BottomTabs from './BottomTabs';  // Bottom navigation (MainTabs)

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setInitialRoute('MainTabs'); // If user is logged in, go to MainTabs
        } else {
          setInitialRoute('Login'); // Otherwise, go to Login screen
        }
      } catch (e) {
        console.error('Failed to check user status', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {/* Add Splash screen as the first screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Stack screen for Login if not logged in */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* MainTabs for logged-in users */}
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        
        {/* Order Details Screen */}
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
