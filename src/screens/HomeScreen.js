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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/theme';

const MOCK_ORDERS = [
  { id: 'ORD-1234', customer: 'Imran Shahid', status: 'Pending', items: 3, total: '2500', address: 'DHA Phase 6, Lahore' },
  { id: 'ORD-1235', customer: 'Ali Khan', status: 'Pending', items: 1, total: '800', address: 'Model Town, Lahore' },
  { id: 'ORD-1236', customer: 'Zeeshan Ahmed', status: 'Pending', items: 5, total: '4200', address: 'Gulberg 3, Lahore' },

  { id: 'ORD-1234', customer: 'Imran Shahid', status: 'Pending', items: 3, total: '2500', address: 'DHA Phase 6, Lahore' },
  { id: 'ORD-1235', customer: 'Ali Khan', status: 'Pending', items: 1, total: '800', address: 'Model Town, Lahore' },
  { id: 'ORD-1236', customer: 'Zeeshan Ahmed', status: 'Pending', items: 5, total: '4200', address: 'Gulberg 3, Lahore' },
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
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.id}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.row}>
        <Icon name="location-on" size={18} color={theme.colors.accent} />
        <Text style={styles.infoText}>{item.address}</Text>
      </View>

      {/* Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Icon name="inventory" size={18} color={theme.colors.subText} />
          <Text style={styles.detailText}>{item.items} Items</Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="payments" size={18} color={theme.colors.subText} />
          <Text style={styles.detailText}>Rs. {item.total}</Text>
        </View>
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
    backgroundColor: theme.colors.background,
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
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  infoText: {
    flex: 1,
    color: theme.colors.subText,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: theme.colors.text,
    fontWeight: '700',
  },
});

export default HomeScreen;
