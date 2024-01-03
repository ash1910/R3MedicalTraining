import React from "react";
import { StatusBar, ImageBackground, View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { doLogout } from "../functions/auth";
import { AuthContext } from "../providers/AuthProvider";

const bgImage = require("../../assets/splash_screen1_1.jpg");
const logoImage = require("../../assets/logo.png");

const WelcomeScreen = (props) => {

  return (
    <AuthContext.Consumer>
      {(auth) => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <Image source={logoImage} style={styles.logoImage} />
        { auth.IsLoggedIn && 
          <TouchableOpacity style={styles.btnOrangeWrap} onPress= { async () => doLogout(auth, props) }>
            <Text style= {styles.btnOrange}>LOGOUT</Text>
          </TouchableOpacity>
        }
        { !auth.IsLoggedIn && 
          <TouchableOpacity style={styles.btnOrangeWrap} onPress= { () => props.navigation.navigate("SignIn") }>
            <Text style= {styles.btnOrange}>LOGIN</Text>
          </TouchableOpacity>
        }
        
        <TouchableOpacity style={styles.btnWhiteWrap} onPress= { () => props.navigation.navigate("Home") }>
          <Text style= {styles.btnWhite}>Courses</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
    )}
    </AuthContext.Consumer>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    position: "relative",
  },
  logoImage: {
    width: '45%',
    resizeMode: 'contain',
    bottom: '12%',
  },
  btnOrangeWrap: {
    position: 'absolute',
    bottom: '6%',
    marginLeft: '14%',
    marginRight: '14%',
    marginBottom: 80,
    width: '100%',
    backgroundColor: "#fc3c1d",
    borderRadius:5,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 3 ,
    shadowOffset : { width: 0, height: 5},
  },
  btnOrange: {
    paddingTop: 16,
    paddingBottom: 16, 
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff",
  },
  btnWhiteWrap: {
    position: 'absolute',
    bottom: '6%',
    marginLeft: '14%',
    marginRight: '14%',
    width: '100%',
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ffffff"
  },
  btnWhite: {
    paddingTop: 16,
    paddingBottom: 16, 
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff",
  },
});


export default WelcomeScreen;
