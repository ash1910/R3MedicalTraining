import React, { useState, setState, useRef } from "react";
import { StatusBar, Dimensions, View, StyleSheet, ActivityIndicator,} from "react-native";
import HeaderDefault from "../components/Header";
//import Video from 'react-native-video';
//import { Video, AVPlaybackStatus } from 'expo-av';
import { WebView } from 'react-native-webview';

const VideoDetailScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const contentWidth = Dimensions.get('window').width
  const contentHeight = Dimensions.get('window').height
  
  const video_uri = (item) => {
    let uri = null;
    if(item._ps_video_provider == 'youtube'){
      uri = `https://www.youtube.com/embed/${item._ps_video_link}`;
    }
    else{
      uri = `https://player.vimeo.com/video/${item._ps_video_link}?api=1&player_id=player`;
    }
    return uri;
  }

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} headerTitle="Video" />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <WebView
        style={{ flex: 1, }}
        originWhitelist={['*']}
        source={{ uri: video_uri(props.route.params.item) }}
        onLoad={() => setLoading(false)}
      />
      {loading &&
        <ActivityIndicator style={{ position: "absolute", top: contentHeight / 2, left: contentWidth / 2 - 10}} size="large" color="#fc3c1d" animating={loading} />
      }
    </View>
  );
};


const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },

});

export default VideoDetailScreen;
