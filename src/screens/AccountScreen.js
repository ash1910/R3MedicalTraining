import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, ImageBackground, FlatList, Dimensions, ActivityIndicator, } from "react-native";
import { Icon } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import Counter from "react-native-counters";

import { getAccount } from "../requests/User";

const numColumns = 1;

const AccountScreen = (props) => {
  const [AccountDetail, setAccountDetail] = useState({});
  const [loading, setLoading] = useState(true);
  let auth = useContext(AuthContext);
  let isMounted = true;

  const loadAccountInfo = async () => {
    let user_id = null;
    if(auth.IsLoggedIn){
      user_id = auth.CurrentUser.id;
      
      setLoading(true);
      let response = await getAccount(user_id);
      if (response.ok) {
        if (isMounted){
          setAccountDetail(response.data);
          //console.log(AccountDetail)
        }
      }
    }
    if (isMounted){
      setLoading(false);
    }
    
  };

  useEffect(() => {
    isMounted = true;
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      isMounted = true;
      loadAccountInfo();
    });
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      isMounted = false;
      setAccountDetail({});
    });
    
    return () => { 
      isMounted = false; 
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [props.navigation]);

  const renderItem = ({ item, index }) => {
    //console.log(item)
    return (
      <TouchableOpacity style={styles.item} onPress= { () => props.navigation.navigate("Course Detail List", {'item': {'id':item.evt_id, 'title': item.evt_name, 'featured_img_url': item.feature_url}}) }>
          <Text style={[styles.itemText,{fontSize: 24}]}>Event: {item.evt_name}</Text>
          <Text style={[styles.itemText,{fontSize: 20}]}>Ticket: {item.ticket_name}</Text>
          <Text style={[styles.itemText,{fontSize: 16}]}>Reg Id: {item.reg_id}</Text>
          <Text style={[styles.itemText,{fontSize: 16}]}>Purchase Date: {item.reg_purchase_date}</Text>
          <Text style={styles.itemTextCurrency}>Price: ${item.ticket_price} X {item.ticket_quantity} = ${item.total_price}</Text>
      </TouchableOpacity>
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
      <View style={{flex:1}}>
        {AccountDetail && AccountDetail.user_info &&
          <View style={styles.user_info}>
            <Text style={styles.itemText}>Name: {AccountDetail.user_info.display_name}</Text>
            <Text style={styles.itemText}>Email: {AccountDetail.user_info.user_email}</Text>
            <Text style={styles.itemText}>Phone: {AccountDetail.user_info.user_phone}</Text>
          </View>
        }
        {AccountDetail && AccountDetail.purchase_list &&
          <Text style={[styles.itemText, {fontSize: 26}]}>Purchase List</Text>
        }
      </View>
    );
  };

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      {!auth.IsLoggedIn &&
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[styles.itemText, {textAlign: "center"}]}>Please login to get account details</Text>
          <TouchableOpacity style={styles.btnWrap} onPress= { () => props.navigation.navigate('SignIn') }>
            <Text style= {styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      }
      {auth.IsLoggedIn &&
      <FlatList
        data={AccountDetail?.purchase_list || []}
        style={styles.containerList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={() => {return (<View style={{height: 20}}></View>)}}
      />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  containerList: {
    flex: 1,
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
    marginVertical: 3,
  },
  itemTextCurrency: {
    color: "rgb(247,108,55)",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
  btnWrap: {
    backgroundColor: "rgb(247,108,55)",
    borderRadius:20,
    paddingHorizontal: '10%',
    paddingVertical: '3.5%',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 20
  },
  btnText: {
    color: "#ffffff",
    fontSize: 22,
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
  user_info: {
    marginVertical: 20,
  }
});


export default AccountScreen;
