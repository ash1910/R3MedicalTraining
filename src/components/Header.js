import React, { useContext } from "react";
import { Header } from "react-native-elements";
import { doLogout } from "../functions/auth";
import { AuthContext } from "../providers/AuthProvider";

const headerBgImg = require("../../assets/header_pic.png");

const HeaderDefault = (props) => {
  //let auth = props.auth
  let auth = useContext(AuthContext);
  return (
    <Header
        containerStyle={{backgroundColor: 'rgb(245,116,75)',}}
        backgroundImage= {headerBgImg}
        placement="left" 
        leftComponent={{
        icon: "arrow-left",
        type:'feather',
        color: "#fff",
        size: 30,
        onPress: async function() {
            if(props.backRouteName){
              props.navigation.navigate(props.backRouteName || "Welcome");
            }
            else{
              if(props.route.name == 'Course Details'){
                await props.setCourseDetail({});
              }
              props.navigation.goBack();
            }
        },
        }}
        centerComponent={{ text: `${props.headerTitle || props.route.name}`, style: { color: "#fff", fontSize: 25 } }}
        rightComponent={{
        //text: "Logout",
        type:'feather',
        icon: auth.IsLoggedIn ? "log-out" : "log-in",
        color: "#fff",
        style: { color: "#fff" },
        onPress: async function () {
            if(auth.IsLoggedIn) 
              doLogout(auth, props)
            else{
              if(props.route.name == 'Course Details'){
                await props.setCourseDetail({});
              }
              props.navigation.navigate("SignIn");
            }  
        },
        }}
    />
  );
};

export default HeaderDefault;
