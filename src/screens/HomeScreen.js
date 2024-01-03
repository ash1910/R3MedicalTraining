import React from "react";
import { StatusBar, ImageBackground, View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { doLogout } from "../functions/auth";
import { AuthContext } from "../providers/AuthProvider";

const bgImage = require("../../assets/splash_screen1_1.jpg");
const logoImage = require("../../assets/logo.png");

const HomeScreen = (props) => {

  return (
    <AuthContext.Consumer>
      {(auth) => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <Image source={logoImage} style={styles.logoImage} />
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btnWhiteWrap} onPress= { () => props.navigation.navigate("Courses") }>
            <Text style= {styles.btnWhite}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOrangeWrap} onPress= { () => props.navigation.navigate("CartTab") }>
            <Text style= {styles.btnOrange}>Cart</Text>
          </TouchableOpacity>

          { auth.IsLoggedIn && 
            <View>
              <TouchableOpacity style={styles.btnOrangeWrap} onPress= { async () => props.navigation.navigate("Account") }>
                <Text style= {styles.btnOrange}>My Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOrangeWrap} onPress= { async () => doLogout(auth, props) }>
                <Text style= {styles.btnOrange}>LOGOUT</Text>
              </TouchableOpacity>
            </View>
          }
          { !auth.IsLoggedIn && 
            <TouchableOpacity style={styles.btnOrangeWrap} onPress= { () => props.navigation.navigate("SignIn") }>
              <Text style= {styles.btnOrange}>LOGIN</Text>
            </TouchableOpacity>
          }
        </View>
        
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
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
  },
  logoImage: {
    width: '45%',
    resizeMode: 'contain',
    bottom: '12%',
  },
  btnContainer:{
    flexDirection: 'column',
    width: '84%',
    position: 'absolute',
    bottom: 20,
    left: '8%',
  },
  btnOrangeWrap: {
    marginVertical: 10,
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
    paddingTop: 12,
    paddingBottom: 12, 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: "#ffffff",
  },
  btnWhiteWrap: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ffffff"
  },
  btnWhite: {
    paddingTop: 12,
    paddingBottom: 12, 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: "#ffffff",
  },
});


export default HomeScreen;
