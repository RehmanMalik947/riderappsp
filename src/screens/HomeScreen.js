import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  // Import SafeAreaView
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/theme';
import api from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
  const { statusFilter = 'Active' } = route.params || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error('Error fetching user', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const riderId = user?.userId;

  const fetchOrders = async (showLoading = true) => {
    if (!riderId) return;
    if (showLoading) setLoading(true);
    console.log(riderId)

    try {
      const response = await api.get(`/Order/GetAllRiderOrders/${riderId}`);
      console.log(response)
      if (response.data) {
        // Filter orders based on statusFilter
        const filtered = response.data.filter(order => {
          if (statusFilter === 'Active') {
            return order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';
          }
          return order.orderStatus === 'Delivered';
        });
        setOrders(filtered);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (riderId) {
      fetchOrders();

      // Implement 1-minute polling
      const interval = setInterval(() => {
        console.log('Refreshing orders (polling)...');
        fetchOrders(false); // Don't show full-screen loader during polling
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [riderId, statusFilter]);

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
        <Text style={styles.orderNo}>Order No: {item.orderNo}</Text>
        <View style={[styles.badge, { backgroundColor: item.orderStatus === 'Accepted' ? theme.colors.primary : theme.colors.secondary }]}>
          <Text style={styles.badgeText}>{item.orderStatus}</Text>
        </View>
      </View>

      {/* Product Image and Name */}
      <View style={styles.row}>
        {item.orderLines[0]?.product?.image && (
          <Image source={{ uri: item.orderLines[0].product.image }} style={styles.productImage} />
        )}
        <Text style={styles.productName}>{item.orderLines[0]?.product?.name}</Text>
      </View>

      {/* Delivery Address */}
      <View style={styles.row}>
        <Icon name="location-on" size={18} color={theme.colors.accent} />
        <Text style={styles.infoText}>{item.deliveryAddress}</Text>
      </View>

      {/* Payment and Total Amount */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Icon name="payment" size={18} color={theme.colors.subText} />
          <Text style={styles.detailText}>Payment: {item.paymentMethod}</Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="attach-money" size={18} color={theme.colors.subText} />
          <Text style={styles.detailText}>Total: Rs. {item.totalAmount}</Text>
        </View>
      </View>
    </Pressable>
  );

  // Loading or error handling UI
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onRefresh={() => fetchOrders(false)}
        refreshing={isRefreshing}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {statusFilter === 'Active' ? 'Active Orders' : 'Order History'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {statusFilter === 'Active'
                ? 'Orders available for pickup & delivery'
                : 'Your completed deliveries'}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>No {statusFilter.toLowerCase()} orders found</Text>
          </View>
        )}
      />
    </SafeAreaView>
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
  orderNo: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
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

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.subText,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: 16,
    padding: 20,
  },
});

export default HomeScreen;
