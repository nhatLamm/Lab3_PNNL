import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { List, Menu } from 'react-native-paper';
import COLORS from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '.'; // Import context

const Service = ({ id, title, price, imageUrl }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const truncateTitle = (title) => {
    const maxLength = 90;
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const isAdmin = userLogin?.role === 'admin'; // Check if userLogin exists and its role is admin
  const isCustomer = userLogin?.role === 'customer'; // Check if userLogin exists and its role is customer

  return (
    <TouchableOpacity onPress={openMenu}>
      <View style={styles.container}>
        <View style={styles.left}>
          <List.Item
            title={truncateTitle(title)}
            titleStyle={styles.title}
          />
        </View>
        {price !== undefined && price !== null && (
          <View style={styles.right}>
            <Text style={styles.price}>{formatPrice(price)}</Text>
          </View>
        )}
        {userLogin && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Text style={styles.menuAnchor}>...</Text>}
          >
            {userLogin.role === 'admin' ? (
              <>
                <Menu.Item
                  onPress={() => { 
                    navigation.navigate('UpdateService', {id, title, price, imageUrl});
                    closeMenu();
                  }}
                  title="Update Service"
                />
                <Menu.Item
                  onPress={() => {
                    navigation.navigate('ServiceDetail', {id, title, price, imageUrl});
                    closeMenu();
                  }}
                  title="Detail Service"
                />
              </>
            ) : (
              <Menu.Item
              onPress={() => {
                navigation.navigate('ConfirmOrder', { serviceName: title, servicePrice: price });
                closeMenu();
              }}
              title="Confirm"
            />
            )}
          </Menu>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  menuAnchor: {
    fontSize: 16,
    color: COLORS.grey,
    paddingRight: 10,
  },
});

export default Service;