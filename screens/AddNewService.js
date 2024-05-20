import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, StyleSheet, Image, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import COLORS from '../constants';
import { createNewService } from '../store'; // Ensure this path is correct

const AddNewService = () => {
  const [service, setService] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const ref = firestore().collection('services');
  const [services, setServices] = useState([]);

  async function addService() {
    if (service.trim() === '') {
      setServiceError('Hãy nhập dịch vụ.');
      return;
    } else {
      setServiceError('');
    }

    if (isNaN(parseFloat(price))) {
      setPriceError('Hãy nhập giá tiền.');
      return;
    } else {
      setPriceError('');
    }

    let imageUrl = '';
    if (imageUri) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const task = storage().ref(filename).putFile(uploadUri);

      try {
        await task;
        imageUrl = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        console.error(e);
      }
    }

    const newService = {
      title: service,
      price: parseFloat(price),
      imageUrl,
    };

    createNewService(newService);

    setService('');
    setPrice('');
    setImageUri(null);
  }

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, price, imageUrl } = doc.data();
        list.push({
          id: doc.id,
          title,
          price,
          imageUrl,
        });
      });
      setServices(list);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Service name*"
            value={service}
            onChangeText={(text) => setService(text)}
            style={styles.textInput}
          />
          <Text style={styles.errorText}>{serviceError}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Price*"
            value={price.toString()}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text) || text === '') {
                setPrice(text);
                setPriceError('');
              } else {
                setPriceError('Chỉ được phép nhập số!!.');
              }
            }}
            keyboardType="numeric"
            style={styles.textInput}
          />
          <Text style={styles.errorText}>{priceError}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Button onPress={selectImage}>Select Image</Button>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : null}
        </View>

        <View>
          <Button
            style={{ backgroundColor: COLORS.pink, width: 100, height: 50, justifyContent: 'center' }}
            contentStyle={{ height: 40 }}
            labelStyle={{ fontSize: 16 }}
            onPress={addService}
          >
            Thêm
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'column',
    marginBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: COLORS.grey,
    height: 50,
    paddingHorizontal: 10,
    width: 390,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
  imagePreview: {
    width: 250,
    height: 250,
    marginTop: 10,
  },
});

export default AddNewService;