import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../constants';

const CustomerDetail = ({ route }) => {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('USERS')
      .doc(customerId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setCustomer(doc.data());
        } else {
          setCustomer(null); // Không tìm thấy người dùng
        }
      });

    return () => unsubscribe();
  }, [customerId]);

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin khách hàng</Text>
      <Text style={styles.detail}>Họ và tên: {customer.name}</Text>
      <Text style={styles.detail}>Email: {customer.email}</Text>
      <Text style={styles.detail}>Địa chỉ: {customer.address}</Text>
      <Text style={styles.detail}>Mật khẩu: {customer.password}</Text>
      <Text style={styles.detail}>Số điện thoại: {customer.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent:'center'
    
  },
  detail: {
    fontSize: 18,
    marginBottom: 20,
    color:COLORS.black,
    fontWeight:'600',
    marginLeft:20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.red,
  },
});

export default CustomerDetail;