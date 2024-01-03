import { storeData, storeDataJSON, getData, getDataJSON, removeData } from "./AsyncStorageFunctions";

const getOrder = async () => { 
    try {
        return await getDataJSON("order") || {}
    } catch (error) {
        alert(error);
    }
};

const setOrder = async (order) => { 
    try {
        await storeDataJSON("order", order);
        return true;
    } catch (error) {
        alert(error);
        return false;
    }
};

const addToCart = async (item, itemQty = null, itemTotalQty = null) =>  {
    let order = await getOrder();
    let cartItem = {};
    let cartItems = order.cart_items || [];

    let cartIndex = cartItems.findIndex(cartItem => cartItem.evt_id == item.evt_id && cartItem.ticket_id == item.ticket_id);
    if(cartIndex >= 0){ // exit
      cartItem = {...cartItems[cartIndex]};
      let newQty = itemTotalQty !== null? parseInt(itemTotalQty) : parseInt(cartItem.item_quantity) + parseInt(itemQty);
      cartItem.item_quantity = newQty;
      cartItem.item_subtotal = cartItem.ticket_price * cartItem.item_quantity;
      cartItem.item_total = cartItem.item_subtotal;
      cartItems[cartIndex] = cartItem;
    }
    else{
      cartItem = {...item};
      cartItem.item_quantity = itemTotalQty !== null? parseInt(itemTotalQty) : parseInt(itemQty);
      cartItem.item_subtotal = cartItem.ticket_price * cartItem.item_quantity;
      cartItem.item_total = cartItem.item_subtotal;
      cartItems.push(cartItem);
    }
    // update order
    let order_subtotal = cartItems.reduce((a, b) => a + (b['item_subtotal'] || 0), 0);
    order.order_subtotal = order_subtotal;
    order.order_total = order_subtotal;
    order.cart_items = cartItems;

    try{
      await setOrder(order);
      return order;
    } catch (error){
      alert(error);
      return;
    }
    //console.log(order)
}

const removeFromCart = async (index) =>  {
    let order = await getOrder();
    let cartItems = order.cart_items || [];
    if (index > -1) {
        cartItems.splice(index, 1);
    }
    // update order
    let order_subtotal = cartItems.reduce((a, b) => a + (b['item_subtotal'] || 0), 0);
    order.order_subtotal = order_subtotal;
    order.order_total = order_subtotal;
    order.cart_items = cartItems;

    try{
      await setOrder(order);
      return order;
    } catch (error){
      alert(error);
      return;
    }
    //console.log(order)
}

const clearCart = async () =>  {
  try {
    await removeData("order");
    return true;
  } catch (error) {
      alert(error);
      return false;
  }
}

export { getOrder, setOrder, addToCart, removeFromCart, clearCart};