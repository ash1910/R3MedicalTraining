import React, { useState, useEffect, useContext, useRef } from "react";
import { StatusBar, KeyboardAvoidingView, ScrollView, TouchableOpacity, View, StyleSheet, Text, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Alert} from "react-native";
import { CheckBox, Input } from 'react-native-elements'
import { AuthContext } from "../providers/AuthProvider";
import HeaderDefault from "../components/Header";
import { getOrder, clearCart } from "../functions/cart";

import { submitOrder, submitPayment, getStripeKey } from "../requests/Order";
//import { Secret_key, STRIPE_PUBLISHABLE_KEY } from '../../keys';
import { LiteCreditCardInput, CreditCardInput } from "react-native-credit-card-input-view";

const CURRENCY = 'USD';
var CARD_TOKEN = null;

async function getCreditCardToken(creditCardData, stripe_publishable_key){
  // alert()
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc
  };
  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${stripe_publishable_key}`
    },
    method: 'post',
    body: Object.keys(card).map(key => key + '=' + card[key]).join('&')
  }).
  then(response => response.json())
  .catch((error)=>console.log(error))
};

function subscribeUser(creditCardToken){
  return new Promise((resolve) => {
    //console.log('Credit card token\n', creditCardToken);
    CARD_TOKEN = creditCardToken.id;
    setTimeout(() => {
      resolve({ status: true });
    }, 1000);
  });
};

const Checkout = (props) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Terms, setTerms] = useState(true);
  const [CardInput, setCardInput] = useState({})
  const [PublishableKey, setPublishableKey] = useState(null)
  const [SecretKey, setSecretKey] = useState(null)
  let isMounted = true;

  const [Order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingAddCart, setLoadingAddCart] = useState(false);
  let auth = useContext(AuthContext);

  const doCheckout = async () =>  {
    if(!auth.IsLoggedIn){
      if (FirstName == "" || LastName == "" || Email == "" || Phone == "" || Password == "" || ConfirmPassword == "") {
        alert("Each Input must be filled out");
        if(FirstName == "") firstNameRef.current.focus();
        else if(LastName == "") lastNameRef.current.focus();
        else if(Email == "") emailRef.current.focus();
        else if(Phone == "") phoneRef.current.focus();
        else if(Password == "") passwordRef.current.focus();
        else if(ConfirmPassword == "") confirmPasswordRef.current.focus();
        return
      }
      if (Password != ConfirmPassword) {
        alert("Confirm Password must be same as Password");
        confirmPasswordRef.current.focus();
        return
      }
    }

    if (!Terms) {
      alert("Please agree to the terms and conditions");
      setTerms(!Terms);
      return
    }

    if (CardInput?.valid == false || typeof CardInput?.valid == "undefined") {
      alert("Please give valid card details");
      return
    }

    let order_params = {
      first_name: FirstName,
      last_name: LastName,
      email: Email,
      phone_number: Phone,
      cart_items: []
    };
    order_params.cart_items = Order.cart_items.map(item => { return {evt_id: item.evt_id, ticket_id: item.ticket_id, ticket_quantity: item.item_quantity}});
    if(auth.IsLoggedIn){
      order_params.user_id = auth.CurrentUser.id;
    }
    else{
      order_params.password = Password;
      order_params.confirm_password = ConfirmPassword;
    }
    try{
      setLoadingAddCart(true);
      let response = await submitOrder(order_params);
      //console.log(response);
      let order = {};
      if (response.ok) {
        order = response.data;
        if (order.success) {
          // payment
          let creditCardToken;
          try {
            // Create a credit card token
            creditCardToken = await getCreditCardToken(CardInput, PublishableKey);
            //console.log("creditCardToken", creditCardToken)
            if (creditCardToken.error) {
              setLoadingAddCart(false);
              alert("creditCardToken error");
              return;
            }
          } catch (e) {
            setLoadingAddCart(false);
            console.log("e",e);
            return;
          }

          // Send a request to your server with the received credit card token
          const { error } = await subscribeUser(creditCardToken);
          // Handle any errors from your server
          if (error) {
            setLoadingAddCart(false);
            alert(error)
          } else {
            let customer_data = {};
            try{
              customer_data = await createCustomer();
            }
            catch(e){
              setLoadingAddCart(false);
              console.log("e",e);
              return;
            }

            let pament_data = {};
            try{
              pament_data = await charges(order, customer_data);
              //console.log('pament_data', pament_data);
            }
            catch(e){
              setLoadingAddCart(false);
              console.log("stripe charge error", e);
            }
            if(pament_data?.status == 'paid'){
              try{
                // update paid status to server
                let payment_params = {
                  reg_status: "1",
                  reg_id: order.data.reg_id,
                  tnx_id: pament_data?.id,
                  tnx_date: pament_data?.created,
                  tnx_amount: pament_data?.amount,
                  email: pament_data?.receipt_email
                };
                let response = await submitPayment(payment_params);
                //console.log(response)
                setLoadingAddCart(false);
                if (response.ok) {
                  if (response.data.success) {
                    Alert.alert(
                      "Payment Successfully",
                      `Your Registration ID: ${response.data.data.reg_id}`,
                      [
                        { text: "OK", onPress: async() => {
                          await clearCart();
                          auth.setTotalCartItems(0);
                          props.navigation.navigate("Courses");
                        } }
                      ]
                    );
                  }
                  else{
                    alert("Failed");
                  }
                }
                else{
                  alert("Failed");
                }
              }
              catch(e){
                setLoadingAddCart(false);
                console.log("error", e);
                return;
              }
            }
            else{
              setLoadingAddCart(false);
              alert('Payment failed');
              return;
            }
          }
        } else {
          setLoadingAddCart(false);
          alert(order.message || Object.keys(order.data).map(key => key + ' : ' + order.data[key]).join('&'));
          return false;
        }
      }
      else{
        setLoadingAddCart(false);
        alert(response.problem);
        return false;
      }
    } catch(error){
      setLoadingAddCart(false);
      alert(error)
      return false;
    }
    
  }

  const createCustomer = async () => {
    const customer = {
      'source': CARD_TOKEN,
      'email': Email,
    };

    return fetch('https://api.stripe.com/v1/customers', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${SecretKey}`
      },
      method: 'post',
      body: Object.keys(customer).map(key => key + '=' + customer[key]).join('&')
    }).then(response => response.json());
  };

  const charges = async (order, customer) => {
    let total_price = parseFloat(order.data.total_price);
    if(total_price == 0) return;
    const card = {
      'customer': customer?.id,
      'amount': total_price * 100, 
      'currency': CURRENCY,
      //'source': CARD_TOKEN,
      'receipt_email': Email,
      'metadata[order_id]': order.data.reg_id,
      'description': `R3medicalTraining event registration from App. Reg ID: ${order.data.reg_id}`
    };

    return fetch('https://api.stripe.com/v1/charges', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${SecretKey}`
      },
      method: 'post',
      body: Object.keys(card).map(key => key + '=' + card[key]).join('&')
    }).then(response => response.json());
  };

  const _onChange =(data) => {
    //console.log(data)
    setCardInput(data)
  }

  const loadOrder = async () => {
    setLoading(true);
    let order = await getOrder() || {};
    if(isMounted){
      setOrder(order);
      setLoading(false);
    }
  };

  const getStripeKeyData = async () => {
    let response = await getStripeKey();
    if (response?.ok && response?.data?.success && isMounted) {
      setPublishableKey(response.data.data?.stripe_publishable_key);
      setSecretKey(response.data.data?.stripe_secret_key);
      //console.log(response.data)
    }
  };

  useEffect(() => {
    isMounted = true;
    if(auth.IsLoggedIn && isMounted){
      //console.log(auth.CurrentUser)
      setFirstName(auth.CurrentUser.firstName || "");
      setLastName(auth.CurrentUser.lastName || "");
      setEmail(auth.CurrentUser.email || "");
      setPhone(auth.CurrentUser.user_phone || "");
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
      isMounted = true;
      loadOrder();
    });
    getStripeKeyData();

    return () => {
      isMounted = false;
      unsubscribe();
    };
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
  {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
    <View style={styles.wrapperContainer}>
      <HeaderDefault {...props} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      {(!Order || !Order.cart_items || Order.cart_items.length < 1) &&
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[styles.itemText, {textAlign: "center"}]}>Cart is Empty</Text>
          <TouchableOpacity style={styles.btnWrap} onPress= { () => props.navigation.navigate('Courses') }>
            <Text style= {styles.btnText}>Courses</Text>
          </TouchableOpacity>
        </View>
      }
      {Order.order_total > 0 &&
      <ScrollView style={styles.container} contentContainerStyle={styles.listContainer}>
        {auth.IsLoggedIn &&
        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>First Name : </Text>
            <Text style={styles.infoVal}>{FirstName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Name : </Text>
            <Text style={styles.infoVal}>{LastName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email : </Text>
            <Text style={styles.infoVal} numberOfLines={1}>{Email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone : </Text>
            <Text style={styles.infoVal}>{Phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total : </Text>
            <Text style={[styles.infoVal, {fontSize: 20, fontWeight: 'bold'}]}>${Order.order_total.toFixed(2)}</Text>
          </View>
        </View>
        }
        {!auth.IsLoggedIn &&
        <View style={{flex: 1, flexDirection: "column",}}>
          <View style={styles.itemRow}>
            <View style={styles.itemCol1}>
              <Input
                ref={firstNameRef}
                label="First Name"
                style={styles.input}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                onChangeText= {input => setFirstName(input)}
                returnKeyType="next"
                onSubmitEditing={() => { lastNameRef.current.focus(); }}
                blurOnSubmit={false}
                autoCorrect={false}
                value={FirstName}
              />
            </View>
            <View style={styles.itemCol2}>
              <Input
                ref={lastNameRef}
                label="Last Name"
                style={styles.input}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                onChangeText= {input => setLastName(input)}
                returnKeyType="next"
                onSubmitEditing={() => { emailRef.current.focus(); }}
                blurOnSubmit={false}
                autoCorrect={false}
                value={LastName}
              />
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemCol1}>
              <Input
                ref={emailRef}
                label="Email Address"
                style={styles.input}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                onChangeText= {input => setEmail(input)}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => { phoneRef.current.focus(); }}
                blurOnSubmit={false}
                autoCorrect={false}
                autoCapitalize="none"
                value={Email}
              />
            </View>
            <View style={styles.itemCol2}>
              <Input
                ref={phoneRef}
                style={styles.input}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                label="Phone"
                onChangeText= {input => setPhone(input)}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={() => { passwordRef.current.focus(); }}
                blurOnSubmit={false}
                autoCorrect={false}
                value={Phone}
                />
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemCol1}>
              <Input
                ref={passwordRef}
                label="Password"
                style={styles.input}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                onChangeText= {input => setPassword(input)}
                returnKeyType="next"
                onSubmitEditing={() => { confirmPasswordRef.current.focus(); }}
                blurOnSubmit={false}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.itemCol2}>
              <Input
                ref={confirmPasswordRef}
                label="Confirm Password"
                style={styles.input}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                onChangeText= {input => setConfirmPassword(input)}
                returnKeyType="done"
                blurOnSubmit={false}
                onSubmitEditing={()=> Keyboard.dismiss()}
                secureTextEntry={true}
              />
            </View>
          </View>
        </View>
        }
        <View style={{flex: 1, flexDirection: "column",}}>
          <View style={styles.itemRow}>
            <View style={styles.itemColFull}>
              <CheckBox
                title='I agree to the Terms and conditions'
                checked={Terms}
                onPress={() => setTerms(!Terms)}
                textStyle={styles.checkboxText}
                checkedColor="rgb(46,46,46)"
                containerStyle={styles.checkboxContainer}
              />
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemColFull}>
              <View style={{marginHorizontal: 10}}>
                <Text style={{fontSize: 18,fontWeight: 'bold', marginHorizontal: 5, marginVertical: 10}}>Card</Text>
                <Text style={{fontSize: 15, fontStyle: 'italic', marginHorizontal: 5,  color: 'rgb(126,126,126)'}}>Enter your credit card information in order to proceed the payment.</Text>
              </View>
              <View style={styles.cardField}>
                <CreditCardInput 
                  placeholders={{
                    number: 'Card number',
                    postalCode: '12345',
                    cvc: 'CVC',
                    expiry: 'MM|YY',
                  }}
                  validColor="green"
                  invalidColor="red"
                  placeholderColor="#ccc"
                  inputStyle={{fontSize: 16}}
                  allowScroll={true}
                  onChange={_onChange} />
                </View>
            </View>
          </View>
          <TouchableOpacity style={styles.btnWrap} onPress= { () => doCheckout() }>
            <Text style= {styles.btnText}>Registration</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      }

      

      {loadingAddCart &&
      <View style={styles.loadingAddCart}>
        <ActivityIndicator size="large" color="white" animating={loadingAddCart} />
      </View>
      }
    </View>
  {/* </TouchableWithoutFeedback> */}
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: '6%',
  },
  info: {
    flex: 1, 
    flexDirection: "column",
    borderColor: "rgb(251,213,108)",
    borderWidth: 2,
    padding: 10,
    marginHorizontal: 10
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold', 
    fontSize: 17
  },
  infoVal: {
    fontSize: 17
  },
  itemRow:{
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: '1%',
    flex: 1,
    justifyContent: 'space-between'
  },
  itemCol1:{
    width: '50%',
  },
  itemCol2:{
    width: '50%',
  },
  itemColFull:{
    width: '100%',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: "rgb(45,45,45)",
    fontSize: 22,
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
    borderRadius:12,
    paddingHorizontal: '20%',
    paddingVertical: '3.5%',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    //marginBottom: 20
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
  input: {
    fontSize: 15,
    paddingHorizontal: 6,
    color: 'rgb(46,46,46)',
    backgroundColor: 'white',
    borderColor: "rgb(251,213,108)",
    borderRadius:12,
    borderWidth: 2,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.2,
    elevation: 2,
    shadowRadius: 5 ,
    shadowOffset : { width: 0, height: 1},
  },
  label:{
    color: 'rgb(46,46,46)',
    paddingBottom: 6,
    fontSize: 15
  },
  inputContainer:{
    borderBottomWidth: 0,
  },
  checkboxText:{
    color: 'rgb(46,46,46)',
    fontSize: 16,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  cardField: {
    width: '100%',
    //height: 450,
    flex: 1,
    marginTop: 20,
    marginBottom: 0,
    paddingTop: 70,
    borderColor: "rgb(251,213,108)",
    borderRadius:12,
    //borderWidth: 2,
    //shadowColor: 'rgba(0, 0, 0, 0.4)',
    //shadowOpacity: 0.5,
    //elevation: 6,
    //shadowRadius: 5 ,
    //shadowOffset : { width: 0, height: 5},
  },
});


export default Checkout;
