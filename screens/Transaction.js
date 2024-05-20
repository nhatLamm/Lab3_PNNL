import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../constants'

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('history')
      .onSnapshot(querySnapshot => {
        const transactions = [];
        querySnapshot.forEach(documentSnapshot => {
          transactions.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setTransactions(transactions);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Khách hàng: {item.userName}</Text>
      <Text style={styles.itemText}>Tên dịch vụ: {item.serviceName}</Text>
      <Text style={styles.itemText}>Giá: {item.servicePrice}</Text>
      <Text style={styles.itemText}>Ngày đặt: {new Date(item.paymentDate.toDate()).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: COLORS.grey,
    padding: 20,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    padding:10,
  },
});

export default Transaction;