import React, { useState } from "react";
import { StatusBar, Text, Dimensions, View, StyleSheet, ActivityIndicator,} from "react-native";
import HeaderDefault from "../components/Header";
import { WebView } from 'react-native-webview';

const DownloadDetailScreen = (props) => {

  const [loading, setLoading] = useState(true);
  const contentWidth = Dimensions.get('window').width
  const contentHeight = Dimensions.get('window').height

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} headerTitle={props.route.params.item.file_name} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        source={{ uri: props.route.params.item.file_url }}
        onLoad={() => setLoading(false)}
      />
      {loading &&
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color="#fc3c1d" animating={loading} />
          <Text style={styles.loadingText}>Downloading ...</Text>
        </View> 
      }
    </View>
  );
};


const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  loadingView:{
    position: "absolute", 
    top: '50%', 
    left: '50%', 
    marginLeft: -60
  },
  loadingText:{
    marginTop: 5, 
    marginLeft: 10, 
    color: '#fc3c1d', 
    fontWeight: 'bold'
  }
});

export default DownloadDetailScreen;
