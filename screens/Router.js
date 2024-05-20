import 'react-native-gesture-handler';
import React from 'react';
import { Alert } from 'react-native';
import { useMyContextController ,deleteService} from '../store';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Login from './Login';
import Customer from './Customer';
import Admin from './Admin';
import COLORS from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome'
import Register from './Register';
import Setting from './Setting';
import AddNewService from './AddNewService';
import UpdateService from './UpdateService';
import DetailService from './ServiceDetail';
import CustomerDetail from './CustomerDetail';
import Transaction from './Transaction'
import ConfirmOrder from './ConfirmOrder'
import { useNavigation, useRoute } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const AdminScreens = () => {

    const handleDelete = (id, navigation) => {
        Alert.alert(
          'Confirmation',
          'Are you sure to delete this service?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                await deleteService(id);
                console.log(`Deleting service with id: ${id}`);
                navigation.goBack();
              },
            },
          ],
          { cancelable: false }
        );
      };
    return (
        <Stack.Navigator
           
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                headerTitleAlign: 'center',
                
            }}
        >
            <Stack.Screen name="Home" component={Admin} options={{ headerShown: false }} />
            <Stack.Screen name="UpdateService" component={UpdateService}  />
            <Stack.Screen name="ServiceDetail" component={DetailService}
                 options={({ navigation, route }) => ({
                    headerRight: () => (
                        <Icon
                        name="ellipsis-v"
                        size={22}
                        color="white"
                        style={{ marginRight: 15 }}
                        onPress={() => handleDelete(route.params?.id, navigation)}
                        />
                    ),
                    headerStyle: {
                        backgroundColor: COLORS.pink,
                    },
                    headerTintColor: 'white',
                    })}
            
             />
            <Stack.Screen name="AddNewService" component={AddNewService} 
              
            />
            <Stack.Screen name="ConfirmOrder" component={ConfirmOrder}/>
        </Stack.Navigator>
    );
}

const CustomerScreens = () => {
    return (
        <Stack.Navigator
            
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Customers" component={Customer} options={{ headerShown: true }} />
            <Stack.Screen name="CustomerDetail" component={CustomerDetail}/>
            
        </Stack.Navigator>
    );
}


const SettingScreens = () => {
    return (
        <Stack.Navigator
            
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                
            }}
        >
            <Stack.Screen name="SettingScreen" component={Setting} options={{ headerShown: true }} />
        </Stack.Navigator>
    );
}

const Router = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <>
            {userLogin ? (
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        tabBarActiveTintColor: COLORS.pink,
                        headerShown: false,
                        tabBarShowLabel: true
                    }}
                >
                    {userLogin.role === 'admin' ? (
                        <>
                            <Tab.Screen
                                name="Admin"
                                component={AdminScreens}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon name="home" color={color} size={size} />
                                    ),
                                    title: "Home"
                                }}
                            />
                            <Tab.Screen
                                name="Transaction"
                                component={Transaction}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon name="money" color={color} size={size} />
                                    ),
                                    title: 'Transaction',
                                    headerShown:true,
                                    headerStyle:{backgroundColor:COLORS.pink},
                                    headerTintColor:'white'
                                }}
                            />
                            <Tab.Screen
                                name="Customer"
                                component={CustomerScreens}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon name="users" color={color} size={size} />
                                    ),
                                    title: 'Customer'
                                }}
                            />
                            <Tab.Screen
                                name="Setting"
                                component={SettingScreens}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon name="cog" color={color} size={size} />
                                    ),
                                    title: 'Setting'
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Tab.Screen
                                name="Home"
                                component={AdminScreens}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon name="home" color={color} size={size} />
                                    ),
                                    title: "Home"
                                }}
                            />
                            <Tab.Screen
                                name="Setting"
                                component={SettingScreens}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon name="cog" color={color} size={size} />
                                    ),
                                    title: 'Setting'
                                }}
                            />
                        </>
                    )}
                </Tab.Navigator>
            ) : (
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen name="Register" component={Register} />
                </Stack.Navigator>
            )}
        </>
    );
}
export default Router;