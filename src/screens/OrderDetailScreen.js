import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme/theme';
import api from '../service/api';
import { useBranding } from '../context/BrandingContext';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { theme } = useBranding();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/Order/${orderId}`);
        setOrder(response.data);
        console.log(response.data);
        setStatus(response.data.orderStatus);
      } catch (err) {
        Alert.alert(err);
        console.error('Failed to fetch order details', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleDeliver = async () => {
    try {
      await api.put(`/Order/updateStatus/${orderId}`, '4', {
        headers: {
          'Content-Type': 'application/json-patch+json',
          'Accept': '*/*'
        }
      });

      setStatus('Delivered');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to mark as delivered');
    }
  };

  const formatAmount = (amount) => `Rs. ${amount?.toLocaleString()}`;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="error-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>{error || 'Order not found'}</Text>
        <Pressable style={[styles.backButton, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: theme.colors.white }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isDelivered = status === 'Delivered' || status === 'Completed' || status === 4;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Order Details</Text>
        <View style={styles.iconButtonSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statusInfo}>
            <Text style={[styles.orderLabel, { color: theme.colors.textLight }]}>ORDER NO</Text>
            <Text style={[styles.orderNo, { color: theme.colors.text }]}>#{order.orderNo}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isDelivered ? theme.colors.success + '15' : theme.colors.info + '15' }
          ]}>
            <Text style={[
              styles.statusBadgeText,
              { color: isDelivered ? theme.colors.success : theme.colors.info }
            ]}>
              {status === 'AssignedToRider' ? 'Processing' : status}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: 'rgba(0,0,0,0.03)' }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Information</Text>

          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrapper, { backgroundColor: theme.colors.primary + '10' }]}>
              <Icon name="person" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Customer Name</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{order?.customer?.name}</Text>
            </View>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: theme.colors.surfaceSecondary }]} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrapper, { backgroundColor: theme.colors.primary + '10' }]}>
              <Icon name="phone" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Customer Phone</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{order?.customer?.phoneNumber}</Text>
            </View>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: theme.colors.surfaceSecondary }]} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrapper, { backgroundColor: theme.colors.primary + '10' }]}>
              <Icon name="calendar-today" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Order Date</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>

          <View style={[styles.infoDivider, { backgroundColor: theme.colors.surfaceSecondary }]} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrapper, { backgroundColor: theme.colors.primary + '10' }]}>
              <Icon name="location-on" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Delivery Address</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{order.deliveryAddress}</Text>
            </View>
          </View>

          <View style={[styles.infoDivider, { backgroundColor: theme.colors.surfaceSecondary }]} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrapper, { backgroundColor: theme.colors.primary + '10' }]}>
              <Icon name="payment" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>Payment</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>({order.paymentStatus})</Text>
            </View>
          </View>
        </View>

        {/* Items Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: 'rgba(0,0,0,0.03)' }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Order Summary</Text>
          {order.orderLines.map((line, index) => (
            <View key={index}>
              <View style={styles.itemRow}>
                <View style={styles.itemMain}>
                  <Text style={[styles.itemName, { color: theme.colors.text }]}>{line.product?.name || 'Package'}</Text>
                  <Text style={[styles.itemQty, { color: theme.colors.textSecondary }]}>Qty: {line.quantity}</Text>
                </View>
                <Text style={[styles.itemPrice, { color: theme.colors.text }]}>{formatAmount(line.amount)}</Text>
              </View>
              {index < order.orderLines.length - 1 && <View style={[styles.itemDivider, { backgroundColor: theme.colors.surfaceSecondary }]} />}
            </View>
          ))}

          <View style={[styles.totalSection, { borderTopColor: theme.colors.surfaceSecondary }]}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Payable</Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>{formatAmount(order.totalAmount)}</Text>
          </View>
        </View>

        {status === 'AssignedToRider' && (
          <Pressable
            onPress={handleDeliver}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.colors.success },
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Icon name="check-circle" size={20} color={theme.colors.white} />
            <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>Mark as Delivered</Text>
          </Pressable>
        )}

        <View style={{ height: 40 }} />
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
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  backButtonText: {
    color: theme.colors.white,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  iconButtonSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  statusInfo: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textLight,
    letterSpacing: 1,
  },
  orderNo: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
    lineHeight: 20,
  },
  infoDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    marginVertical: theme.spacing.md,
    marginLeft: 48,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  itemMain: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  itemQty: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  itemDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 2,
    borderTopColor: theme.colors.surfaceSecondary,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  actionButton: {
    marginTop: theme.spacing.sm,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.success,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...theme.shadows.medium,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderDetailsScreen;
