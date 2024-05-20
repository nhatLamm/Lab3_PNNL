import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../constants';

const Customer = () => {
  const navigation = useNavigation();
  const [customers, setCustomers] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = firestore()
      .collection('USERS')
      .where('role', '==', 'customer')
      .onSnapshot(querySnapshot => {
        const users = [];
        querySnapshot.forEach(doc => {
          const { name, email, role } = doc.data();
          users.push({
            id: doc.id,
            name,
            email,
            role,
          });
        });
        setCustomers(users);
      });

    return () => unsubscribe();
  }, []);

  const handleCustomerPress = (customerId) => {
    navigation.navigate('CustomerDetail', { customerId });
  };

  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity style={styles.customerContainer} onPress={() => handleCustomerPress(item.id)}>
      <Text style={styles.customerName}>{item.name}</Text>
      <Text style={styles.customerEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách khách hàng</Text>
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={renderCustomerItem}
        contentContainerStyle={styles.flatListContent}
      />
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
  },
  flatListContent: {
    flexGrow: 1,
  },
  customerContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerEmail: {
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default Customer;