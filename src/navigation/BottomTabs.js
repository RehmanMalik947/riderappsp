import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme/theme';

import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/HomeScreen'; // reuse for now
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarIcon: ({ focused }) => {
          let iconName = 'home';

          if (route.name === 'HomeTab') iconName = 'home';
          if (route.name === 'OrdersTab') iconName = 'list-alt';
          if (route.name === 'ProfileTab') iconName = 'person';

          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textLight}
            />
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={[
              styles.label,
              { color: focused ? theme.colors.primary : theme.colors.textLight },
            ]}
          >
            {route.name.replace('Tab', '')}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        initialParams={{ statusFilter: 'Active' }}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={HomeScreen}
        initialParams={{ statusFilter: 'Delivered' }}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    height: 64,
    paddingBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
});

export default BottomTabs;
