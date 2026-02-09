import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { theme } from '../theme/theme';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [status, setStatus] = useState(order.status);

  const handleAccept = () => setStatus('Accepted');
  const handleDeliver = () => {
    setStatus('Delivered');
    setTimeout(() => navigation.goBack(), 1200);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>

          <Text style={styles.customerName}>{order.customer}</Text>

          <Text style={styles.infoText}>📍 {order.address}</Text>
          <Text style={styles.infoText}>📞 +92 300 1234567</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Chicken Biryani x 2</Text>
            <Text style={styles.itemText}>Rs. 1200</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Coke 1.5L x 1</Text>
            <Text style={styles.itemText}>Rs. 200</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalAmount}>Rs. {order.total}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          {status === 'Pending' && (
            <Pressable
              onPress={handleAccept}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              style={({ pressed }) => [
                styles.button,
                pressed && Platform.OS === 'ios' && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.buttonText}>Accept Order</Text>
            </Pressable>
          )}

          {status === 'Accepted' && (
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
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.subText,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.text,
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

  customerName: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    color: theme.colors.text,
  },
  infoText: {
    fontSize: 14,
    marginTop: 6,
    color: theme.colors.subText,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  itemText: {
    color: theme.colors.text,
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
