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
} from 'react-native';
import { theme } from '../theme/theme';
import api from '../service/api'; // Assuming you have the `api` instance already set up

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;  // orderId is passed from the previous screen
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details from the API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/Order/${orderId}`); // Hit the API with the dynamic orderId
        setOrder(response.data); // Assuming the response contains the order data
        setStatus(response.data.orderStatus);
      } catch (err) {
        console.error('Failed to fetch order details', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Fetch details whenever orderId changes

  const handleDeliver = async () => {
    try {
      const status = 4;
       const res = await api.put(`/Order/updateStatus/${orderId}`, { status });
      console.log(res)
      // setStatus('Delivered'); 
      setTimeout(() => navigation.goBack(), 1000); 
    } catch (err) {
      console.error('Failed to update status', err);
      // setError('Failed to mark as delivered');
    }
  };

  // Helper function to format the amount (e.g., Rs. 343.2)
  const formatAmount = (amount) => `Rs. ${amount.toFixed(2)}`;

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.orderNo}>Order No: {order.orderNo}</Text>
          <Text style={[styles.statusText, { color: theme.colors.accent }]}>{status}</Text>
        </View>

        {/* Order Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Information</Text>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Order Date:</Text>
            <Text style={styles.itemText}>{new Date(order.orderDate).toLocaleString()}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Payment Method:</Text>
            <Text style={styles.itemText}>{order.paymentMethod}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Payment Status:</Text>
            <Text style={styles.itemText}>{order.paymentStatus}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Delivery Address:</Text>
            <Text style={styles.itemText}>{order.deliveryAddress}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Order Type:</Text>
            <Text style={styles.itemText}>{order.orderType}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Total Amount:</Text>
            <Text style={styles.totalAmount}>{formatAmount(order.totalAmount)}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          {order.orderLines.map((line, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {line.product ? line.product.name : 'Product Name Not Available'} x {line.quantity}
              </Text>
              <Text style={styles.itemText}>{formatAmount(line.amount)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatAmount(order.totalAmount)}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          {status === 'AssignedToRider' && (
            <Pressable
              onPress={handleDeliver}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              style={({ pressed }) => [
                styles.button,
                styles.deliverButton,
                pressed && Platform.OS === 'ios' && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.buttonText}>Mark as Delivered</Text>
            </Pressable>
          )}
        </View>
      </View>
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
    gap: 16,
  },

  headerCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  orderNo: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.subText,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    color: theme.colors.text,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  itemText: {
    color: theme.colors.text,
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },

  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.accent, // blue
  },

  actionContainer: {
    marginTop: 8,
  },
  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliverButton: {
    backgroundColor: '#10B981', // green
  },
  buttonText: {
    color: theme.colors.primary, // white text
    fontSize: 16,
    fontWeight: '800',
  },
});

export default OrderDetailsScreen;
