import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, Image, FlatList, Dimensions, ActivityIndicator, Linking } from "react-native";
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { setAdminToken } from "../functions/auth";

import { getCourses } from "../requests/Courses";
import { getAdminUser } from "../requests/User";

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

const CoursesScreen = (props) => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  let auth = useContext(AuthContext);

  const getAdminToken = async () => {
    let user = {};
    let res = await getAdminUser();
    //console.log(res)
    if (res.ok) {
        user = res.data;
        if (user.success) {
          setAdminToken(auth, user.data);
        }
    }
  };

  let isMounted = true;
  const loadCourses = async () => {
    setLoading(true);
    //console.log(auth)
    // if(!auth.Token){
    //   let token = await getAdminToken();
    // }
    let response = await getCourses();
    //console.log(response)
    if (response.ok && response.data) {
      if (isMounted){
        setCourses(response.data);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const handleClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Error");
        alert(`Please copy and open this event url ${url} in your browser.`);
      }
    });
  };

  useEffect(() => {
    isMounted = true;
    loadCourses();
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
    //console.log(item);
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity style={styles.item} onPress= { () => item.external_link? handleClick(item.external_link) : props.navigation.navigate("Course Detail List", {item}) }>
          <Image source={{uri: item.featured_icon}} style={styles.courseIcon} />
          <Text style={styles.itemText} numberOfLines={3} adjustsFontSizeToFit>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapperContainer}>
      {/* <HeaderDefault {...props} auth={auth} /> */}
      <HeaderDefault {...props} backRouteName="Welcome" />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      {courses && 
      <FlatList
        data={formatData(courses, numColumns)}
        style={{flex: 1}}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: '6%',
    paddingHorizontal: '3%',
  },
  item: {
    borderWidth: 1,
    borderColor: "rgb(214,214,214)",
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '5%',
    flex: 2,
    margin: '2.3%',
    height: width > 380 ? width / numColumns * .9 : width / numColumns, // approximate a square
    borderRadius:6,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.5,
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
    color: "rgb(50,47,45)",
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  courseIcon: {
    width: '100%',
    height: '45%',
    resizeMode: 'contain',
  }
});


export default CoursesScreen;
