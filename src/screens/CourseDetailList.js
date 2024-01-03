import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, ImageBackground, ScrollView} from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { getCourseDetails, setCourseDetails } from "../functions/courses";

import { getCourseDetail } from "../requests/Courses";
const {width, height} = Dimensions.get('window');

const CourseDetailListScreen = (props) => {
  const course_id = props.route.params.item.id;
  const [CourseDetail, setCourseDetail] = useState({});
  const [loading, setLoading] = useState(false);
  let auth = useContext(AuthContext);
  //console.log(props.route.params.item.id)

  let isMounted = true;
  const loadCourseDetail = async () => {
    let user_id = null;
    if(auth.IsLoggedIn){
      user_id = auth.CurrentUser.id;
    }
    let response = await getCourseDetail(course_id, user_id);
    if (response.ok) {
      if (isMounted){
        //setCourseDetail(response.data);
        let courseDetails = await getCourseDetails();
        courseDetails[course_id] = response.data;
        await setCourseDetails(courseDetails);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const checkCourseDetail = async () => {
    //setLoading(true);
    let courseDetails = await getCourseDetails();
    if(courseDetails[course_id]){
      if (isMounted){
        //setCourseDetail(courseDetails[course_id]);
        setLoading(false);
        loadCourseDetail();
      }
    }
    else{
      loadCourseDetail();
    }
  };

  useEffect(() => {
    isMounted = true;
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      //console.log("focus"); 
      isMounted = true;
      checkCourseDetail();
    });
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      //console.log("blur 1");
      isMounted = false;
      setCourseDetail({});
      //console.log("blur 2");
    });
    
    return () => { 
      isMounted = false; 
      //console.log(isMounted); 
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [auth.IsLoggedIn, course_id]);

  if(loading){
    return (
      <View style={{ flex: 1}}>
        <HeaderDefault {...props} headerTitle="Course Details" />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center',}} size="large" color="#fc3c1d" animating={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderDefault {...props} headerTitle="Course Details" />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <ImageBackground source={{uri: props.route.params.item.featured_img_url}} resizeMode="cover" style={styles.featureImage}>
          <View style={styles.titleTextBG}></View>
          <Text style= {styles.titleText}>{props.route.params.item.title}</Text>
      </ImageBackground>
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.btnListActive} onPress= { () => props.navigation.navigate("Course Details", {item: props.route.params.item}) }>
          <View style={styles.btnListActiveLeftPanel}></View>
          <Icon name='aperture' type='feather' color='rgb(59,84,94)' size={width/15} style={styles.btnListIcon}/>
          <Text style= {styles.btnListText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnList} onPress= { () => props.navigation.navigate("Agenda", {item: props.route.params.item}) }>
          <Icon name='calendar' type='feather' color='rgb(59,84,94)' size={width/15} style={styles.btnListIcon}/>
          <Text style= {styles.btnListText}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnList} onPress= { () => props.navigation.navigate("Register", {item: props.route.params.item}) }>
          <Icon name='clipboard' type='feather' color='rgb(59,84,94)' size={width/15} style={styles.btnListIcon}/>
          <Text style= {styles.btnListText}>Registration</Text>
        </TouchableOpacity>
        {auth.IsLoggedIn && <TouchableOpacity style={styles.btnList} onPress= { () => props.navigation.navigate("Download", {item: props.route.params.item}) }>
          <Icon name='download' type='feather' color='rgb(59,84,94)' size={width/15} style={styles.btnListIcon}/>
          <Text style= {styles.btnListText} numberOfLines={1} >Download Content</Text>
        </TouchableOpacity>}
        <TouchableOpacity style={styles.btnList} onPress= { () => props.navigation.navigate("Trainers", {item: props.route.params.item}) }>
          <Icon name='users' type='feather' color='rgb(59,84,94)' size={width/15} style={styles.btnListIcon}/>
          <Text style= {styles.btnListText}>Trainers</Text>
        </TouchableOpacity>
        {auth.IsLoggedIn && <TouchableOpacity style={styles.btnList} onPress= { () => props.navigation.navigate("Video",{item: props.route.params.item}) }>
          <Icon name='youtube' type='feather' color='rgb(59,84,94)' size={width/15} style={styles.btnListIcon}/>
          <Text style= {styles.btnListText}>Video</Text>
        </TouchableOpacity>}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  featureImage: {
    width: '100%',
    height: '100%',
    maxHeight: '30%',
    backgroundColor: "rgb(244,116,81)",
    justifyContent: "flex-end",
    position: 'relative',
  },
  titleTextBG: {
    position: 'absolute', 
    backgroundColor: 'black', 
    left: 0, 
    top: 0, 
    width: '100%', 
    height: '100%', 
    opacity: .3
  },
  titleText:{
    color: "rgb(254,222,100)",
    fontSize: width/15,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
    width: '90%',
  },
  btnList:{
    backgroundColor: 'transparent',
    position: 'relative',
    flex: 2,
    flexDirection: 'row',
  },
  btnListActive:{
    backgroundColor: 'rgb(254,234,228)',
    position: 'relative',
    flexDirection: 'row'
  },
  btnListText: {
    paddingTop: width/19,
    paddingBottom: width/17, 
    paddingLeft: 24,
    fontSize: width/14,
    fontWeight: '500',
  },
  btnListIcon:{
    marginTop: width/17, 
    marginLeft: 30,
  },
  btnListActiveLeftPanel:{
    position: 'absolute', 
    backgroundColor: 'rgb(253,112,75)', 
    left: 0, 
    top: 0, 
    width: 6, 
    height: '100%',
  }
  
});
export default CourseDetailListScreen;
