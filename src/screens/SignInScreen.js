import React, { useState, useRef, useEffect, useContext } from "react";
import { Linking, StatusBar, View, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Input, Header } from "react-native-elements";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { getUser } from "../requests/User";
import { isLoggedIn, doLogin } from "../functions/auth";
import { AuthContext } from "../providers/AuthProvider";

const loginBannerImage = require("../../assets/login_header_banner.png");

const SignInScreen = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let auth = useContext(AuthContext);

  const submitLogin = async () =>  {
    if (Email == "" || Password == "") {
        alert("Email or Password must be filled out");
        if(Email == "") emailRef.current.focus();
        else if(Password == "") passwordRef.current.focus();
        return false
    }
    setLoading(true);
    let response = await getUser(Email, Password);
    setLoading(false);
    let user = {};
    if (response.ok) {
      user = response.data;
    }
    if (user.success) {
      doLogin(user.data, auth, props);
    } else {
      alert(user.message);
      //console.log(user);
    }
  }

  useEffect(() => {
    props.navigation.addListener('focus', async () => {
      // The screen is focused
      if(await isLoggedIn()) props.navigation.navigate("Home"); // context var not working here
    });
  }, [props]);
  

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Header
        containerStyle={{position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0}}
        placement="left" 
        leftComponent={{
          icon: "arrow-left",
          type:'feather',
          color: "#fff",
          size: 24,
          onPress: function () {
            props.navigation.navigate("Welcome");
          },
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <Image source={loginBannerImage} style={styles.loginBannerImage} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>WELCOME BACK!</Text>
        <Input
          ref={emailRef}
          style={styles.input}
          leftIcon={<FontAwesome name="envelope-o" size={16} color="#ccc" />}
          placeholder="Your email address"
          onChangeText= {input => setEmail(input)}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => { passwordRef.current.focus(); }}
          blurOnSubmit={false}
          autoCorrect={false}
        />
        <Input
          ref={passwordRef}
          style={styles.input}
          placeholder="Your password"
          leftIcon={<Feather name="lock" size={16} color="#ccc" />}
          secureTextEntry={true}
          onChangeText= {input => setPassword(input)}
          returnKeyType="done"
          blurOnSubmit={true}
        />
        <TouchableOpacity style={styles.btnOrangeWrap} onPress= { () => submitLogin() }>
          <Text style= {styles.btnOrange}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress= { () => Linking.openURL("https://r3medicaltraining.com/my-account/lost-password/") }>
          <Text style= {styles.forgotBtn}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      
      {loading &&
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="white" animating={loading} />
      </View>
      }
    </View>
  </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loginBannerImage: {
    width: '100%',
    height: '35%',
    resizeMode: "cover",
  },
  formContainer: {
    marginLeft: '5%',
    marginRight: '5%',
  },
  title: {
    fontSize: 30,
    color: 'rgb(231, 62, 25)',
    textAlign: "center",
    marginTop: '10%',
    marginBottom: '10%',
  },
  input: {
    fontSize: 15
  },
  btnOrangeWrap: {
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: '8%',
    marginBottom: '4%',
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
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffffff",
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: 'black',
  },
  forgotBtn: {
    color : "rgb(148, 148, 148)", 
    textAlign: "center",
  }
});
export default SignInScreen;
