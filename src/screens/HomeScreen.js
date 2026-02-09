// HomeScreen.js
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import { theme } from '../theme/theme';

const MOCK_ORDERS = [
  { id: 'ORD-1234', customer: 'Imran Shahid', status: 'Pending', items: 3, total: '2500', address: 'DHA Phase 6, Lahore' },
  { id: 'ORD-1235', customer: 'Ali Khan', status: 'Pending', items: 1, total: '800', address: 'Model Town, Lahore' },
  { id: 'ORD-1236', customer: 'Zeeshan Ahmed', status: 'Pending', items: 5, total: '4200', address: 'Gulberg 3, Lahore' },
];

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        styles.card,
        Platform.OS === 'ios' && pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.id}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.infoText}>{item.address}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>{item.items} Items</Text>
        <Text style={styles.detailText}>Rs. {item.total}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <FlatList
        data={MOCK_ORDERS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Active Orders</Text>
            <Text style={styles.headerSubtitle}>Available for pickup</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // WHITE
  },
  listContent: {
    padding: 16,
  },

  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.text,
  },
  headerSubtitle: {
    marginTop: 6,
    color: theme.colors.subText,
  },

  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
  },

  badge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: theme.colors.primary, // white text on blue
    fontWeight: '800',
    fontSize: 12,
  },

  infoText: {
    color: theme.colors.subText,
    marginBottom: 14,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  detailText: {
    color: theme.colors.text,
    fontWeight: '700',
  },
});

export default HomeScreen;
