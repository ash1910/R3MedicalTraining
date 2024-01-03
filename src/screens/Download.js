import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, ImageBackground, FlatList, Dimensions, ActivityIndicator, } from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { getCourseDetails, setCourseDetails } from "../functions/courses";
import { getCourseDetail } from "../requests/Courses";

const numColumns = 2;
const {width, height} = Dimensions.get('window');

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return data;
};

const DownloadScreen = (props) => {
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
          downloadable_files: response?.data?.downloadable_files || []
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
  //   if(courseDetails[course_id] && courseDetails[course_id]['downloadable_files']){
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

  const renderItem = ({ item, index }) => {
    //console.log(item);
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
          <Text style={styles.itemText} numberOfLines={4} adjustsFontSizeToFit>{item.file_name}</Text>
          <TouchableOpacity style={styles.btnWrap} onPress= { () => props.navigation.navigate("Download Detail", {item}) }>
            <Text style= {styles.btnText} numberOfLines={1} adjustsFontSizeToFit>DOWNLOAD</Text>
            <Icon name='download' type='feather' color='white' size={width/26} style={styles.btnIcon}/>
          </TouchableOpacity>
      </View>
    );
  };

  if(loading){
    return (
      <View style={{ flex: 1}}>
        <HeaderDefault {...props} headerTitle="Download Content" />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center',}} size="large" color="#fc3c1d" animating={loading} />
      </View>
    );
  }

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
      <HeaderDefault {...props} headerTitle="Download Content" />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <FlatList
        data={formatData(CourseDetail.downloadable_files || [], numColumns)}
        style={styles.containerList}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={styles.columnWrapperStyle}
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
    //paddingVertical: '6%',
    //paddingHorizontal: '3%',
  },
  columnWrapperStyle: {
    paddingHorizontal: '3%',
  },
  item: {
    backgroundColor: 'white',
    borderColor: "rgb(254,222,100)",
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3%',
    flex: 1,
    margin: '2.5%',
    height: width > 380 ? width / numColumns * .8 : width / numColumns, // approximate a square
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 8},
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  itemText: {
    color: "rgb(45,45,45)",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
  courseIcon: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  btnWrap: {
    backgroundColor: "rgb(247,108,55)",
    borderRadius:8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 7,
  },
});


export default DownloadScreen;
