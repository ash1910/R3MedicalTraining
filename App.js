import React, {useContext} from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Icon } from 'react-native-elements'
import { createStackNavigator } from "@react-navigation/stack";
//import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from "./src/screens/HomeScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import AccountScreen from "./src/screens/AccountScreen";
import CartScreen from "./src/screens/CartScreen";

import CourseDetailList from "./src/screens/CourseDetailList";
import CourseDetail from "./src/screens/CourseDetail";
import Agenda from "./src/screens/Agenda";
import Trainers from "./src/screens/Trainers";
import TrainerDetail from "./src/screens/TrainerDetail";
import Download from "./src/screens/Download";
import DownloadDetail from "./src/screens/DownloadDetail";
import Video from "./src/screens/Video";
import VideoDetail from "./src/screens/VideoDetail";
import Register from "./src/screens/Register";
import Checkout from "./src/screens/Checkout";

import StartScreen from "./src/screens/StartScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import SignInScreen from "./src/screens/SignInScreen";

import { AuthContext, AuthProvider } from "./src/providers/AuthProvider";
//import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
const AuthStack = createStackNavigator();
//const MainTab = createMaterialBottomTabNavigator();
const MainTab = createBottomTabNavigator();

const CourseDetailStackScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName="Courses">
      <AuthStack.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Course Detail List"
        component={CourseDetailList}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Course Details"
        component={CourseDetail}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Agenda"
        component={Agenda}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Trainers"
        component={Trainers}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Trainer Detail"
        component={TrainerDetail}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Download"
        component={Download}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Download Detail"
        component={DownloadDetail}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Video"
        component={Video}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Video Detail"
        component={VideoDetail}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const CartStackScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName="Cart">
      <AuthStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Checkout"
        component={Checkout}
        options={{ unmountOnBlur: true, headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const MainTabScreen = () => {
  let auth = useContext(AuthContext);
  return (
    <MainTab.Navigator 
      initialRouteName="CoursesTab" 
      barStyle={{ backgroundColor: '#fff' }}
      activeTintColor="#fc3c1d"
      inactiveTintColor="#2F2F2F"
      tabBarOptions={{
        activeTintColor: 'rgb(249,62,43)', // '#e91e63',
        inactiveTintColor: '#2F2F2F',
        size: '26',
        labelStyle: {
          fontSize: 13,
          marginBottom: 3,
          //padding: 0,
        },
        iconStyle: {
          marginTop: 5,
        },
        style:{
          //height:60,
          //paddingTop: 10,
        }
      }}
      >
      <MainTab.Screen
        name="CoursesTab"
        component={CourseDetailStackScreen}
        options={{
          tabBarLabel: "Courses",
          tabBarIcon: ({ size, color }) => (
            <Icon name='graduation-cap' type='font-awesome' color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ size, color }) => (
            <Icon name='home' type='font-awesome' color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ size, color }) => (
            <Icon name='user-plus' type='font-awesome' color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen
        name="CartTab"
        component={CartStackScreen}
        options={{
          tabBarLabel: `Cart${auth.TotalCartItems? '('+auth.TotalCartItems+')': ''}`,
          tabBarIcon: ({ size, color }) => (
            <Icon name='shopping-cart' type='font-awesome' color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName="Start">
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Start"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const MainStackScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName="Start">
      <AuthStack.Screen name="Home" component={MainTabScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Start" component={AuthStackScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
};

//{auth.IsLoggedIn ? <MainTabScreen /> : <AuthStackScreen />}

const R3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  },
};

function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {(auth) => (
          <NavigationContainer theme={R3Theme}>
            <MainStackScreen />
          </NavigationContainer>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;