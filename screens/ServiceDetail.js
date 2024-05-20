import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute,useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; 
import COLORS from '../constants';

const DetailService = () => {
  const route = useRoute();
  const { title, price, imageUrl, id } = route.params; 
  const navigation = useNavigation();
  const ref = firestore().collection('services').doc(id);

  const [finalUpdate, setFinalUpdate] = useState(null);

  useEffect(() => {
   
    const unsubscribe = ref.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data) {
        setFinalUpdate(data.finalUpdate);
      }
    });

   
    return () => unsubscribe();
  }, [id]); 

  const priceFormat = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.title}>Tên dịch vụ:</Text>
        <Text style={styles.titlefortitle}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.title}>Giá dịch vụ:</Text>
        <Text style={styles.price}>{priceFormat}</Text>
      </View>
      {finalUpdate && finalUpdate.seconds ? (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>Lần cuối cập nhật:</Text>
          <Text style={styles.finalUpdate}>
            {new Date(finalUpdate.seconds * 1000).toLocaleString()}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>Lần cuối cập nhật:</Text>
          <Text style={styles.finalUpdate}>No update info</Text>
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginLeft: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    padding:5
  },
  titlefortitle:{
    fontSize: 16,
    color: 'black',
    padding:5
  },
  price: {
    fontSize: 16,
    color: 'black',
    padding:5,
    marginLeft: 5,
  },
  finalUpdate: {
    fontSize: 16,
    color: 'black',
    padding:5,
    marginLeft: 5,
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default DetailService;