import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { Alert } from "react-native"; // Ensure correct import for Alert

const MyContext= createContext();
MyContext.displayName = "MyContextContext"
function reducer(state,action) {
    switch (action.type) {
        case "USER_LOGIN": {
            return {...state,userLogin: action.value};
        }
        default: {
            throw new Error('Unhandled action type: ${action.type}');
        }
    }
}
//react context provider
function MyContextControllerProvider({children}) {
    const initialState={
        userLogin:null,
    };
    const [controller,dispatch] =useReducer(reducer,initialState);
    const value =useMemo(()=> [controller,dispatch], [controller,dispatch]);
    return <MyContext.Provider value={value}>{children}</MyContext.Provider>
}

//react custom hook for using context 
function useMyContextController() {
    const context =useContext(MyContext);
    if(!context) {
        throw new Error(
            "useMyContextController should be used inside the MyContextControllerProvider"
        );
    }
    return context;
}
//table
const USERS = firestore().collection("USERS")
const SERVICES = firestore().collection("services")
//actions
const login=(dispatch,email,password)=>{
    auth().signInWithEmailAndPassword(email,password)
    .then(
        ()=>
            USERS.doc(email).onSnapshot(u => {
                const value=u.data();
                console.log("Đăng nhập thành công với User : " ,value)
                dispatch({type:"USER_LOGIN",value})
            })      
    )
    .catch(e => alert("Sai user và Password"))
}
const logout = (dispatch) => {
    dispatch({type:"USER_LOGIN", })
}
const createNewService = (newService) => {
    newService.finalUpdate = firestore.FieldValue.serverTimestamp();
    SERVICES.add(newService)
        .then(() => {
            console.log("Service added successfully"); // Debug log
            Alert.alert("Success", "Add new service successfully !!!");
        })
        .catch((e) => {
            console.error("Error adding service:", e); // Debug log
            Alert.alert("Error", e.message);
        });
};
const updateService = async (id, updatedService) => {
    updatedService.finalUpdate = firestore.FieldValue.serverTimestamp();
    await SERVICES.doc(id).update(updatedService)
      .then(() => {
        alert("Service updated successfully !!!");
      })
      .catch((e) => {
        alert(e.message);
      });
  };
  const payConfirm = async (userName, serviceName, servicePrice) => {
    try {
      // Thêm dữ liệu thanh toán vào bảng history
      await firestore().collection('history').add({
        userName: userName,
        serviceName: serviceName,
        servicePrice: servicePrice,
        paymentDate: new Date(), // Ngày thanh toán
      });
  
      console.log('Thanh toán thành công!');
  
      // Trả về true nếu thanh toán thành công
      return true;
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      // Trả về false nếu có lỗi xảy ra trong quá trình thanh toán
      return false;
    }
  };
  const deleteService = async (id) => {
    try {
      await SERVICES.doc(id).delete();
      console.log("Service deleted successfully");
      Alert.alert("Success", "Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", error.message);
    }
  };
  
export{
    MyContextControllerProvider,
    useMyContextController,
    createNewService,
    login,
    logout,
    updateService,
    payConfirm,
    deleteService,
};