import React, { useState } from "react";
import { StatusBar, ScrollView, Dimensions, View, Image, Text, StyleSheet, ActivityIndicator,} from "react-native";
import HeaderDefault from "../components/Header";
import HTML from "react-native-render-html";

const TrainerDetailScreen = (props) => {

  const [loading, setLoading] = useState(false);
  const contentWidth = Dimensions.get('window').width
  const contentHeight = Dimensions.get('window').height
  const tagsStyles= { p: { fontSize: 21, color: 'rgb(104,104,104)'}, h3: { fontSize: 32, color: 'rgb(46,46,46)'} }

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} headerTitle={props.route.params.item.file_name} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <ScrollView style={{ flex: 1 }}>
      <View style={styles.item}>
          <View style={styles.itemAvaterContainer}>
            <Image source={{uri: props.route.params.item.image}} style={styles.itemAvater} />
          </View>
          <View style={styles.itemDetailContainer}>
            <Text style={styles.itemTitle}>{props.route.params.item.name}</Text>
            <Text style={{ fontSize: 16, opacity: .8 }}>{props.route.params.item.contents}</Text>
          </View>
      </View>
      </ScrollView>
      
      {/* <ScrollView style={{ flex: 1, paddingHorizontal: 20, }}>
        <HTML tagsStyles={tagsStyles} source={{ html: props.route.params.item.contents || '<p>&nbsp</p>' }} contentWidth={contentWidth} />
      </ScrollView> */}
      {loading &&
        <ActivityIndicator style={{ position: "absolute", top: contentHeight / 2, left: contentWidth / 2 - 10}} size="large" color="#fc3c1d" animating={loading} />
      }
    </View>
  );
};


const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  item:{
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  itemAvaterContainer:{
    width: '100%',
    height: 250,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 8},
  },
  itemDetailContainer:{
    width: '100%',
    paddingLeft: 0,
    paddingTop: 20,
  },
  itemTitle: {
    fontSize: 30,
    fontWeight: '500',
    marginBottom: 15,
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

export default TrainerDetailScreen;
