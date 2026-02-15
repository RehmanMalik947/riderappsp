import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  const Row = ({ icon, title, value, onPress, isLast = false, color = theme.colors.primary }) => {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
        style={({ pressed }) => [
          styles.row,
          pressed && Platform.OS === 'ios' && { opacity: 0.7 },
        ]}
      >
        <View style={styles.rowContent}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBox, { backgroundColor: color + '12' }]}>
              <Icon name={icon} size={20} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{title}</Text>
              {value && <Text style={styles.rowValue}>{value}</Text>}
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
        </View>
        {!isLast && <View style={styles.rowDivider} />}
      </Pressable>
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Icon name="person" size={40} color={theme.colors.white} />
            </View>
            <View style={styles.onlineIndicator} />
          </View>

          <Text style={styles.userName}>{user.userName || 'Rider'}</Text>
          <Text style={styles.userRole}>Verified Logistics Partner</Text>

          {/* <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
          </View> */}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ACCOUNT DETAILS</Text>
          <View style={styles.rowCard}>
            <Row
              icon="phone-iphone"
              title="Phone"
              value={user.phoneNumber || 'Not provided'}
              onPress={() => { }}
            />
            <Row
              icon="alternate-email"
              title="Work Email"
              value={user.userEmail || 'Not provided'}
              onPress={() => { }}
              isLast={true}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.rowCard}>
            <Row icon="notifications-none" title="Notifications" value="Enabled" onPress={() => { }} />
            <Row
              icon="security"
              title="Privacy & Safety"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            <Row
              icon="help-outline"
              title="Help Center"
              onPress={() => { }}
              isLast={true}
            />
          </View>
        </View>

        {/* Actions */}
        <Pressable
          onPress={handleLogout}
          android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
        >
          <Icon name="logout" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.versionText}>Version 1.0.4 (Stable)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.success,
    borderWidth: 4,
    borderColor: theme.colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  userRole: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.small,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  vDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textLight,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
  },
  rowCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: theme.spacing.lg,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  rowValue: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginLeft: 56,
  },
  logoutButton: {
    height: 56,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.error + '10',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.error + '20',
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
});

export default ProfileScreen;
