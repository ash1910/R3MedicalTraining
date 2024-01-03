import React, { useState, useEffect, useContext } from "react";
import { StatusBar, TouchableOpacity, View, StyleSheet, Text, ImageBackground, FlatList, Dimensions, ActivityIndicator, Alert} from "react-native";
import { Icon, Divider } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { addToCart, getOrder, removeFromCart } from "../functions/cart";

const numColumns = 1;

const CartScreen = (props) => {
  const [Quantity, setQuantity] = useState([]);
  const [Order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingAddCart, setLoadingAddCart] = useState(false);
  let auth = useContext(AuthContext);
  let isMounted = true;

  const loadOrder = async () => {
    setLoading(true);
    let order = await getOrder() || {};
    if (isMounted){
      setOrder(order);
      setLoading(false);
    }
    //console.log(order)
  };

  const UpdateQty = async (item, itemQty) =>  {
    setLoadingAddCart(true);
    let order = await addToCart(item, null, itemQty || 1);
    //setOrder({});
    setOrder(order);
    setLoadingAddCart(false);
    alert("Updated cart successfully");
    //console.log(Order);
  }
  const UpdateQtyIncrement = async (item) =>  {
    let itemQty = parseInt(item.item_quantity) + 1;
    if(itemQty > item.ticket_remain) return;

    UpdateQty(item, itemQty);
  }
  const UpdateQtyDecrement = async (item) =>  {
    let itemQty = parseInt(item.item_quantity) - 1;
    if(itemQty < 1) return;

    UpdateQty(item, itemQty);
  }

  const RemoveItemFromCart = async (index) =>  {

    Alert.alert(
      "Delete",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => {return false},
          style: "cancel"
        },
        { text: "OK", onPress: async() => {
          setLoadingAddCart(true);
          let order = await removeFromCart(index);
          auth.setTotalCartItems(order.cart_items.length);
          setOrder({});
          setOrder(order);
          setLoadingAddCart(false);
          alert("Updated cart successfully");
        } }
      ]
    );
    //console.log(Order);
  }

  useEffect(() => {
    isMounted = true;
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      isMounted = true;
      loadOrder();
    });
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      isMounted = false;
      setOrder({});
    });
    
    return () => { 
      isMounted = false; 
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [props.navigation]);

  const renderItem = ({ item, index }) => {
    //console.log(item)
    //console.log(index)
    return (
      <View style={styles.item}>
        <View style={styles.itemRow}>
          <Text style={[styles.itemCol1, styles.itemText]} numberOfLines={3} >{item.ticket_name}</Text>
          <Text style={[styles.itemCol2, styles.itemTextCurrency]} numberOfLines={1} adjustsFontSizeToFit>${item.item_subtotal.toFixed(0)}</Text>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterDecrement} onPress= { () => UpdateQtyDecrement(item) }>
              <Icon name='minus' type='font-awesome' color='rgb(175,175,175)' size={12} />
            </TouchableOpacity>
            <Text style={styles.counterText}>{item.item_quantity}</Text>
            <TouchableOpacity style={styles.counterIncrement} onPress= { () => UpdateQtyIncrement(item) }>
              <Icon name='plus' type='font-awesome' color='rgb(175,175,175)' size={12} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.itemCol2, styles.itemDeleteBtn]} onPress= { () => RemoveItemFromCart(index) }>
            <Icon name='trash-o' type='font-awesome' color='rgb(150,200,253)' size={38} style={styles.btnIcon}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalPrice = () => {
    return (
      <View style={{flex:1, marginTop: 30}}>
        <View style={styles.itemRow}>
          <Text style={[styles.itemCol1, styles.itemText1]}>Total:</Text>
          <Text style={[styles.itemCol2, styles.itemTotalCurrency]} numberOfLines={1} adjustsFontSizeToFit>${Order.order_total.toFixed(0)}</Text>
        </View>
        <TouchableOpacity style={styles.btnWrap} onPress= { () => props.navigation.navigate('Checkout') }>
          <Text style= {styles.btnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if(loading){
    return (
      <View style={{ flex: 1}}>
        <HeaderDefault {...props} backRouteName="Courses" />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center',}} size="large" color="#fc3c1d" animating={loading} />
      </View>
    );
  }

  return (
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} backRouteName="Courses" />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      {(!Order || !Order.cart_items || Order.cart_items.length < 1) &&
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[styles.itemText, {textAlign: "center"}]}>Cart is Empty</Text>
          <TouchableOpacity style={styles.btnWrap} onPress= { () => props.navigation.navigate('Courses') }>
            <Text style= {styles.btnText}>Courses</Text>
          </TouchableOpacity>
        </View>
      }

      {Order.cart_items && Order.cart_items.length > 0 &&
      <FlatList
        data={Order.cart_items}
        style={styles.container}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={totalPrice}
      />
      }
      {/*Order.order_subtotal > 0 &&
      <View style={styles.itemRow}>
        <Text style={[styles.itemCol1, styles.itemText1]}>Subtotal:</Text>
        <Text style={[styles.itemCol2, styles.itemSubtotalCurrency]} numberOfLines={1} adjustsFontSizeToFit>${Order.order_subtotal.toFixed(0)}</Text>
      </View>
      }
      {Order.order_subtotal > 0 &&
      <Divider orientation="horizontal" />
      }
      {Order.order_total > 0 &&
      <View style={styles.itemRow}>
        <Text style={[styles.itemCol1, styles.itemText1]}>Total:</Text>
        <Text style={[styles.itemCol2, styles.itemTotalCurrency]} numberOfLines={1} adjustsFontSizeToFit>${Order.order_total.toFixed(0)}</Text>
      </View>
      }
      {Order.order_total > 0 &&
      <TouchableOpacity style={styles.btnWrap} onPress= { () => props.navigation.navigate('Checkout') }>
        <Text style= {styles.btnText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      */}

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
  container: {
    flex: 1,
    marginVertical: 10,
  },
  counterContainer: {
    flexDirection: 'row', 
    width: 120, 
    justifyContent: 'space-between'
  },
  counterIncrement: {
    borderColor: 'rgb(175,175,175)', 
    borderRadius: 25, 
    borderWidth: 2, 
    width: 35, 
    height: 35, 
    justifyContent: 'center'
  },
  counterDecrement: {
    borderColor: 'rgb(175,175,175)', 
    borderRadius: 25, 
    borderWidth: 2, 
    width: 35, 
    height: 35, 
    justifyContent: 'center'
  },
  counterText: {
    color: 'rgb(45,45,45)', 
    fontSize: 20, 
    fontWeight: 'bold', 
    paddingTop: 5
  },
  item: {
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 10,
    flex: 1,
    marginVertical: 5,
    //height: Dimensions.get('window').width / numColumns * .8, // approximate a square
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 5},
  },
  itemRow:{
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    //flex: 1,
    justifyContent: 'space-between'
  },
  itemCol1:{
    width: '70%',
    paddingRight: 15,
    alignContent: 'flex-start'
  },
  itemCol2:{
    width: '30%',
    textAlign: 'right'
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: "rgb(45,45,45)",
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemTextCurrency: {
    color: "rgb(247,108,55)",
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  itemText1:{
    color: "rgb(121,127,130)",
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemSubtotalCurrency: {
    color: "rgb(121,127,130)",
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemTotalCurrency: {
    color: "rgb(247,108,55)",
    fontSize: 26,
    fontWeight: 'bold',
  },
  itemDeleteBtn:{
    //textAlign: 'right',
    //textAlign: 'center',
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
});


export default CartScreen;
