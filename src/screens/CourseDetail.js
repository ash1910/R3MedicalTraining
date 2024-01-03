import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity,StatusBar, ScrollView, Dimensions, View, StyleSheet, Text, Modal, ActivityIndicator, ImageBackground} from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import HTML, { useInternalRenderer, HTMLElementModel, HTMLContentModel } from "react-native-render-html";
import WebView from "react-native-webview";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import ImageViewer from 'react-native-image-zoom-viewer';
import { getCourseDetails, setCourseDetails } from "../functions/courses";
import { wpautop } from "../functions/functions";

import { getCourseDetail } from "../requests/Courses";

const CourseDetailScreen = (props) => {
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
          post_content: wpautop(response?.data?.post_content)
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
  //   if(courseDetails[course_id] && courseDetails[course_id]['post_content']){
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
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      //console.log("focus"); 
      isMounted = true;
      loadCourseDetail();
    });
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      //console.log("blur 1");
      isMounted = false;
      setCourseDetail({});
      //console.log("blur 2");
    });
    const unsubscribeTab = props.navigation.dangerouslyGetParent().addListener('tabPress', e => {
      e.preventDefault();
      setCourseDetail({});
      props.navigation.navigate('Courses');
    });
    
    return () => { 
      isMounted = false; 
      //console.log(isMounted); 
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeTab();
    };
  }, [props.navigation, auth.IsLoggedIn, course_id]);

  if(loading){
    return (
      <View style={{ flex: 1}}>
        <HeaderDefault {...props} />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center',}} size="large" color="#fc3c1d" animating={loading} />
      </View>
    );
  }

  function CustomImageRenderer(props) {
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

  const customHTMLElementModels = {
    'center': HTMLElementModel.fromCustomModel({
      tagName: 'center',
      mixedUAStyles: {
        flex: 1,
      },
      contentModel: HTMLContentModel.block
    }),
    iframe: iframeModel
  };

  const renderers = {
    img: CustomImageRenderer,
    iframe: IframeRenderer,
  };

  const gotToRegister = async () => {
    await setCourseDetail({});
    props.navigation.navigate("Register", {item: props.route.params.item})
  };

  return (
    <View style={styles.container}>
      <HeaderDefault {...props}  setCourseDetail={setCourseDetail} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingBottom: 10}}>
        <ImageBackground source={{uri: CourseDetail.featured_image_url}} resizeMode="cover" style={styles.featureImage}>
            <View style={styles.titleTextBG}></View>
            <Text style= {styles.titleText}>{props.route.params.item.title}</Text>
        </ImageBackground>
        <TouchableOpacity style={styles.btnOrangeWrap} onPress= {gotToRegister}>
          <Text style= {styles.btnOrange}>Register Now</Text>
        </TouchableOpacity>
        <HTML 
          baseStyle={{paddingHorizontal: '5%'}}
          WebView={WebView} 
          tagsStyles={tagsStyles} 
          source={{ html: CourseDetail.post_content || '<p>&nbsp</p>' }} 
          contentWidth={contentWidth * .9} 
          defaultWebViewProps={{}} 
          renderers={renderers} 
          customHTMLElementModels={customHTMLElementModels} 
          staticContentMaxWidth= {contentWidth}
          renderersProps={{
            iframe: {
              scalesPageToFit: false,
              webViewProps: {
                allowsFullscreenVideo: true,
              },
            },
          }}
        />
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
  btnOrangeWrap: {
    alignSelf: 'center',
    marginVertical: 20,
    width: '80%',
    maxWidth: 260,
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
export default CourseDetailScreen;
