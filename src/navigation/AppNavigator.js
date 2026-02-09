import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import OrderDetailsScreen from '../screens/OrderDetailScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main App with Tabs */}
        <Stack.Screen name="MainTabs" component={BottomTabs} />

        {/* Details (no bottom tab) */}
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
