import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  StatusBar,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  // Import SafeAreaView
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/theme';
import api from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]); // Stores fetched orders
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [user, setUser] = useState(); // Stores user data
  const [error, setError] = useState(null); // Stores error message
  
  // Fetch user data from AsyncStorage
  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      console.error('Error fetching user', err);
      setError('Failed to load user data');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  
  const riderId = user?.userId; // Assuming user object contains userId

  // Fetch orders from the API
  const fetchOrders = async () => {
    if (!riderId) return;  // If userId is not available, don't fetch orders
    
    try {
      const response = await api.get(`/Order/GetAllRiderOrders/${riderId}`);
      setOrders(response.data); // Assuming the response contains the orders
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (riderId) {
      fetchOrders();
    }
  }, [riderId]); // Only fetch orders if riderId is available

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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Active Orders</Text>
            <Text style={styles.headerSubtitle}>Available for pickup</Text>
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

  errorText: {
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: 16,
    padding: 20,
  },
});

export default HomeScreen;
