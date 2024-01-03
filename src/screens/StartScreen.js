import React from "react";
import { StatusBar, ImageBackground, View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const bgImage = require("../../assets/splash_screen1_1.jpg");
const logoImage = require("../../assets/logo.png");

const StartScreen = (props) => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <Image source={logoImage} style={styles.logoImage} />
        <TouchableOpacity style={styles.btnOrangeWrap} onPress= { () => props.navigation.navigate("Welcome") }>
          <Text style= {styles.btnOrange}>GET STARTED</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
);

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
    bottom: '8%',
    marginLeft: '14%',
    marginRight: '14%',
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
});


export default StartScreen;
