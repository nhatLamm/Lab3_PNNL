import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { payConfirm } from '../store';
import { useMyContextController } from '../store'; // Import Context

const ConfirmOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceName, servicePrice } = route.params; // Lấy thông tin dịch vụ từ params

  const [controller] = useMyContextController();
  const { userLogin } = controller;; // Lấy thông tin người dùng từ Context

  const [confirming, setConfirming] = useState(false); // Trạng thái xác nhận

  const userName = userLogin ? userLogin.name : "Tên người dùng mẫu"; // Lấy userName từ userLogin

  const handleConfirm = async () => {
    try {
      setConfirming(true); // Đang xác nhận

      // Thực hiện thanh toán và thêm dữ liệu vào bảng history
      const paymentSuccess = await payConfirm(userName, serviceName, servicePrice);

      if (paymentSuccess) {
        // Thanh toán thành công, có thể thực hiện các hành động sau thanh toán ở đây
        console.log('Thanh toán thành công!');
        // Chuyển đến màn hình xác nhận thành công
        navigation.navigate('Home');
      } else {
        // Xảy ra lỗi trong quá trình thanh toán
        console.log('Thanh toán thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
    } finally {
      setConfirming(false); // Kết thúc xác nhận
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dịch vụ:</Text>
      <Text style={styles.text}>{serviceName}</Text>
      <Text style={styles.label}>Giá dịch vụ:</Text>
      <Text style={styles.text}>{servicePrice}</Text>
      <Button
        title={confirming ? "Đang xác nhận..." : "Xác nhận"}
        onPress={handleConfirm}
        disabled={confirming} // Nút xác nhận sẽ bị vô hiệu hóa trong quá trình xác nhận
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ConfirmOrder;