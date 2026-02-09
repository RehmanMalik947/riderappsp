// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/theme';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    // clear auth later (AsyncStorage / token)
    navigation.replace('Login');
  };

  const Row = ({ icon, title, value, onPress }) => {
    const content = (
      <View style={styles.rowContent}>
        <View style={styles.rowLeft}>
          <View style={styles.iconBox}>
            <Icon name={icon} size={20} color={theme.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{title}</Text>
            {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          </View>
        </View>
        <Icon name="chevron-right" size={22} color={theme.colors.subText} />
      </View>
    );

    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={({ pressed }) => [
          styles.row,
          Platform.OS === 'ios' && pressed && { opacity: 0.85 },
        ]}
      >
        {content}
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Icon name="person" size={34} color={theme.colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Imran Shahid</Text>
          <Text style={styles.sub}>Rider Partner</Text>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>Rs. 4,800</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>

        <Row
          icon="call"
          title="Phone Number"
          value="+92 300 1234567"
          onPress={() => {}}
        />
        <Row
          icon="email"
          title="Email"
          value="rider@spargus.com"
          onPress={() => {}}
        />
        <Row
          icon="location-on"
          title="City"
          value="Lahore"
          onPress={() => {}}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Row icon="notifications" title="Notifications" value="On" onPress={() => {}} />
        <Row icon="security" title="Privacy & Security" onPress={() => {}} />
        <Row icon="help-outline" title="Help & Support" onPress={() => {}} />
      </View>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={({ pressed }) => [
          styles.logoutBtn,
          Platform.OS === 'ios' && pressed && { opacity: 0.85 },
        ]}
      >
        <Icon name="logout" size={18} color={theme.colors.primary} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // white
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 16,
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.text,
  },
  sub: {
    marginTop: 2,
    color: theme.colors.subText,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontWeight: '800',
    color: theme.colors.text,
    fontSize: 12,
  },

  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.subText,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.text,
    marginBottom: 6,
  },

  row: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(79,142,247,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: {
    fontWeight: '900',
    color: theme.colors.text,
  },
  rowValue: {
    marginTop: 2,
    fontWeight: '700',
    color: theme.colors.subText,
  },

  logoutBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
});

export default ProfileScreen;
