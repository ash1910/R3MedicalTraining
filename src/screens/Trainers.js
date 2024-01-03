import React, { useState, useEffect, useContext } from "react";
import { StatusBar, FlatList, View, StyleSheet, Text, Image, ActivityIndicator, ImageBackground, TouchableOpacity} from "react-native";
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { getCourseDetails, setCourseDetails } from "../functions/courses";
import { getCourseDetail } from "../requests/Courses";

const TrainersScreen = (props) => {
  const course_id = props.route.params.item.id;
  const [CourseDetail, setCourseDetail] = useState({});
  const [loading, setLoading] = useState(true);
  let auth = useContext(AuthContext);

  let isMounted = true;
  const loadCourseDetail = async () => {
    let user_id = null;
    if(auth.IsLoggedIn){
      user_id = auth.CurrentUser.id;
    }
    let response = await getCourseDetail(course_id, user_id);
    if (response.ok) {
      if (isMounted){
        let courseDetail = {
          featured_image_url: response?.data?.featured_image_url, 
          trainers: response?.data?.trainers || []
        }
        setCourseDetail(courseDetail);
        // let courseDetails = await getCourseDetails();
        // courseDetails[course_id] = response.data;
        // await setCourseDetails(courseDetails);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  // const checkCourseDetail = async () => {
  //   setLoading(true);
  //   let courseDetails = await getCourseDetails();
  //   if(courseDetails[course_id] && courseDetails[course_id]['trainers']){
  //     if (isMounted){
  //       setCourseDetail(courseDetails[course_id]);
  //       setLoading(false);
  //       loadCourseDetail();
  //     }
  //   }
  //   else{
  //     loadCourseDetail();
  //   }
  // };

  useEffect(() => {
    isMounted = true;
    loadCourseDetail();
    return () => { isMounted = false };
  }, [props.navigation]);

  if(loading){
    return (
      <View style={{ flex: 1}}>
        <HeaderDefault {...props} />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center',}} size="large" color="#fc3c1d" animating={loading} />
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.item} onPress= { () => props.navigation.navigate("Trainer Detail", {item}) }>
          <View style={styles.itemAvaterContainer}>
            <Image source={{uri: item.image}} style={styles.itemAvater} />
          </View>
          <View style={styles.itemDetailContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDetail} numberOfLines={3}>{item.contents}</Text>
          </View>
      </TouchableOpacity>
    );
  };

  const headerComponent = () => {
    return (
      <ImageBackground source={{uri: CourseDetail.featured_image_url}} resizeMode="cover" style={styles.featureImage}>
          <View style={styles.titleTextBG}></View>
          <Text style= {styles.titleText}>{props.route.params.item.title}</Text>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <FlatList
        data={CourseDetail.trainers}
        style={styles.containerList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={() => {return (<View style={{height: 20}}></View>)}}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  featureImage: {
    width: '100%',
    height: 220,
    marginBottom: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
    width: '90%',
  },
  containerList: {
    flex: 1,
    //marginVertical: 20,
    //marginHorizontal:0,
  },
  item:{
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  itemAvaterContainer:{
    width: '35%',
    //height: 150,
    minHeight: 150,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 8},
  },
  itemDetailContainer:{
    width: '65%',
    paddingLeft: 25,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 10,
  },
  itemAvater: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderColor: "rgb(254,222,100)",
    borderWidth: 3,
  },
  itemDetail:{
    color: "rgb(50,47,45)",
    fontSize: 16,
  }
  
});
export default TrainersScreen;
