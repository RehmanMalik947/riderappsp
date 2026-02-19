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
import theme from '../theme/theme';
import api from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useBranding } from '../context/BrandingContext';

const HomeScreen = ({ navigation, route }) => {
  const { branding, theme } = useBranding();
  const { statusFilter = 'Active' } = route.params || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused(); // Fixed typo isfocussed to isFocused

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
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

    try {
      const response = await api.get(`/Order/GetAllRiderOrders/${riderId}`);
      if (response.data) {
        const filtered = response.data.filter(order => {
          const orderDate = new Date(order.orderDate);
          const isToday = orderDate.toDateString() === new Date().toDateString();

          if (statusFilter === 'Active') {
            // Only show cancelled orders if they are from today
            if (order.orderStatus === 'Cancelled') {
              return isToday;
            }
            return order.orderStatus !== 'Completed' && order.orderStatus !== 5;
          }
          return order.orderStatus === 'Completed';
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
    if (isFocused) {
      fetchOrders();
    }
  }, [isFocused]);

  useEffect(() => {
    if (riderId) {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders(false);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [riderId, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AssignedToRider': return theme.colors.info;
      case 'Delivered':
      case 'Completed': return theme.colors.success;
      case 'Cancelled': return theme.colors.error;
      default: return theme.colors.info;
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: 'rgba(0,0,0,0.03)' },
        Platform.OS === 'ios' && pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.orderLabel, { color: theme.colors.textLight }]}>ORDER NO</Text>
          <Text style={[styles.orderNo, { color: theme.colors.text }]}>#{item.orderNo}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.orderStatus) + '20' }]}>
          <Text style={[styles.badgeText, { color: getStatusColor(item.orderStatus) }]}>
            {item.orderStatus}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.surfaceSecondary }]} />

      <View style={styles.infoSection}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '10' }]}>
            <Icon name="location-pin" size={18} color={theme.colors.primary} />
          </View>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]} numberOfLines={2}>{item.deliveryAddress}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            {/* <Icon name="payments" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.paymentMethod}</Text> */}
          </View>

          <View style={[styles.priceBadge, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Text style={[styles.priceText, { color: theme.colors.text }]}>Rs. {item.totalAmount}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.viewButton, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.viewButtonText, { color: theme.colors.white }]}>View Details</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.white} />
      </View>
    </Pressable>
  );

  if (loading && !isRefreshing) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Fetching your orders...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
            <View style={styles.headerTop}>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                {statusFilter === 'Active' ? 'Incoming Orders' : 'Order History'}
              </Text>
              {statusFilter === 'Active' && branding.logoUrl && (
                <View style={styles.logoHeaderWrapper}>
                  <Image source={{ uri: branding.logoUrl }} style={styles.companyLogoHeader} resizeMode="contain" />
                </View>
              )}
            </View>
            <View style={styles.headerDetail}>
              <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                {statusFilter === 'Active'
                  ? `${orders.filter((e) => e.orderStatus === 'AssignedToRider').length} orders pending delivery`
                  : `You've completed ${orders.length} deliveries`}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surfaceSecondary }]}>
              <Icon name="auto-awesome-motion" size={48} color={theme.colors.textLight} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>All caught up!</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No {statusFilter.toLowerCase()} orders at the moment.</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  logoHeaderWrapper: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    padding: 6,
    // ...theme.shadows.small,
    // borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  companyLogoHeader: {
    width: '100%',
    height: '100%',
  },
  headerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
    marginRight: 8,
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  orderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textLight,
    letterSpacing: 1,
  },
  orderNo: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    marginVertical: theme.spacing.sm,
  },
  infoSection: {
    marginVertical: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  priceBadge: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  viewButton: {
    marginTop: theme.spacing.md,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    ...theme.shadows.small,
  },
  viewButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: 15,
    padding: 24,
    fontWeight: '600',
  },
});

export default HomeScreen;
