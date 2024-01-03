import React, { useState, useEffect, useContext } from "react";
import { StatusBar, ScrollView, Dimensions, View, StyleSheet, Text, TouchableOpacity, Modal, ActivityIndicator, ImageBackground} from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import HTML, { useInternalRenderer } from "react-native-render-html";
import ImageViewer from 'react-native-image-zoom-viewer';
import { getCourseDetails, setCourseDetails } from "../functions/courses";
import { wpautop } from "../functions/functions";
import { getCourseDetail } from "../requests/Courses";

const AgendaScreen = (props) => {
  const course_id = props.route.params.item.id;
  const [CourseDetail, setCourseDetail] = useState({});
  const [loading, setLoading] = useState(true);
  let auth = useContext(AuthContext);
  const contentWidth = Dimensions.get('window').width
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
        let courseDetail = {
          featured_image_url: response?.data?.featured_image_url, 
          agenda_desc: wpautop(response?.data?.agenda_desc)
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
  //   if(courseDetails[course_id] && courseDetails[course_id]['agenda_desc']){
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

  function CustomImageRenderer(
    props
  ) {
    const { Renderer, rendererProps } = useInternalRenderer('img', props);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onPress = () => setIsModalOpen(true);
    const onModalClose = () => setIsModalOpen(false);
    const uri = rendererProps.source.uri;
    const thumbnailSource = {
      ...rendererProps.source,
    };
    return (
      <View style={{ alignItems: 'center' }}>
        <Renderer {...rendererProps} source={thumbnailSource} onPress={onPress} />
        <Modal visible={isModalOpen} onRequestClose={onModalClose}>
          <ImageViewer imageUrls={[{url: uri}]} index={0} />
          <TouchableOpacity style={styles.closeBtn} onPress= {onModalClose}>
            <Icon name='close' type='font-awesome' color='rgb(175,175,175)' size={12} />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: '#818181',
      fontSize: 21,
    },
    h1: {
      fontSize: '2.5em',
      color: 'rgb(46,46,46)'
    },
    h2: {
      fontSize: '2em',
      color: 'rgb(46,46,46)'
    },
    h3: {
      fontSize: '1.67em',
      color: 'rgb(46,46,46)'
    },
    h4: {
      fontSize: '1.5em',
      color: 'rgb(46,46,46)'
    },
    a: {
      color: '#964010',
      textDecorationLine: 'none',
    },
    p: {
      marginBottom: '10px',
      marginTop: 0,
      lineHeight: '2.1em',
    },
    span: {
    }, 
    img: { 
      marginVertical: 10,
    },
    ul:{
      marginBottom: '10px',
    },
    li:{
      marginBottom: '10px',
    },
    iframe: {
      marginTop: 0,
      borderRadius: 0,
      marginHorizontal: 0,
    },
  };

  const renderers = {
    img: CustomImageRenderer
  };

  return (
    <View style={styles.container}>
      <HeaderDefault {...props} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingBottom: 10}}>
        <ImageBackground source={{uri: CourseDetail.featured_image_url}} resizeMode="cover" style={styles.featureImage}>
            <View style={styles.titleTextBG}></View>
            <Text style= {styles.titleText}>{props.route.params.item.title}</Text>
        </ImageBackground>
        <HTML tagsStyles={tagsStyles} source={{ html: wpautop(CourseDetail.agenda_desc) || '<p>&nbsp</p>' }} contentWidth={contentWidth * .9} renderers={renderers} baseStyle={{paddingHorizontal: '5%'}} />
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
    height: 220,
    //maxHeight: '35%',
    backgroundColor: "rgb(244,116,81)",
    justifyContent: "flex-end",
    position: 'relative',
    marginBottom: 20
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
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderColor: 'rgb(175,175,175)', 
    borderRadius: 25, 
    borderWidth: 2, 
    width: 30, 
    height: 30, 
    justifyContent: 'center'
  },
});
export default AgendaScreen;
