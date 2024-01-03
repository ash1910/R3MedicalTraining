import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, ImageBackground, FlatList, Dimensions, ActivityIndicator, } from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import Counter from "react-native-counters";
import { addToCart, getOrder } from "../functions/cart";
import { getCourseDetails, setCourseDetails } from "../functions/courses";
import { getCourseDetail } from "../requests/Courses";

const numColumns = 1;

const RegisterScreen = (props) => {
  const course_id = props.route.params.item.id;
  const [CourseDetail, setCourseDetail] = useState({});
  const [Quantity, setQuantity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddCart, setLoadingAddCart] = useState(false);
  let auth = useContext(AuthContext);

  const AddToCart = async (item, index) =>  {
    let itemQty = Quantity[index] || 1;
    setLoadingAddCart(true);

    let order = await addToCart(item, itemQty);
    auth.setTotalCartItems(order.cart_items.length);
    setLoadingAddCart(false);
    alert("Added to cart successfully");
    //console.log(Order);
  }

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
          event_tickets: response?.data?.event_tickets || []
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
  //   if(courseDetails[course_id] && courseDetails[course_id]['event_tickets']){
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

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
          <Text style={styles.itemText}>{item.ticket_name}</Text>
          <Text style={styles.itemTextCurrency}>${item.ticket_price.toFixed(2)}(USD)</Text>
          <Counter start={1} min={1} max={item.ticket_remain} onChange={input => {let counters = [...Quantity]; counters[index] = input; setQuantity(counters)}} buttonStyle={{borderColor: 'rgb(175,175,175)', borderRadius: 25, borderWidth: 2}} buttonTextStyle={{color: 'rgb(45,45,45)'}} countTextStyle={{color: 'rgb(45,45,45)'}}/>
          <TouchableOpacity style={styles.btnWrap} onPress= { () => AddToCart(item, index) }>
            <Icon name='cart-plus' type='font-awesome' color='white' size={16} style={styles.btnIcon}/>
            <Text style= {styles.btnText}>Add to Cart</Text>
          </TouchableOpacity>
      </View>
    );
  };

  if(loading){
    return (
      <View style={{ flex: 1}}>
        <HeaderDefault {...props} />
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
      <HeaderDefault {...props} backRouteName="Course Detail List" />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <FlatList
        data={CourseDetail.event_tickets}
        style={styles.containerList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        //columnWrapperStyle={styles.columnWrapperStyle}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={() => {return (<View style={{height: 20}}></View>)}}
      />

      {loadingAddCart &&
      <View style={styles.loadingAddCart}>
        <ActivityIndicator size="large" color="white" animating={loadingAddCart} />
      </View>
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
    //marginVertical: 10,
  },
  columnWrapperStyle: {
  },
  item: {
    backgroundColor: 'white',
    borderColor: "rgb(254,222,100)",
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 15,
    //height: Dimensions.get('window').width / numColumns * .8, // approximate a square
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 8},
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: "rgb(45,45,45)",
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemTextCurrency: {
    color: "rgb(247,108,55)",
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
  btnWrap: {
    backgroundColor: "rgb(247,108,55)",
    borderRadius:8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 7,
  },
  loadingAddCart: {
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
});


export default RegisterScreen;
