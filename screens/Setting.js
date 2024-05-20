import { Settings, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useMyContextController,logout } from "../store";
import { useEffect } from "react";
import COLORS from '../constants'

export default Setting = ({navigation})=>{
    const [controller,dispatch] = useMyContextController();
    const{userLogin} =controller;
    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
    }, [userLogin])
    const onSubmit = ()=>{
        logout(dispatch)
    }
    return(
        <View style={{flex:1,justifyContent:"flex-start",alignItems:"center",marginTop:50}}>
            <Button style={{backgroundColor:COLORS.pink,width:200}} mode="contained" onPress={onSubmit}> Đăng xuất</Button>
        </View>
    )
}