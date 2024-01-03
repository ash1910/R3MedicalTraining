import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Button, Text, Image } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";

const CourseCard = (props) => {
  return (
    <Card style={styles.item}>
      <View
        style={{
          //flexDirection: "column",
          //alignItems: "center",
        }}
      >
        <Image source={{uri: props.featured_icon}} style={{width: 50, height: 50}} />
        <Text h4Style={{ padding: 10 }} h4>{props.title}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  item: {
    //width: '45%' // is 50% of container width
  }
});

export default CourseCard;
