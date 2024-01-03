import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, ImageBackground, FlatList, Dimensions, ActivityIndicator, } from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { getCourseDetails, setCourseDetails } from "../functions/courses";
import { getCourseDetail } from "../requests/Courses";

const numColumns = 2;

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return data;
};

const VideoScreen = (props) => {
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
          video_link: response?.data?.video_link? response?.data?.video_link?.filter(el => el._ps_video_link) : []
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
  //   if(courseDetails[course_id] && courseDetails[course_id]['video_link']){
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
  }, [auth.IsLoggedIn, course_id]);

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
    //console.log(item);
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity style={styles.item} onPress= { () => props.navigation.navigate("Video Detail", {item}) }>
        <ImageBackground source={{uri: item._ps_video_thumbnail?item._ps_video_thumbnail:null}} resizeMode="cover" style={styles.videoThumb}>
          <Icon name='play-circle' type='font-awesome' color='rgb(241,241,241)' size={40} style={styles.btnIcon}/>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <ImageBackground source={{uri: CourseDetail.featured_image_url}} resizeMode="cover" style={styles.featureImage}>
          <View style={styles.titleTextBG}></View>
          <Text style= {styles.titleText}>{props.route.params.item.title}</Text>
      </ImageBackground>

      {CourseDetail.video_link &&
      <FlatList
        data={formatData(CourseDetail.video_link, numColumns)}
        style={styles.container}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
      />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
    width: '90%',
  },

  container: {
    flex: 1,
    marginVertical: 15,
    marginHorizontal:13,
  },
  item: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 12,
    height: Dimensions.get('window').width / numColumns * .6, // approximate a square
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 8},
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  videoThumb:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgb(243,116,81)'
  },
  btnIcon: {
    //position: 'absolute',
  }

});


export default VideoScreen;
